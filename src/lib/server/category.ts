import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, eq } from "drizzle-orm";
import { notFound } from "@tanstack/react-router";
import type {CategoryFormValues} from "@/lib/validations/category";
import db from "@/db";
import { categoriesTable, categoryFeaturesTable, propertiesTable, propertyFeaturesTable } from "@/schema";
import { categoryFormSchema  } from "@/lib/validations/category";

export interface CategoryTreeItem {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: Date;
    children: CategoryTreeItem[];
}

export const getCategories = createServerFn({ method: "GET" })
    .handler(async () => {
        return db
            .select()
            .from(categoriesTable)
            .orderBy(asc(categoriesTable.name));
    });

export const getCategoriesWithActiveCount = createServerFn({ method: "GET" })
    .handler(async () => {
        return db
            .select({
                id: categoriesTable.id,
                name: categoriesTable.name,
                parentId: categoriesTable.parentId,
                activeCount: count(propertiesTable.id),
            })
            .from(categoriesTable)
            .leftJoin(
                propertiesTable,
                and(
                    eq(categoriesTable.id, propertiesTable.categoryId),
                    eq(propertiesTable.listingStatus, 'active')
                )
            )
            .groupBy(categoriesTable.id, categoriesTable.name, categoriesTable.parentId)
            .orderBy(asc(categoriesTable.name));
    });

export const getCategoryTree = createServerFn({ method: "GET" })
    .handler(async () => {
        const allCategories = await db
            .select()
            .from(categoriesTable)
            .orderBy(asc(categoriesTable.name));

        // Build tree structure
        const categoryMap = new Map<string, CategoryTreeItem>();
        const rootCategories: CategoryTreeItem[] = [];

        // First pass: create all nodes
        for (const cat of allCategories) {
            categoryMap.set(cat.id, {
                ...cat,
                children: [],
            });
        }

        // Second pass: build tree
        for (const cat of allCategories) {
            const node = categoryMap.get(cat.id)!;
            if (cat.parentId) {
                const parent = categoryMap.get(cat.parentId);
                if (parent) {
                    parent.children.push(node);
                }
            } else {
                rootCategories.push(node);
            }
        }

        return rootCategories;
    });

export const getCategoryById = createServerFn({ method: "GET" })
    .inputValidator((id: string) => id)
    .handler(async ({ data: id }) => {
        try {
            const [category] = await db
                .select()
                .from(categoriesTable)
                .where(eq(categoriesTable.id, id));

            return category;
        } catch {
            throw notFound();
        }
    });

export const getCategoryFeatures = createServerFn({ method: "GET" })
    .inputValidator((categoryId: string) => categoryId)
    .handler(async ({ data: categoryId }) => {
        const features = await db
            .select({
                featureId: categoryFeaturesTable.featureId,
                featureName: propertyFeaturesTable.name,
            })
            .from(categoryFeaturesTable)
            .innerJoin(
                propertyFeaturesTable,
                eq(categoryFeaturesTable.featureId, propertyFeaturesTable.id)
            )
            .where(eq(categoryFeaturesTable.categoryId, categoryId));

        return features;
    });

async function saveCategoryFeatures(categoryId: string, featureIds: string[]) {
    // Delete existing relationships
    await db
        .delete(categoryFeaturesTable)
        .where(eq(categoryFeaturesTable.categoryId, categoryId));

    // Insert new relationships
    if (featureIds.length > 0) {
        await db.insert(categoryFeaturesTable).values(
            featureIds.map((featureId) => ({
                categoryId,
                featureId,
            }))
        );
    }
}

export const createCategory = createServerFn({ method: "POST" })
    .inputValidator((data: CategoryFormValues) => categoryFormSchema.parse(data))
    .handler(async ({ data }) => {
        const [newCategory] = await db
            .insert(categoriesTable)
            .values({
                name: data.name,
                parentId: data.parentId || null,
            })
            .returning({ id: categoriesTable.id});

        // Save category features
        if (data.features && data.features.length > 0) {
            await saveCategoryFeatures(newCategory.id, data.features);
        }

        return { success: true, category_id: newCategory.id };
    });

export const updateCategory = createServerFn({ method: "POST" })
    .inputValidator((data: { id: string } & CategoryFormValues) => ({
        id: data.id,
        ...categoryFormSchema.parse(data),
    }))
    .handler(async ({ data }) => {
        try {
            await db
                .update(categoriesTable)
                .set({
                    name: data.name,
                    parentId: data.parentId || null,
                })
                .where(eq(categoriesTable.id, data.id));

            // Update category features
            await saveCategoryFeatures(data.id, data.features || []);

            return { success: true, category_id: data.id };
        } catch {
            throw notFound();
        }
    });

export const deleteCategory = createServerFn({ method: "POST" })
    .inputValidator((id: string) => id)
    .handler(async ({ data: id }) => {
        // Check if category has children
        const children = await db
            .select({ id: categoriesTable.id })
            .from(categoriesTable)
            .where(eq(categoriesTable.parentId, id));

        if (children.length > 0) {
            throw new Error("Bu kategorinin alt kategorileri var. Önce alt kategorileri silin.");
        }

        await db
            .delete(categoriesTable)
            .where(eq(categoriesTable.id, id));

        return { success: true };
    });
