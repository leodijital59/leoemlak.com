import {createServerFn} from "@tanstack/react-start";
import {eq} from "drizzle-orm";
import db from "@/db";
import {propertyFeaturesTable, propertyPropertyFeaturesTable} from "@/schema";

/**
 * Tüm property feature'larını getirir
 */
export const getFeatures = createServerFn({ method: "GET" }).handler(async () => {
    return db.select().from(propertyFeaturesTable);
});

/**
 * Yeni bir property feature oluşturur
 */
export const createFeature = createServerFn({ method: "POST" })
    .inputValidator((data: { name: string }) => data)
    .handler(async ({ data }) => {
        const [newFeature] = await db
            .insert(propertyFeaturesTable)
            .values({ name: data.name })
            .returning();
        return newFeature;
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
