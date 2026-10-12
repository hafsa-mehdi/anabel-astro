import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_cleaning_process_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_settings_hours_days" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  CREATE TYPE "public"."enum_settings_social_platform" AS ENUM('Facebook', 'Instagram', 'Pinterest', 'YouTube');
  CREATE TABLE "repairs_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "repairs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_image_id" integer,
  	"hero_alt" varchar,
  	"intro" varchar,
  	"body" jsonb,
  	"form_heading" varchar DEFAULT 'Book now and get 15% off',
  	"form_intro" varchar,
  	"cta_heading" varchar,
  	"cta_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "areas_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "areas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"hero_image_id" integer,
  	"hero_alt" varchar,
  	"cities_heading" varchar,
  	"form_heading" varchar,
  	"form_intro" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"pub_date" timestamp(3) with time zone NOT NULL,
  	"hero_image_id" integer,
  	"hero_alt" varchar,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"quote" varchar,
  	"source" varchar,
  	"rating" numeric DEFAULT 5,
  	"date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"repairs_id" integer,
  	"areas_id" integer,
  	"posts_id" integer,
  	"testimonials_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_services_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "home_cleaning_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "home_repairs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_kicker" varchar,
  	"hero_heading" varchar,
  	"hero_subtitle" varchar,
  	"hero_primary_label" varchar,
  	"hero_primary_url" varchar,
  	"hero_secondary_label" varchar,
  	"hero_secondary_url" varchar,
  	"services_label" varchar,
  	"services_heading" varchar,
  	"services_intro" varchar,
  	"cleaning_label" varchar,
  	"cleaning_heading" varchar,
  	"cleaning_primary_label" varchar,
  	"cleaning_primary_url" varchar,
  	"cleaning_secondary_label" varchar,
  	"cleaning_secondary_url" varchar,
  	"repairs_label" varchar,
  	"repairs_heading" varchar,
  	"repairs_intro" varchar,
  	"reviews_label" varchar,
  	"reviews_heading" varchar,
  	"reviews_rating_text" varchar,
  	"visit_label" varchar,
  	"visit_heading" varchar,
  	"visit_intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cleaning_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "cleaning_process_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "cleaning" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_image_id" integer,
  	"hero_alt" varchar,
  	"kicker" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"form_heading" varchar,
  	"form_intro" varchar,
  	"process_heading" varchar,
  	"process_image_id" integer,
  	"process_image_alt" varchar,
  	"process_image_position" "enum_cleaning_process_image_position" DEFAULT 'left',
  	"pet_note_heading" varchar,
  	"pet_note_body" varchar,
  	"interval_heading" varchar,
  	"interval_body" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "visit" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"map_label" varchar,
  	"hours_heading" varchar,
  	"areas_heading" varchar,
  	"areas_intro" varchar,
  	"form_heading" varchar,
  	"form_intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"bio" varchar,
  	"photo_id" integer,
  	"photo_alt" varchar
  );
  
  CREATE TABLE "team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"kicker" varchar,
  	"heading" varchar,
  	"story_heading" varchar,
  	"story_body" varchar,
  	"story_image_id" integer,
  	"story_image_alt" varchar,
  	"members_heading" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "tour" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"tour_url" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "designers_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "designers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"benefits_heading" varchar,
  	"benefits_image_id" integer,
  	"benefits_image_alt" varchar,
  	"form_heading" varchar,
  	"form_intro" varchar,
  	"form_documents_help" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "blog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings_map_towns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"latitude" varchar,
  	"longitude" varchar
  );
  
  CREATE TABLE "settings_hours_days" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_settings_hours_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "settings_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"closed" boolean DEFAULT false,
  	"opens" varchar,
  	"closes" varchar
  );
  
  CREATE TABLE "settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_settings_social_platform" DEFAULT 'Facebook',
  	"url" varchar
  );
  
  CREATE TABLE "settings_service_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "settings_main_menu_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "settings_main_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"business_name" varchar,
  	"wordmark_name" varchar,
  	"wordmark_tagline" varchar,
  	"logo_id" integer,
  	"phone" varchar,
  	"email" varchar,
  	"address_street" varchar,
  	"address_city" varchar,
  	"address_region" varchar,
  	"address_postal_code" varchar,
  	"geo_latitude" varchar,
  	"geo_longitude" varchar,
  	"directions_url" varchar,
  	"map_query" varchar,
  	"shop_url" varchar,
  	"header_cta_label" varchar,
  	"header_cta_url" varchar,
  	"footer_note" varchar,
  	"form_endpoint" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "repairs_included" ADD CONSTRAINT "repairs_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repairs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repairs" ADD CONSTRAINT "repairs_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "areas_cities" ADD CONSTRAINT "areas_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "areas" ADD CONSTRAINT "areas_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_repairs_fk" FOREIGN KEY ("repairs_id") REFERENCES "public"."repairs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_areas_fk" FOREIGN KEY ("areas_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_marquee" ADD CONSTRAINT "home_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_services_cards" ADD CONSTRAINT "home_services_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_services_cards" ADD CONSTRAINT "home_services_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_cleaning_steps" ADD CONSTRAINT "home_cleaning_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_repairs_items" ADD CONSTRAINT "home_repairs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cleaning_highlights" ADD CONSTRAINT "cleaning_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cleaning"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cleaning_process_blocks" ADD CONSTRAINT "cleaning_process_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cleaning"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cleaning" ADD CONSTRAINT "cleaning_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cleaning" ADD CONSTRAINT "cleaning_process_image_id_media_id_fk" FOREIGN KEY ("process_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "visit" ADD CONSTRAINT "visit_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_story_image_id_media_id_fk" FOREIGN KEY ("story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tour" ADD CONSTRAINT "tour_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "designers_benefits" ADD CONSTRAINT "designers_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."designers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "designers" ADD CONSTRAINT "designers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "designers" ADD CONSTRAINT "designers_benefits_image_id_media_id_fk" FOREIGN KEY ("benefits_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_map_towns" ADD CONSTRAINT "settings_map_towns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_hours_days" ADD CONSTRAINT "settings_hours_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."settings_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_hours" ADD CONSTRAINT "settings_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_social" ADD CONSTRAINT "settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_service_areas" ADD CONSTRAINT "settings_service_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_main_menu_children" ADD CONSTRAINT "settings_main_menu_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings_main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_main_menu" ADD CONSTRAINT "settings_main_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "repairs_included_order_idx" ON "repairs_included" USING btree ("_order");
  CREATE INDEX "repairs_included_parent_id_idx" ON "repairs_included" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "repairs_slug_idx" ON "repairs" USING btree ("slug");
  CREATE INDEX "repairs_hero_image_idx" ON "repairs" USING btree ("hero_image_id");
  CREATE INDEX "repairs_updated_at_idx" ON "repairs" USING btree ("updated_at");
  CREATE INDEX "repairs_created_at_idx" ON "repairs" USING btree ("created_at");
  CREATE INDEX "areas_cities_order_idx" ON "areas_cities" USING btree ("_order");
  CREATE INDEX "areas_cities_parent_id_idx" ON "areas_cities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "areas_slug_idx" ON "areas" USING btree ("slug");
  CREATE INDEX "areas_hero_image_idx" ON "areas" USING btree ("hero_image_id");
  CREATE INDEX "areas_updated_at_idx" ON "areas" USING btree ("updated_at");
  CREATE INDEX "areas_created_at_idx" ON "areas" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_repairs_id_idx" ON "payload_locked_documents_rels" USING btree ("repairs_id");
  CREATE INDEX "payload_locked_documents_rels_areas_id_idx" ON "payload_locked_documents_rels" USING btree ("areas_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_marquee_order_idx" ON "home_marquee" USING btree ("_order");
  CREATE INDEX "home_marquee_parent_id_idx" ON "home_marquee" USING btree ("_parent_id");
  CREATE INDEX "home_services_cards_order_idx" ON "home_services_cards" USING btree ("_order");
  CREATE INDEX "home_services_cards_parent_id_idx" ON "home_services_cards" USING btree ("_parent_id");
  CREATE INDEX "home_services_cards_image_idx" ON "home_services_cards" USING btree ("image_id");
  CREATE INDEX "home_cleaning_steps_order_idx" ON "home_cleaning_steps" USING btree ("_order");
  CREATE INDEX "home_cleaning_steps_parent_id_idx" ON "home_cleaning_steps" USING btree ("_parent_id");
  CREATE INDEX "home_repairs_items_order_idx" ON "home_repairs_items" USING btree ("_order");
  CREATE INDEX "home_repairs_items_parent_id_idx" ON "home_repairs_items" USING btree ("_parent_id");
  CREATE INDEX "cleaning_highlights_order_idx" ON "cleaning_highlights" USING btree ("_order");
  CREATE INDEX "cleaning_highlights_parent_id_idx" ON "cleaning_highlights" USING btree ("_parent_id");
  CREATE INDEX "cleaning_process_blocks_order_idx" ON "cleaning_process_blocks" USING btree ("_order");
  CREATE INDEX "cleaning_process_blocks_parent_id_idx" ON "cleaning_process_blocks" USING btree ("_parent_id");
  CREATE INDEX "cleaning_hero_image_idx" ON "cleaning" USING btree ("hero_image_id");
  CREATE INDEX "cleaning_process_process_image_idx" ON "cleaning" USING btree ("process_image_id");
  CREATE INDEX "visit_image_idx" ON "visit" USING btree ("image_id");
  CREATE INDEX "team_members_order_idx" ON "team_members" USING btree ("_order");
  CREATE INDEX "team_members_parent_id_idx" ON "team_members" USING btree ("_parent_id");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_story_story_image_idx" ON "team" USING btree ("story_image_id");
  CREATE INDEX "tour_image_idx" ON "tour" USING btree ("image_id");
  CREATE INDEX "designers_benefits_order_idx" ON "designers_benefits" USING btree ("_order");
  CREATE INDEX "designers_benefits_parent_id_idx" ON "designers_benefits" USING btree ("_parent_id");
  CREATE INDEX "designers_image_idx" ON "designers" USING btree ("image_id");
  CREATE INDEX "designers_benefits_image_idx" ON "designers" USING btree ("benefits_image_id");
  CREATE INDEX "settings_map_towns_order_idx" ON "settings_map_towns" USING btree ("_order");
  CREATE INDEX "settings_map_towns_parent_id_idx" ON "settings_map_towns" USING btree ("_parent_id");
  CREATE INDEX "settings_hours_days_order_idx" ON "settings_hours_days" USING btree ("order");
  CREATE INDEX "settings_hours_days_parent_idx" ON "settings_hours_days" USING btree ("parent_id");
  CREATE INDEX "settings_hours_order_idx" ON "settings_hours" USING btree ("_order");
  CREATE INDEX "settings_hours_parent_id_idx" ON "settings_hours" USING btree ("_parent_id");
  CREATE INDEX "settings_social_order_idx" ON "settings_social" USING btree ("_order");
  CREATE INDEX "settings_social_parent_id_idx" ON "settings_social" USING btree ("_parent_id");
  CREATE INDEX "settings_service_areas_order_idx" ON "settings_service_areas" USING btree ("_order");
  CREATE INDEX "settings_service_areas_parent_id_idx" ON "settings_service_areas" USING btree ("_parent_id");
  CREATE INDEX "settings_main_menu_children_order_idx" ON "settings_main_menu_children" USING btree ("_order");
  CREATE INDEX "settings_main_menu_children_parent_id_idx" ON "settings_main_menu_children" USING btree ("_parent_id");
  CREATE INDEX "settings_main_menu_order_idx" ON "settings_main_menu" USING btree ("_order");
  CREATE INDEX "settings_main_menu_parent_id_idx" ON "settings_main_menu" USING btree ("_parent_id");
  CREATE INDEX "settings_logo_idx" ON "settings" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "repairs_included" CASCADE;
  DROP TABLE "repairs" CASCADE;
  DROP TABLE "areas_cities" CASCADE;
  DROP TABLE "areas" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_marquee" CASCADE;
  DROP TABLE "home_services_cards" CASCADE;
  DROP TABLE "home_cleaning_steps" CASCADE;
  DROP TABLE "home_repairs_items" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "cleaning_highlights" CASCADE;
  DROP TABLE "cleaning_process_blocks" CASCADE;
  DROP TABLE "cleaning" CASCADE;
  DROP TABLE "visit" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "team" CASCADE;
  DROP TABLE "tour" CASCADE;
  DROP TABLE "designers_benefits" CASCADE;
  DROP TABLE "designers" CASCADE;
  DROP TABLE "blog" CASCADE;
  DROP TABLE "settings_map_towns" CASCADE;
  DROP TABLE "settings_hours_days" CASCADE;
  DROP TABLE "settings_hours" CASCADE;
  DROP TABLE "settings_social" CASCADE;
  DROP TABLE "settings_service_areas" CASCADE;
  DROP TABLE "settings_main_menu_children" CASCADE;
  DROP TABLE "settings_main_menu" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TYPE "public"."enum_cleaning_process_image_position";
  DROP TYPE "public"."enum_settings_hours_days";
  DROP TYPE "public"."enum_settings_social_platform";`)
}
