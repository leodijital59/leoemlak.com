CREATE TABLE "category_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"feature_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category_features" ADD CONSTRAINT "category_features_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_features" ADD CONSTRAINT "category_features_feature_id_property_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."property_features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cf_category_id_idx" ON "category_features" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "cf_feature_id_idx" ON "category_features" USING btree ("feature_id");