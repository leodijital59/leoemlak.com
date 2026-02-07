CREATE TYPE "public"."heating_type" AS ENUM('Yok', 'Soba', 'Dogalgaz', 'Klima', 'Merkezi', 'Kombi', 'Yerden', 'Elektrik');--> statement-breakpoint
CREATE TYPE "public"."listing_status" AS ENUM('active', 'passive');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('sold', 'rented');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"parent_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"feature_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"category_id" uuid NOT NULL,
	"listing_type" "listing_type" NOT NULL,
	"listing_status" "listing_status" DEFAULT 'active' NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"price_per_sqm" numeric(10, 2),
	"province" varchar(100) NOT NULL,
	"district" varchar(100) NOT NULL,
	"neighborhood" varchar(200) NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"grossArea" integer,
	"netArea" integer,
	"landArea" integer,
	"rooms" smallint,
	"bathrooms" smallint,
	"buildingAge" smallint,
	"totalFloors" smallint,
	"floorNumber" smallint,
	"heating_type" "heating_type",
	"videoUrl" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "property_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	CONSTRAINT "property_features_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "property_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"url" varchar(1000) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_main_image" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_property_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"feature_id" uuid NOT NULL,
	"value" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category_features" ADD CONSTRAINT "category_features_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_features" ADD CONSTRAINT "category_features_feature_id_property_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."property_features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_property_features" ADD CONSTRAINT "property_property_features_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_property_features" ADD CONSTRAINT "property_property_features_feature_id_property_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."property_features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cf_category_id_idx" ON "category_features" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "cf_feature_id_idx" ON "category_features" USING btree ("feature_id");--> statement-breakpoint
CREATE INDEX "property_id_idx" ON "property_images" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "ppf_property_id_idx" ON "property_property_features" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "ppf_feature_id_idx" ON "property_property_features" USING btree ("feature_id");