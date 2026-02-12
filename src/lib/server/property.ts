import { createServerFn } from "@tanstack/react-start";
import { del, put } from "@vercel/blob";
import { and, asc, count, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { notFound } from "@tanstack/react-router";
import type { SQL } from "drizzle-orm";
import type { PropertySearchParams } from "@/lib/validations/property-search";
import db from "@/db";
import { categoriesTable, propertiesTable, propertyFeaturesTable, propertyImagesTable, propertyPropertyFeaturesTable } from "@/schema";
import { propertyFormSchema } from "@/lib/validations/property";
import { propertySearchSchema } from "@/lib/validations/property-search";

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

        // Feature'ları parse et
        const featuresJson = formData.get("features") as string;
        const features: { featureId: string; value: boolean }[] = JSON.parse(featuresJson || "[]");

        // 1. Property'yi database'e ekle
        const [newProperty] = await db.insert(propertiesTable).values({
            title: propertyData.title,
            description: propertyData.description,
            categoryId: propertyData.categoryId,
            listingType: propertyData.listingType,
            listingStatus: propertyData.listingStatus,
            price: propertyData.price.toString(),
            pricePerSqm: propertyData.pricePerSqm?.toString() ?? null,
            province: propertyData.province,
            district: propertyData.district,
            neighborhood: propertyData.neighborhood,
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
            videoUrl: propertyData.videoUrl ?? null,
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

        // 3. Feature'ları ekle
        if (features.length > 0) {
            const featureRecords = features.map(f => ({
                propertyId: newProperty.id,
                featureId: f.featureId,
                value: f.value,
            }));
            await db.insert(propertyPropertyFeaturesTable).values(featureRecords);
        }

        return { success: true, propertyId: newProperty.id };
    });

export const getProperties = createServerFn({ method: "GET" })
    .handler(async () => {
        const results = await db
            .select({
                property: propertiesTable,
                image: propertyImagesTable,
                category: categoriesTable,
            })
            .from(propertiesTable)
            .leftJoin(propertyImagesTable, eq(propertiesTable.id, propertyImagesTable.propertyId))
            .leftJoin(categoriesTable, eq(propertiesTable.categoryId, categoriesTable.id))
            .orderBy(desc(propertiesTable.createdAt));

        // Group images by property
        const propertiesMap = new Map<string, {
            property: typeof propertiesTable.$inferSelect;
            images: (typeof propertyImagesTable.$inferSelect)[];
            category: typeof categoriesTable.$inferSelect | null;
        }>();

        for (const row of results) {
            const propertyId = row.property.id;
            if (!propertiesMap.has(propertyId)) {
                propertiesMap.set(propertyId, {
                    property: row.property,
                    images: [],
                    category: row.category,
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

            const features = await db
                .select({
                    featureId: propertyPropertyFeaturesTable.featureId,
                    value: propertyPropertyFeaturesTable.value,
                    featureName: propertyFeaturesTable.name,
                })
                .from(propertyPropertyFeaturesTable)
                .innerJoin(
                    propertyFeaturesTable,
                    eq(propertyPropertyFeaturesTable.featureId, propertyFeaturesTable.id)
                )
                .where(eq(propertyPropertyFeaturesTable.propertyId, id));

            return { property, images, features };
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

        // Feature'ları parse et
        const featuresJson = formData.get("features") as string;
        const features: { featureId: string; value: boolean }[] = JSON.parse(featuresJson || "[]");

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
                categoryId: propertyData.categoryId,
                listingType: propertyData.listingType,
                listingStatus: propertyData.listingStatus,
                price: propertyData.price.toString(),
                pricePerSqm: propertyData.pricePerSqm?.toString() ?? null,
                province: propertyData.province,
                district: propertyData.district,
                neighborhood: propertyData.neighborhood,
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
                videoUrl: propertyData.videoUrl ?? null,
            })
            .where(eq(propertiesTable.id, propertyId));

        // 5. Update features (replace strategy: delete all, insert new)
        await db.delete(propertyPropertyFeaturesTable).where(eq(propertyPropertyFeaturesTable.propertyId, propertyId));

        if (features.length > 0) {
            const featureRecords = features.map(f => ({
                propertyId,
                featureId: f.featureId,
                value: f.value,
            }));
            await db.insert(propertyPropertyFeaturesTable).values(featureRecords);
        }

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

const PAGE_SIZE = 12;

export const searchProperties = createServerFn({ method: "GET" })
    .inputValidator((data: PropertySearchParams) => propertySearchSchema.parse(data))
    .handler(async ({ data: params }) => {
        const conditions: SQL[] = [eq(propertiesTable.listingStatus, "active")];

        if (params.q) {
            conditions.push(ilike(propertiesTable.title, `%${params.q}%`));
        }
        if (params.listingType) {
            conditions.push(eq(propertiesTable.listingType, params.listingType));
        }
        if (params.categoryId) {
            conditions.push(eq(propertiesTable.categoryId, params.categoryId));
        }
        if (params.priceMin) {
            conditions.push(gte(sql`${propertiesTable.price}::numeric`, params.priceMin));
        }
        if (params.priceMax) {
            conditions.push(lte(sql`${propertiesTable.price}::numeric`, params.priceMax));
        }
        if (params.rooms) {
            conditions.push(gte(propertiesTable.rooms, params.rooms));
        }
        if (params.bathrooms) {
            conditions.push(gte(propertiesTable.bathrooms, params.bathrooms));
        }
        if (params.province) {
            conditions.push(eq(propertiesTable.province, params.province));
        }
        if (params.district) {
            conditions.push(eq(propertiesTable.district, params.district));
        }
        if (params.neighborhood) {
            conditions.push(eq(propertiesTable.neighborhood, params.neighborhood));
        }
        if (params.grossAreaMin) {
            conditions.push(gte(propertiesTable.grossArea, params.grossAreaMin));
        }
        if (params.grossAreaMax) {
            conditions.push(lte(propertiesTable.grossArea, params.grossAreaMax));
        }

        const whereClause = and(...conditions);

        // Sort
        let orderByClause;
        switch (params.sort) {
            case "price_asc":
                orderByClause = asc(sql`${propertiesTable.price}::numeric`);
                break;
            case "price_desc":
                orderByClause = desc(sql`${propertiesTable.price}::numeric`);
                break;
            default:
                orderByClause = desc(propertiesTable.createdAt);
        }

        const page = params.page ?? 1;
        const offset = (page - 1) * PAGE_SIZE;

        // Get total count
        const [{ total }] = await db
            .select({ total: count() })
            .from(propertiesTable)
            .where(whereClause);

        // Get properties with images and category
        const results = await db
            .select({
                property: propertiesTable,
                image: propertyImagesTable,
                category: categoriesTable,
            })
            .from(propertiesTable)
            .leftJoin(propertyImagesTable, eq(propertiesTable.id, propertyImagesTable.propertyId))
            .leftJoin(categoriesTable, eq(propertiesTable.categoryId, categoriesTable.id))
            .where(whereClause)
            .orderBy(orderByClause)
            .limit(PAGE_SIZE)
            .offset(offset);

        // Group images by property
        const propertiesMap = new Map<string, {
            property: typeof propertiesTable.$inferSelect;
            images: (typeof propertyImagesTable.$inferSelect)[];
            category: typeof categoriesTable.$inferSelect | null;
        }>();

        for (const row of results) {
            const propertyId = row.property.id;
            if (!propertiesMap.has(propertyId)) {
                propertiesMap.set(propertyId, {
                    property: row.property,
                    images: [],
                    category: row.category,
                });
            }
            if (row.image) {
                propertiesMap.get(propertyId)!.images.push(row.image);
            }
        }

        const totalPages = Math.ceil(total / PAGE_SIZE);

        return {
            properties: Array.from(propertiesMap.values()),
            total,
            page,
            pageSize: PAGE_SIZE,
            totalPages,
        };
    });

export const getDistinctLocations = createServerFn({ method: "GET" })
    .handler(async () => {
        const provinces = await db
            .selectDistinct({ province: propertiesTable.province })
            .from(propertiesTable)
            .where(eq(propertiesTable.listingStatus, "active"))
            .orderBy(asc(propertiesTable.province));

        const districts = await db
            .selectDistinct({
                province: propertiesTable.province,
                district: propertiesTable.district,
            })
            .from(propertiesTable)
            .where(eq(propertiesTable.listingStatus, "active"))
            .orderBy(asc(propertiesTable.province), asc(propertiesTable.district));

        const neighborhoods = await db
            .selectDistinct({
                province: propertiesTable.province,
                district: propertiesTable.district,
                neighborhood: propertiesTable.neighborhood,
            })
            .from(propertiesTable)
            .where(eq(propertiesTable.listingStatus, "active"))
            .orderBy(asc(propertiesTable.province), asc(propertiesTable.district), asc(propertiesTable.neighborhood));

        return {
            provinces: provinces.map((p) => p.province),
            districts: districts.map((d) => ({ province: d.province, district: d.district })),
            neighborhoods: neighborhoods.map((n) => ({ province: n.province, district: n.district, neighborhood: n.neighborhood })),
        };
    });
