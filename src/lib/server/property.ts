import { createServerFn } from "@tanstack/react-start";
import { del, put } from "@vercel/blob";
import { desc, eq } from "drizzle-orm";
import { notFound } from "@tanstack/react-router";
import db from "@/db";
import { propertiesTable, propertyImagesTable } from "@/schema";
import { propertyFormSchema } from "@/lib/validations/property";

export const createProperty = createServerFn({ method: "POST" })
    .inputValidator((data: FormData) => data)
    .handler(async ({ data: formData }) => {
        // Property verilerini parse et
        const propertyDataJson = formData.get("property") as string;
        const propertyData = propertyFormSchema.parse(JSON.parse(propertyDataJson));

        // Image metadata'larını parse et (extension ve isMain bilgisi)
        const imageMetaJson = formData.get("imageMeta") as string;
        const imageMeta: { extension: string; isMain: boolean }[] = JSON.parse(imageMetaJson || "[]");

        // Image dosyalarını al
        const imageFiles = formData.getAll("images") as File[];

        // 1. Property'yi database'e ekle
        const [newProperty] = await db.insert(propertiesTable).values({
            title: propertyData.title,
            description: propertyData.description,
            propertyType: propertyData.propertyType,
            listingType: propertyData.listingType,
            listingStatus: propertyData.listingStatus,
            price: propertyData.price.toString(),
            pricePerSqm: propertyData.pricePerSqm?.toString() ?? null,
            province: propertyData.province,
            district: propertyData.district,
            neighborhood: propertyData.neighborhood ?? null,
            address: propertyData.address ?? null,
            latitude: propertyData.latitude?.toString() ?? null,
            longitude: propertyData.longitude?.toString() ?? null,
            grossArea: propertyData.grossArea ?? null,
            netArea: propertyData.netArea ?? null,
            landArea: propertyData.landArea ?? null,
            rooms: propertyData.rooms ?? null,
            bathrooms: propertyData.bathrooms ?? null,
            buildingAge: propertyData.buildingAge ?? null,
            totalFloors: propertyData.totalFloors ?? null,
            floorNumber: propertyData.floorNumber ?? null,
            heatingType: propertyData.heatingType ?? null,
            hasBalconies: propertyData.hasBalconies,
            hasElevator: propertyData.hasElevator,
            hasParking: propertyData.hasParking,
            hasSecurity: propertyData.hasSecurity,
            isFurnished: propertyData.isFurnished,
            isWithinSite: propertyData.isWithinSite,
            videoUrl: propertyData.videoUrl || null,
        }).returning({ id: propertiesTable.id });

        // 2. Image'ları Vercel Blob'a yükle ve URL'leri kaydet
        if (imageFiles.length > 0) {
            const imageRecords = await Promise.all(
                imageFiles.map(async (file, index) => {
                    const meta = imageMeta[index];

                    // UUID ile benzersiz dosya adı oluştur
                    const uniqueFileName = `${crypto.randomUUID()}.${meta.extension}`;

                    // Vercel Blob'a yükle
                    const blob = await put(`properties/${newProperty.id}/${uniqueFileName}`, file, {
                        access: "public",
                    });

                    return {
                        propertyId: newProperty.id,
                        url: blob.url,
                        order: index,
                        isMainImage: meta.isMain,
                    };
                })
            );

            await db.insert(propertyImagesTable).values(imageRecords);
        }

        return { success: true, propertyId: newProperty.id };
    });

export const getProperties = createServerFn({ method: "GET" })
    .handler(async () => {
        const results = await db
            .select({
                property: propertiesTable,
                image: propertyImagesTable,
            })
            .from(propertiesTable)
            .leftJoin(propertyImagesTable, eq(propertiesTable.id, propertyImagesTable.propertyId))
            .orderBy(desc(propertiesTable.createdAt));

        // Group images by property
        const propertiesMap = new Map<string, {
            property: typeof propertiesTable.$inferSelect;
            images: (typeof propertyImagesTable.$inferSelect)[];
        }>();

        for (const row of results) {
            const propertyId = row.property.id;
            if (!propertiesMap.has(propertyId)) {
                propertiesMap.set(propertyId, {
                    property: row.property,
                    images: [],
                });
            }
            if (row.image) {
                propertiesMap.get(propertyId)!.images.push(row.image);
            }
        }

        return Array.from(propertiesMap.values());
    });

export const deleteProperty = createServerFn({ method: "POST" })
    .inputValidator((id: string) => id)
    .handler(async ({ data: id }: { data: string }) => {
        // First get all images to delete from blob storage
        const images = await db
            .select({ url: propertyImagesTable.url })
            .from(propertyImagesTable)
            .where(eq(propertyImagesTable.propertyId, id));

        // Delete images from Vercel Blob
        if (images.length > 0) {
            await Promise.all(
                images.map(async (img) => {
                    try {
                        await del(img.url);
                    } catch (error) {
                        console.error(`Failed to delete blob: ${img.url}`, error);
                    }
                })
            );
        }

        // Delete property (images will cascade delete)
        await db.delete(propertiesTable).where(eq(propertiesTable.id, id));
        return { success: true };
    });

export const getPropertyById = createServerFn({ method: "GET" })
    .inputValidator((id: string) => id)
    .handler(async ({ data: id }: { data: string }) => {
        try {
            const [property] = await db
                .select()
                .from(propertiesTable)
                .where(eq(propertiesTable.id, id));

            const images = await db
                .select()
                .from(propertyImagesTable)
                .where(eq(propertyImagesTable.propertyId, id))
                .orderBy(propertyImagesTable.order);
            return { property, images };
        } catch {
            throw notFound();
        }
    });

