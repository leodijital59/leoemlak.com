import {createServerFn} from "@tanstack/react-start";
import {asc, count, eq} from "drizzle-orm";
import {notFound} from "@tanstack/react-router";
import db from "@/db";
import {propertyFeaturesTable, propertyPropertyFeaturesTable} from "@/schema";
import {featureFormSchema} from "@/lib/validations/feature";

/**
 * Tüm property feature'larını getirir
 */
export const getFeatures = createServerFn({ method: "GET" }).handler(async () => {
    return db.select().from(propertyFeaturesTable).orderBy(asc(propertyFeaturesTable.name));
});

/**
 * ID'ye göre bir property feature getirir
 */
export const getFeatureById = createServerFn({ method: "GET" })
    .inputValidator((id: string) => id)
    .handler(async ({ data: id }) => {
        const feature = await db
            .select()
            .from(propertyFeaturesTable)
            .where(eq(propertyFeaturesTable.id, id))
            .limit(1);

        if (!feature.length) {
            throw notFound();
        }

        return feature[0];
    });

/**
 * Yeni bir property feature oluşturur
 */
export const createFeature = createServerFn({ method: "POST" })
    .inputValidator((data: { name: string }) => {
        return featureFormSchema.parse(data);
    })
    .handler(async ({ data }) => {
        try {
            const [newFeature] = await db
                .insert(propertyFeaturesTable)
                .values({ name: data.name })
                .returning();
            return { success: true, feature_id: newFeature.id };
        } catch (error: any) {
            if (error.code === "23505") { // Unique constraint violation
                throw new Error("Bu özellik adı zaten mevcut");
            }
            throw error;
        }
    });

/**
 * Var olan bir property feature'ı günceller
 */
export const updateFeature = createServerFn({ method: "POST" })
    .inputValidator((data: { id: string; name: string }) => {
        featureFormSchema.parse({ name: data.name });
        return data;
    })
    .handler(async ({ data }) => {
        try {
            const [updatedFeature] = await db
                .update(propertyFeaturesTable)
                .set({ name: data.name })
                .where(eq(propertyFeaturesTable.id, data.id))
                .returning();

            return { success: true, feature: updatedFeature };
        } catch (error: any) {
            if (error.code === "23505") { // Unique constraint violation
                throw new Error("Bu özellik adı zaten mevcut");
            }
            throw error;
        }
    });

/**
 * Bir property feature'ın kaç ilana bağlı olduğunu döndürür
 */
export const getFeatureUsageCount = createServerFn({ method: "GET" })
    .inputValidator((id: string) => id)
    .handler(async ({ data: id }) => {
        const [usageResult] = await db
            .select({ count: count() })
            .from(propertyPropertyFeaturesTable)
            .where(eq(propertyPropertyFeaturesTable.featureId, id));

        return usageResult.count || 0;
    });

/**
 * Bir property feature'ı siler (ilişkili ilan bağlantılarıyla birlikte)
 */
export const deleteFeature = createServerFn({ method: "POST" })
    .inputValidator((id: string) => id)
    .handler(async ({ data: id }) => {
        try {
            // Önce bu özelliğin ilan bağlantılarını sil
            await db
                .delete(propertyPropertyFeaturesTable)
                .where(eq(propertyPropertyFeaturesTable.featureId, id));

            // Sonra özelliği sil
            await db
                .delete(propertyFeaturesTable)
                .where(eq(propertyFeaturesTable.id, id))
                .returning();

            return { success: true };
        } catch {
            throw notFound();
        }
    });

/**
 * Bir property'ye ait tüm feature'ları getirir
 */
export const getPropertyFeatures = createServerFn({ method: "GET" })
    .inputValidator((propertyId: string) => propertyId)
    .handler(async ({ data: propertyId }) => {
        return db
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
            .where(eq(propertyPropertyFeaturesTable.propertyId, propertyId));
    });
