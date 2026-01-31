import {index, pgEnum, pgTable} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const listingTypeEnum = pgEnum('listing_type', [
    'sold',
    'rented'
]);

export const listingStatusEnum = pgEnum('listing_status', [
    'active',
    'passive',
]);

export const heatingTypeEnum = pgEnum('heating_type', [
    'Yok',
    'Soba',
    'Dogalgaz',
    'Klima',
    'Merkezi',
    'Kombi',
    'Yerden',
    'Elektrik'
]);

export const buildingAgeEnum = pgEnum('building_age', [
    '0',
    '1-5',
    '6-10',
    '11-15',
    '16-20',
    '21+'
]);

// Property Categories Table (Hierarchical)
export const categoriesTable = pgTable("categories", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    name: t.varchar({length: 100}).notNull(),
    parentId: t.uuid('parent_id'),
    createdAt: t.timestamp('created_at').defaultNow().notNull(),
}));

// Properties Ana Tablosu
export const propertiesTable = pgTable("properties", (t) => ({
    // ID & Timestamps
    id: t.uuid().primaryKey().defaultRandom(),
    createdAt: t.timestamp('created_at').defaultNow().notNull(),
    updatedAt: t.timestamp('updated_at').defaultNow().notNull(),

    // Temel Bilgiler
    title: t.varchar({length: 500}).notNull(),
    description: t.text().notNull(),
    categoryId: t.uuid('category_id').notNull().references(() => categoriesTable.id),
    listingType: listingTypeEnum('listing_type').notNull(),
    listingStatus: listingStatusEnum('listing_status').default('active').notNull(),

    // Fiyat
    price: t.numeric('price', {precision: 12, scale: 2}).notNull(),
    pricePerSqm: t.numeric('price_per_sqm', {precision: 10, scale: 2}),

    // Konum Bilgileri
    province: t.varchar({length: 100}).notNull(),
    district: t.varchar({length: 100}).notNull(),
    neighborhood: t.varchar({length: 200}).notNull(),
    latitude: t.numeric({precision: 10, scale: 8}),
    longitude: t.numeric({precision: 11, scale: 8}),

    // Metrekare Bilgileri
    grossArea: t.integer(),
    netArea: t.integer(),
    landArea: t.integer(),

    // Oda Bilgileri
    rooms: t.integer(),
    bathrooms: t.integer(),

    // Bina Bilgileri
    buildingAge: buildingAgeEnum('building_age'),
    totalFloors: t.integer(),
    floorNumber: t.integer(),
    heatingType: heatingTypeEnum('heating_type'),

    // Boolean özellikler
    hasBalconies: t.boolean().default(false),
    hasElevator: t.boolean().default(false),
    hasParking: t.boolean().default(false),
    hasSecurity: t.boolean().default(false),
    isFurnished: t.boolean().default(false),
    isWithinSite: t.boolean().default(false),

    // Diğer
    videoUrl: t.varchar({length: 500}),
}));

// Property Images Tablosu
export const propertyImagesTable = pgTable("property_images", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    propertyId: t.uuid('property_id').notNull().references(() => propertiesTable.id, {onDelete: 'cascade'}),
    url: t.varchar({length: 1000}).notNull(),
    order: t.integer().default(0).notNull(),
    isMainImage: t.boolean('is_main_image').default(false).notNull(),
    createdAt: t.timestamp('created_at').defaultNow().notNull(),
}), (table) => [
    index('property_id_idx').on(table.propertyId),
]);

// Property Features Tablosu (Dinamik Özellikler)
export const propertyFeaturesTable = pgTable("property_features", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    name: t.varchar({length: 200}).notNull().unique(),
}));

// Property-Features Junction Tablosu (Many-to-Many)
export const propertyPropertyFeaturesTable = pgTable("property_property_features", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    propertyId: t.uuid('property_id').notNull().references(() => propertiesTable.id, {onDelete: 'cascade'}),
    featureId: t.uuid('feature_id').notNull().references(() => propertyFeaturesTable.id, {onDelete: 'cascade'}),
}), (table) => [
    index('ppf_property_id_idx').on(table.propertyId),
    index('ppf_feature_id_idx').on(table.featureId),
]);

// Relations
export const propertyCategoriesRelations = relations(categoriesTable, ({one, many}) => ({
    parent: one(categoriesTable, {
        fields: [categoriesTable.parentId],
        references: [categoriesTable.id],
        relationName: 'categoryHierarchy',
    }),
    children: many(categoriesTable, {
        relationName: 'categoryHierarchy',
    }),
    properties: many(propertiesTable),
}));

export const propertiesRelations = relations(propertiesTable, ({one, many}) => ({
    category: one(categoriesTable, {
        fields: [propertiesTable.categoryId],
        references: [categoriesTable.id],
    }),
    images: many(propertyImagesTable),
    propertyFeatures: many(propertyPropertyFeaturesTable),
}));

export const propertyImagesRelations = relations(propertyImagesTable, ({one}) => ({
    property: one(propertiesTable, {
        fields: [propertyImagesTable.propertyId],
        references: [propertiesTable.id],
    }),
}));

export const propertyFeaturesRelations = relations(propertyFeaturesTable, ({many}) => ({
    properties: many(propertyPropertyFeaturesTable),
}));

export const propertyPropertyFeaturesRelations = relations(propertyPropertyFeaturesTable, ({one}) => ({
    property: one(propertiesTable, {
        fields: [propertyPropertyFeaturesTable.propertyId],
        references: [propertiesTable.id],
    }),
    feature: one(propertyFeaturesTable, {
        fields: [propertyPropertyFeaturesTable.featureId],
        references: [propertyFeaturesTable.id],
    }),
}));