export const updateProperty = createServerFn({ method: "POST" })
    .inputValidator((data: FormData) => data)
    .handler(async ({ data: formData }) => {
        // Get property ID
        const propertyId = formData.get("propertyId") as string;
        if (!propertyId) {
            throw new Error("Property ID is required");
        }

        // Property verilerini parse et
        const propertyDataJson = formData.get("property") as string;
        const propertyData = propertyFormSchema.parse(JSON.parse(propertyDataJson));

        // Image metadata'larını parse et (extension ve isMain bilgisi)
        const imageMetaJson = formData.get("imageMeta") as string;
        const imageMeta: { extension: string; isMain: boolean }[] = JSON.parse(imageMetaJson || "[]");

        // Existing images to keep (with their new order and isMain status)
        const existingImagesJson = formData.get("existingImages") as string;
        const existingImages: { id: string; isMain: boolean; order: number }[] = JSON.parse(existingImagesJson || "[]");

        // Images to delete
        const imagesToDeleteJson = formData.get("imagesToDelete") as string;
        const imagesToDelete: string[] = JSON.parse(imagesToDeleteJson || "[]");

        // New image files
        const imageFiles = formData.getAll("images") as File[];

        // 1. Delete removed images from Vercel Blob and database
        if (imagesToDelete.length > 0) {
            const imagesToDeleteData = await db
                .select({ id: propertyImagesTable.id, url: propertyImagesTable.url })
                .from(propertyImagesTable)
                .where(eq(propertyImagesTable.propertyId, propertyId));

            const urlsToDelete = imagesToDeleteData
                .filter(img => imagesToDelete.includes(img.id))
                .map(img => img.url);

            // Delete from Vercel Blob
            await Promise.all(
                urlsToDelete.map(async (url) => {
                    try {
                        await del(url);
                    } catch (error) {
                        console.error(`Failed to delete blob: ${url}`, error);
                    }
                })
            );

            // Delete from database
            for (const imageId of imagesToDelete) {
                await db.delete(propertyImagesTable).where(eq(propertyImagesTable.id, imageId));
            }
        }

        // 2. Update existing images (order and isMain)
        for (const img of existingImages) {
            await db
                .update(propertyImagesTable)
                .set({ order: img.order, isMainImage: img.isMain })
                .where(eq(propertyImagesTable.id, img.id));
        }

        // 3. Upload new images to Vercel Blob
        if (imageFiles.length > 0) {
            const startOrder = existingImages.length;
            const imageRecords = await Promise.all(
                imageFiles.map(async (file, index) => {
                    const meta = imageMeta[index];

                    // UUID ile benzersiz dosya adı oluştur
                    const uniqueFileName = `${crypto.randomUUID()}.${meta.extension}`;

                    // Vercel Blob'a yükle
                    const blob = await put(`properties/${propertyId}/${uniqueFileName}`, file, {
                        access: "public",
                    });

                    return {
                        propertyId,
                        url: blob.url,
                        order: startOrder + index,
                        isMainImage: meta.isMain,
                    };
                })
            );

            await db.insert(propertyImagesTable).values(imageRecords);
        }

        // 4. Update property data
        await db
            .update(propertiesTable)
            .set({
                title: propertyData.title,
                description: propertyData.description,
                propertyType: propertyData.propertyType,
                listingType: propertyData.listingType,
                listingStatus: propertyData.listingStatus,
                price: propertyData.price.toString(),
                pricePerSqm: propertyData.pricePerSqm?.toString() ?? null,
                province: propertyData.province,
                district: propertyData.district,
                neighborhood: propertyData.neighborhood ?? null,
                address: propertyData.address ?? null,
                latitude: propertyData.latitude?.toString() ?? null,
                longitude: propertyData.longitude?.toString() ?? null,
                grossArea: propertyData.grossArea ?? null,
                netArea: propertyData.netArea ?? null,
                landArea: propertyData.landArea ?? null,
                rooms: propertyData.rooms ?? null,
                bathrooms: propertyData.bathrooms ?? null,
                buildingAge: propertyData.buildingAge ?? null,
                totalFloors: propertyData.totalFloors ?? null,
                floorNumber: propertyData.floorNumber ?? null,
                heatingType: propertyData.heatingType ?? null,
                hasBalconies: propertyData.hasBalconies,
                hasElevator: propertyData.hasElevator,
                hasParking: propertyData.hasParking,
                hasSecurity: propertyData.hasSecurity,
                isFurnished: propertyData.isFurnished,
                isWithinSite: propertyData.isWithinSite,
                videoUrl: propertyData.videoUrl || null,
                updatedAt: new Date(),
            })
            .where(eq(propertiesTable.id, propertyId));

        return { success: true, propertyId };
    });

export const deletePropertyImage = createServerFn({ method: "POST" })
    .inputValidator((id: string) => id)
    .handler(async ({ data: id }: { data: string }) => {
        try {
            // Get image URL first
            const [image] = await db
                .select({ url: propertyImagesTable.url })
                .from(propertyImagesTable)
                .where(eq(propertyImagesTable.id, id));

            // Delete from Vercel Blob
            try {
                await del(image.url);
            } catch (error) {
                console.error(`Failed to delete blob: ${image.url}`, error);
            }

            // Delete from database
            await db.delete(propertyImagesTable).where(eq(propertyImagesTable.id, id));

            return { success: true };
        } catch {
            throw notFound();
        }
    });
