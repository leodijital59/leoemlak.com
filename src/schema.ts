import { boolean, decimal, index, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum Definitions
export const propertyTypeEnum = pgEnum('property_type', [
    'konut_daire',
    'konut_villa',
    'konut_mustakil',
    'konut_residence',
    'isyeri_ofis',
    'isyeri_dukkan',
    'isyeri_depo',
    'isyeri_fabrika',
]);

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

// Properties Ana Tablosu
export const propertiesTable = pgTable("properties", {
    // ID & Timestamps
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),

    // Temel Bilgiler
    title: varchar({ length: 500 }).notNull(),
    description: text().notNull(),
    propertyType: propertyTypeEnum('property_type').notNull(),
    listingType: listingTypeEnum('listing_type').notNull(),
    listingStatus: listingStatusEnum('listing_status').default('active').notNull(),

    // Fiyat
    price: decimal('price', { precision: 12, scale: 2 }).notNull(),
    pricePerSqm: decimal('price_per_sqm', { precision: 10, scale: 2 }),

    // Konum Bilgileri
    province: varchar({ length: 100 }).notNull(),
    district: varchar({ length: 100 }).notNull(),
    neighborhood: varchar({ length: 200 }),
    address: text(),
    latitude: decimal({ precision: 10, scale: 8 }),
    longitude: decimal({ precision: 11, scale: 8 }),

    // Metrekare Bilgileri
    grossArea: integer(),
    netArea: integer(),
    landArea: integer(),

    // Oda Bilgileri
    rooms: integer(),
    bathrooms: integer(),

    // Bina Bilgileri
    buildingAge: buildingAgeEnum('building_age'),
    totalFloors: integer(),
    floorNumber: integer(),
    heatingType: heatingTypeEnum('heating_type'),

    // Boolean özellikler
    hasBalconies: boolean().default(false),
    hasElevator: boolean().default(false),
    hasParking: boolean().default(false),
    hasSecurity: boolean().default(false),
    isFurnished: boolean().default(false),
    isWithinSite: boolean().default(false),

    // Diğer
    videoUrl: varchar({ length: 500 }),
});

// Property Images Tablosu
export const propertyImagesTable = pgTable("property_images", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    propertyId: integer('property_id').notNull().references(() => propertiesTable.id, { onDelete: 'cascade' }),
    url: varchar({ length: 1000 }).notNull(),
    order: integer().default(0).notNull(),
    isMainImage: boolean('is_main_image').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
    index('property_id_idx').on(table.propertyId),
]);

// Property Features Tablosu (Dinamik Özellikler)
export const propertyFeaturesTable = pgTable("property_features", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 200 }).notNull().unique(),
});

// Property-Features Junction Tablosu (Many-to-Many)
export const propertyPropertyFeaturesTable = pgTable("property_property_features", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    propertyId: integer('property_id').notNull().references(() => propertiesTable.id, { onDelete: 'cascade' }),
    featureId: integer('feature_id').notNull().references(() => propertyFeaturesTable.id, { onDelete: 'cascade' }),
}, (table) => [
    index('ppf_property_id_idx').on(table.propertyId),
    index('ppf_feature_id_idx').on(table.featureId),
]);

// Relations
export const propertiesRelations = relations(propertiesTable, ({ many }) => ({
    images: many(propertyImagesTable),
    propertyFeatures: many(propertyPropertyFeaturesTable),
}));

export const propertyImagesRelations = relations(propertyImagesTable, ({ one }) => ({
    property: one(propertiesTable, {
        fields: [propertyImagesTable.propertyId],
        references: [propertiesTable.id],
    }),
}));

export const propertyFeaturesRelations = relations(propertyFeaturesTable, ({ many }) => ({
    properties: many(propertyPropertyFeaturesTable),
}));

export const propertyPropertyFeaturesRelations = relations(propertyPropertyFeaturesTable, ({ one }) => ({
    property: one(propertiesTable, {
        fields: [propertyPropertyFeaturesTable.propertyId],
        references: [propertiesTable.id],
    }),
    feature: one(propertyFeaturesTable, {
        fields: [propertyPropertyFeaturesTable.featureId],
        references: [propertyFeaturesTable.id],
    }),
}));
