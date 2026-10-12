import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_repairs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__repairs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_areas_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__areas_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_home_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_cleaning_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cleaning_v_version_process_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__cleaning_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_visit_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__visit_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_tour_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tour_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_designers_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__designers_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_blog_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__settings_v_version_hours_days" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  CREATE TYPE "public"."enum__settings_v_version_social_platform" AS ENUM('Facebook', 'Instagram', 'Pinterest', 'YouTube');
  CREATE TYPE "public"."enum__settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_repairs_v_version_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_repairs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_alt" varchar,
  	"version_intro" varchar,
  	"version_body" jsonb,
  	"version_form_heading" varchar DEFAULT 'Book now and get 15% off',
  	"version_form_intro" varchar,
  	"version_cta_heading" varchar,
  	"version_cta_text" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__repairs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_areas_v_version_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_areas_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_kicker" varchar,
  	"version_heading" varchar,
  	"version_intro" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_alt" varchar,
  	"version_cities_heading" varchar,
  	"version_form_heading" varchar,
  	"version_form_intro" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__areas_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_pub_date" timestamp(3) with time zone,
  	"version_description" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_alt" varchar,
  	"version_content" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_quote" varchar,
  	"version_source" varchar,
  	"version_rating" numeric DEFAULT 5,
  	"version_date" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_home_v_version_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_services_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_cleaning_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_repairs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_kicker" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_subtitle" varchar,
  	"version_hero_primary_label" varchar,
  	"version_hero_primary_url" varchar,
  	"version_hero_secondary_label" varchar,
  	"version_hero_secondary_url" varchar,
  	"version_services_label" varchar,
  	"version_services_heading" varchar,
  	"version_services_intro" varchar,
  	"version_cleaning_label" varchar,
  	"version_cleaning_heading" varchar,
  	"version_cleaning_primary_label" varchar,
  	"version_cleaning_primary_url" varchar,
  	"version_cleaning_secondary_label" varchar,
  	"version_cleaning_secondary_url" varchar,
  	"version_repairs_label" varchar,
  	"version_repairs_heading" varchar,
  	"version_repairs_intro" varchar,
  	"version_reviews_label" varchar,
  	"version_reviews_heading" varchar,
  	"version_reviews_rating_text" varchar,
  	"version_visit_label" varchar,
  	"version_visit_heading" varchar,
  	"version_visit_intro" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version__status" "enum__home_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_cleaning_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cleaning_v_version_process_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cleaning_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_image_id" integer,
  	"version_hero_alt" varchar,
  	"version_kicker" varchar,
  	"version_heading" varchar,
  	"version_lead" varchar,
  	"version_form_heading" varchar,
  	"version_form_intro" varchar,
  	"version_process_heading" varchar,
  	"version_process_image_id" integer,
  	"version_process_image_alt" varchar,
  	"version_process_image_position" "enum__cleaning_v_version_process_image_position" DEFAULT 'left',
  	"version_pet_note_heading" varchar,
  	"version_pet_note_body" varchar,
  	"version_interval_heading" varchar,
  	"version_interval_body" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version__status" "enum__cleaning_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_visit_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_kicker" varchar,
  	"version_heading" varchar,
  	"version_intro" varchar,
  	"version_image_id" integer,
  	"version_image_alt" varchar,
  	"version_map_label" varchar,
  	"version_hours_heading" varchar,
  	"version_areas_heading" varchar,
  	"version_areas_intro" varchar,
  	"version_form_heading" varchar,
  	"version_form_intro" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version__status" "enum__visit_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_team_v_version_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"bio" varchar,
  	"photo_id" integer,
  	"photo_alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_team_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_kicker" varchar,
  	"version_heading" varchar,
  	"version_story_heading" varchar,
  	"version_story_body" varchar,
  	"version_story_image_id" integer,
  	"version_story_image_alt" varchar,
  	"version_members_heading" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version__status" "enum__team_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_tour_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_kicker" varchar,
  	"version_heading" varchar,
  	"version_intro" varchar,
  	"version_tour_url" varchar,
  	"version_image_id" integer,
  	"version_image_alt" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version__status" "enum__tour_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_designers_v_version_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_designers_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_kicker" varchar,
  	"version_heading" varchar,
  	"version_intro" varchar,
  	"version_image_id" integer,
  	"version_image_alt" varchar,
  	"version_benefits_heading" varchar,
  	"version_benefits_image_id" integer,
  	"version_benefits_image_alt" varchar,
  	"version_form_heading" varchar,
  	"version_form_intro" varchar,
  	"version_form_documents_help" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version__status" "enum__designers_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_blog_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_heading" varchar,
  	"version_intro" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version__status" "enum__blog_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_settings_v_version_hours_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__settings_v_version_hours_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_settings_v_version_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"closed" boolean DEFAULT false,
  	"opens" varchar,
  	"closes" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_settings_v_version_map_towns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"latitude" varchar,
  	"longitude" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_settings_v_version_main_menu_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_settings_v_version_main_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_settings_v_version_service_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_settings_v_version_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__settings_v_version_social_platform" DEFAULT 'Facebook',
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_business_name" varchar,
  	"version_wordmark_name" varchar,
  	"version_wordmark_tagline" varchar,
  	"version_logo_id" integer,
  	"version_phone" varchar,
  	"version_email" varchar,
  	"version_address_street" varchar,
  	"version_address_city" varchar,
  	"version_address_region" varchar,
  	"version_address_postal_code" varchar,
  	"version_footer_note" varchar,
  	"version_directions_url" varchar,
  	"version_map_query" varchar,
  	"version_geo_latitude" varchar,
  	"version_geo_longitude" varchar,
  	"version_header_cta_label" varchar,
  	"version_header_cta_url" varchar,
  	"version_shop_url" varchar,
  	"version_form_endpoint" varchar,
  	"version__status" "enum__settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "repairs" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "repairs" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "areas" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "areas" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "pub_date" DROP NOT NULL;
  ALTER TABLE "testimonials" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "repairs" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "repairs" ADD COLUMN "_status" "enum_repairs_status" DEFAULT 'draft';
  ALTER TABLE "areas" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "areas" ADD COLUMN "_status" "enum_areas_status" DEFAULT 'draft';
  ALTER TABLE "posts" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "posts" ADD COLUMN "_status" "enum_posts_status" DEFAULT 'draft';
  ALTER TABLE "testimonials" ADD COLUMN "_status" "enum_testimonials_status" DEFAULT 'draft';
  ALTER TABLE "home" ADD COLUMN "_status" "enum_home_status" DEFAULT 'draft';
  ALTER TABLE "cleaning" ADD COLUMN "_status" "enum_cleaning_status" DEFAULT 'draft';
  ALTER TABLE "visit" ADD COLUMN "_status" "enum_visit_status" DEFAULT 'draft';
  ALTER TABLE "team" ADD COLUMN "_status" "enum_team_status" DEFAULT 'draft';
  ALTER TABLE "tour" ADD COLUMN "_status" "enum_tour_status" DEFAULT 'draft';
  ALTER TABLE "designers" ADD COLUMN "_status" "enum_designers_status" DEFAULT 'draft';
  ALTER TABLE "blog" ADD COLUMN "_status" "enum_blog_status" DEFAULT 'draft';
  ALTER TABLE "settings" ADD COLUMN "_status" "enum_settings_status" DEFAULT 'draft';
  ALTER TABLE "_repairs_v_version_included" ADD CONSTRAINT "_repairs_v_version_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_repairs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_repairs_v" ADD CONSTRAINT "_repairs_v_parent_id_repairs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."repairs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_repairs_v" ADD CONSTRAINT "_repairs_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_areas_v_version_cities" ADD CONSTRAINT "_areas_v_version_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_areas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_areas_v" ADD CONSTRAINT "_areas_v_parent_id_areas_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_areas_v" ADD CONSTRAINT "_areas_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_version_marquee" ADD CONSTRAINT "_home_v_version_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_services_cards" ADD CONSTRAINT "_home_v_version_services_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_version_services_cards" ADD CONSTRAINT "_home_v_version_services_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_cleaning_steps" ADD CONSTRAINT "_home_v_version_cleaning_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_repairs_items" ADD CONSTRAINT "_home_v_version_repairs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cleaning_v_version_highlights" ADD CONSTRAINT "_cleaning_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cleaning_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cleaning_v_version_process_blocks" ADD CONSTRAINT "_cleaning_v_version_process_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cleaning_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cleaning_v" ADD CONSTRAINT "_cleaning_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cleaning_v" ADD CONSTRAINT "_cleaning_v_version_process_image_id_media_id_fk" FOREIGN KEY ("version_process_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_visit_v" ADD CONSTRAINT "_visit_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_v_version_members" ADD CONSTRAINT "_team_v_version_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_v_version_members" ADD CONSTRAINT "_team_v_version_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_v" ADD CONSTRAINT "_team_v_version_story_image_id_media_id_fk" FOREIGN KEY ("version_story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tour_v" ADD CONSTRAINT "_tour_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_designers_v_version_benefits" ADD CONSTRAINT "_designers_v_version_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_designers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_designers_v" ADD CONSTRAINT "_designers_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_designers_v" ADD CONSTRAINT "_designers_v_version_benefits_image_id_media_id_fk" FOREIGN KEY ("version_benefits_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_settings_v_version_hours_days" ADD CONSTRAINT "_settings_v_version_hours_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_settings_v_version_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_settings_v_version_hours" ADD CONSTRAINT "_settings_v_version_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_settings_v_version_map_towns" ADD CONSTRAINT "_settings_v_version_map_towns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_settings_v_version_main_menu_children" ADD CONSTRAINT "_settings_v_version_main_menu_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_settings_v_version_main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_settings_v_version_main_menu" ADD CONSTRAINT "_settings_v_version_main_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_settings_v_version_service_areas" ADD CONSTRAINT "_settings_v_version_service_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_settings_v_version_social" ADD CONSTRAINT "_settings_v_version_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_settings_v" ADD CONSTRAINT "_settings_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_repairs_v_version_included_order_idx" ON "_repairs_v_version_included" USING btree ("_order");
  CREATE INDEX "_repairs_v_version_included_parent_id_idx" ON "_repairs_v_version_included" USING btree ("_parent_id");
  CREATE INDEX "_repairs_v_parent_idx" ON "_repairs_v" USING btree ("parent_id");
  CREATE INDEX "_repairs_v_version_version_slug_idx" ON "_repairs_v" USING btree ("version_slug");
  CREATE INDEX "_repairs_v_version_version_hero_image_idx" ON "_repairs_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_repairs_v_version_version_updated_at_idx" ON "_repairs_v" USING btree ("version_updated_at");
  CREATE INDEX "_repairs_v_version_version_created_at_idx" ON "_repairs_v" USING btree ("version_created_at");
  CREATE INDEX "_repairs_v_version_version__status_idx" ON "_repairs_v" USING btree ("version__status");
  CREATE INDEX "_repairs_v_created_at_idx" ON "_repairs_v" USING btree ("created_at");
  CREATE INDEX "_repairs_v_updated_at_idx" ON "_repairs_v" USING btree ("updated_at");
  CREATE INDEX "_repairs_v_latest_idx" ON "_repairs_v" USING btree ("latest");
  CREATE INDEX "_areas_v_version_cities_order_idx" ON "_areas_v_version_cities" USING btree ("_order");
  CREATE INDEX "_areas_v_version_cities_parent_id_idx" ON "_areas_v_version_cities" USING btree ("_parent_id");
  CREATE INDEX "_areas_v_parent_idx" ON "_areas_v" USING btree ("parent_id");
  CREATE INDEX "_areas_v_version_version_slug_idx" ON "_areas_v" USING btree ("version_slug");
  CREATE INDEX "_areas_v_version_version_hero_image_idx" ON "_areas_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_areas_v_version_version_updated_at_idx" ON "_areas_v" USING btree ("version_updated_at");
  CREATE INDEX "_areas_v_version_version_created_at_idx" ON "_areas_v" USING btree ("version_created_at");
  CREATE INDEX "_areas_v_version_version__status_idx" ON "_areas_v" USING btree ("version__status");
  CREATE INDEX "_areas_v_created_at_idx" ON "_areas_v" USING btree ("created_at");
  CREATE INDEX "_areas_v_updated_at_idx" ON "_areas_v" USING btree ("updated_at");
  CREATE INDEX "_areas_v_latest_idx" ON "_areas_v" USING btree ("latest");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "_home_v_version_marquee_order_idx" ON "_home_v_version_marquee" USING btree ("_order");
  CREATE INDEX "_home_v_version_marquee_parent_id_idx" ON "_home_v_version_marquee" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_services_cards_order_idx" ON "_home_v_version_services_cards" USING btree ("_order");
  CREATE INDEX "_home_v_version_services_cards_parent_id_idx" ON "_home_v_version_services_cards" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_services_cards_image_idx" ON "_home_v_version_services_cards" USING btree ("image_id");
  CREATE INDEX "_home_v_version_cleaning_steps_order_idx" ON "_home_v_version_cleaning_steps" USING btree ("_order");
  CREATE INDEX "_home_v_version_cleaning_steps_parent_id_idx" ON "_home_v_version_cleaning_steps" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_repairs_items_order_idx" ON "_home_v_version_repairs_items" USING btree ("_order");
  CREATE INDEX "_home_v_version_repairs_items_parent_id_idx" ON "_home_v_version_repairs_items" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_version__status_idx" ON "_home_v" USING btree ("version__status");
  CREATE INDEX "_home_v_created_at_idx" ON "_home_v" USING btree ("created_at");
  CREATE INDEX "_home_v_updated_at_idx" ON "_home_v" USING btree ("updated_at");
  CREATE INDEX "_home_v_latest_idx" ON "_home_v" USING btree ("latest");
  CREATE INDEX "_cleaning_v_version_highlights_order_idx" ON "_cleaning_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_cleaning_v_version_highlights_parent_id_idx" ON "_cleaning_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_cleaning_v_version_process_blocks_order_idx" ON "_cleaning_v_version_process_blocks" USING btree ("_order");
  CREATE INDEX "_cleaning_v_version_process_blocks_parent_id_idx" ON "_cleaning_v_version_process_blocks" USING btree ("_parent_id");
  CREATE INDEX "_cleaning_v_version_version_hero_image_idx" ON "_cleaning_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_cleaning_v_version_process_version_process_image_idx" ON "_cleaning_v" USING btree ("version_process_image_id");
  CREATE INDEX "_cleaning_v_version_version__status_idx" ON "_cleaning_v" USING btree ("version__status");
  CREATE INDEX "_cleaning_v_created_at_idx" ON "_cleaning_v" USING btree ("created_at");
  CREATE INDEX "_cleaning_v_updated_at_idx" ON "_cleaning_v" USING btree ("updated_at");
  CREATE INDEX "_cleaning_v_latest_idx" ON "_cleaning_v" USING btree ("latest");
  CREATE INDEX "_visit_v_version_version_image_idx" ON "_visit_v" USING btree ("version_image_id");
  CREATE INDEX "_visit_v_version_version__status_idx" ON "_visit_v" USING btree ("version__status");
  CREATE INDEX "_visit_v_created_at_idx" ON "_visit_v" USING btree ("created_at");
  CREATE INDEX "_visit_v_updated_at_idx" ON "_visit_v" USING btree ("updated_at");
  CREATE INDEX "_visit_v_latest_idx" ON "_visit_v" USING btree ("latest");
  CREATE INDEX "_team_v_version_members_order_idx" ON "_team_v_version_members" USING btree ("_order");
  CREATE INDEX "_team_v_version_members_parent_id_idx" ON "_team_v_version_members" USING btree ("_parent_id");
  CREATE INDEX "_team_v_version_members_photo_idx" ON "_team_v_version_members" USING btree ("photo_id");
  CREATE INDEX "_team_v_version_story_version_story_image_idx" ON "_team_v" USING btree ("version_story_image_id");
  CREATE INDEX "_team_v_version_version__status_idx" ON "_team_v" USING btree ("version__status");
  CREATE INDEX "_team_v_created_at_idx" ON "_team_v" USING btree ("created_at");
  CREATE INDEX "_team_v_updated_at_idx" ON "_team_v" USING btree ("updated_at");
  CREATE INDEX "_team_v_latest_idx" ON "_team_v" USING btree ("latest");
  CREATE INDEX "_tour_v_version_version_image_idx" ON "_tour_v" USING btree ("version_image_id");
  CREATE INDEX "_tour_v_version_version__status_idx" ON "_tour_v" USING btree ("version__status");
  CREATE INDEX "_tour_v_created_at_idx" ON "_tour_v" USING btree ("created_at");
  CREATE INDEX "_tour_v_updated_at_idx" ON "_tour_v" USING btree ("updated_at");
  CREATE INDEX "_tour_v_latest_idx" ON "_tour_v" USING btree ("latest");
  CREATE INDEX "_designers_v_version_benefits_order_idx" ON "_designers_v_version_benefits" USING btree ("_order");
  CREATE INDEX "_designers_v_version_benefits_parent_id_idx" ON "_designers_v_version_benefits" USING btree ("_parent_id");
  CREATE INDEX "_designers_v_version_version_image_idx" ON "_designers_v" USING btree ("version_image_id");
  CREATE INDEX "_designers_v_version_version_benefits_image_idx" ON "_designers_v" USING btree ("version_benefits_image_id");
  CREATE INDEX "_designers_v_version_version__status_idx" ON "_designers_v" USING btree ("version__status");
  CREATE INDEX "_designers_v_created_at_idx" ON "_designers_v" USING btree ("created_at");
  CREATE INDEX "_designers_v_updated_at_idx" ON "_designers_v" USING btree ("updated_at");
  CREATE INDEX "_designers_v_latest_idx" ON "_designers_v" USING btree ("latest");
  CREATE INDEX "_blog_v_version_version__status_idx" ON "_blog_v" USING btree ("version__status");
  CREATE INDEX "_blog_v_created_at_idx" ON "_blog_v" USING btree ("created_at");
  CREATE INDEX "_blog_v_updated_at_idx" ON "_blog_v" USING btree ("updated_at");
  CREATE INDEX "_blog_v_latest_idx" ON "_blog_v" USING btree ("latest");
  CREATE INDEX "_settings_v_version_hours_days_order_idx" ON "_settings_v_version_hours_days" USING btree ("order");
  CREATE INDEX "_settings_v_version_hours_days_parent_idx" ON "_settings_v_version_hours_days" USING btree ("parent_id");
  CREATE INDEX "_settings_v_version_hours_order_idx" ON "_settings_v_version_hours" USING btree ("_order");
  CREATE INDEX "_settings_v_version_hours_parent_id_idx" ON "_settings_v_version_hours" USING btree ("_parent_id");
  CREATE INDEX "_settings_v_version_map_towns_order_idx" ON "_settings_v_version_map_towns" USING btree ("_order");
  CREATE INDEX "_settings_v_version_map_towns_parent_id_idx" ON "_settings_v_version_map_towns" USING btree ("_parent_id");
  CREATE INDEX "_settings_v_version_main_menu_children_order_idx" ON "_settings_v_version_main_menu_children" USING btree ("_order");
  CREATE INDEX "_settings_v_version_main_menu_children_parent_id_idx" ON "_settings_v_version_main_menu_children" USING btree ("_parent_id");
  CREATE INDEX "_settings_v_version_main_menu_order_idx" ON "_settings_v_version_main_menu" USING btree ("_order");
  CREATE INDEX "_settings_v_version_main_menu_parent_id_idx" ON "_settings_v_version_main_menu" USING btree ("_parent_id");
  CREATE INDEX "_settings_v_version_service_areas_order_idx" ON "_settings_v_version_service_areas" USING btree ("_order");
  CREATE INDEX "_settings_v_version_service_areas_parent_id_idx" ON "_settings_v_version_service_areas" USING btree ("_parent_id");
  CREATE INDEX "_settings_v_version_social_order_idx" ON "_settings_v_version_social" USING btree ("_order");
  CREATE INDEX "_settings_v_version_social_parent_id_idx" ON "_settings_v_version_social" USING btree ("_parent_id");
  CREATE INDEX "_settings_v_version_version_logo_idx" ON "_settings_v" USING btree ("version_logo_id");
  CREATE INDEX "_settings_v_version_version__status_idx" ON "_settings_v" USING btree ("version__status");
  CREATE INDEX "_settings_v_created_at_idx" ON "_settings_v" USING btree ("created_at");
  CREATE INDEX "_settings_v_updated_at_idx" ON "_settings_v" USING btree ("updated_at");
  CREATE INDEX "_settings_v_latest_idx" ON "_settings_v" USING btree ("latest");
  CREATE INDEX "repairs__status_idx" ON "repairs" USING btree ("_status");
  CREATE INDEX "areas__status_idx" ON "areas" USING btree ("_status");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE INDEX "home__status_idx" ON "home" USING btree ("_status");
  CREATE INDEX "cleaning__status_idx" ON "cleaning" USING btree ("_status");
  CREATE INDEX "visit__status_idx" ON "visit" USING btree ("_status");
  CREATE INDEX "team__status_idx" ON "team" USING btree ("_status");
  CREATE INDEX "tour__status_idx" ON "tour" USING btree ("_status");
  CREATE INDEX "designers__status_idx" ON "designers" USING btree ("_status");
  CREATE INDEX "blog__status_idx" ON "blog" USING btree ("_status");
  CREATE INDEX "settings__status_idx" ON "settings" USING btree ("_status");`)

  // Everything that existed before drafts was live, so it stays published (the website only
  // reads published content), and existing page addresses never change by themselves.
  await db.execute(sql`
   UPDATE "repairs" SET "_status" = 'published', "generate_slug" = false;
  UPDATE "areas" SET "_status" = 'published', "generate_slug" = false;
  UPDATE "posts" SET "_status" = 'published', "generate_slug" = false;
  UPDATE "testimonials" SET "_status" = 'published';
  UPDATE "home" SET "_status" = 'published';
  UPDATE "cleaning" SET "_status" = 'published';
  UPDATE "visit" SET "_status" = 'published';
  UPDATE "team" SET "_status" = 'published';
  UPDATE "tour" SET "_status" = 'published';
  UPDATE "designers" SET "_status" = 'published';
  UPDATE "blog" SET "_status" = 'published';
  UPDATE "settings" SET "_status" = 'published';`)

  // Publish everything once through Payload, so each page and entry also gets a "published"
  // version in its history (the admin then shows Published / Changed and offers
  // "Revert to published"). No site rebuilds: nothing visible changes.
  const context = { skipRebuild: true }
  for (const slug of ['settings', 'home', 'cleaning', 'visit', 'team', 'tour', 'designers', 'blog'] as const) {
    await payload.updateGlobal({ slug, data: { _status: 'published' }, req, context, depth: 0 })
  }
  for (const collection of ['repairs', 'areas', 'posts', 'testimonials'] as const) {
    const { docs } = await payload.find({ collection, req, depth: 0, limit: 0, pagination: false })
    for (const doc of docs) {
      await payload.update({ collection, id: doc.id, data: { _status: 'published' }, req, context, depth: 0 })
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_repairs_v_version_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_repairs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_areas_v_version_cities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_areas_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_testimonials_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_services_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_cleaning_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_repairs_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cleaning_v_version_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cleaning_v_version_process_blocks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cleaning_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_visit_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_v_version_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_designers_v_version_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_designers_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_settings_v_version_hours_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_settings_v_version_hours" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_settings_v_version_map_towns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_settings_v_version_main_menu_children" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_settings_v_version_main_menu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_settings_v_version_service_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_settings_v_version_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_settings_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_repairs_v_version_included" CASCADE;
  DROP TABLE "_repairs_v" CASCADE;
  DROP TABLE "_areas_v_version_cities" CASCADE;
  DROP TABLE "_areas_v" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "_home_v_version_marquee" CASCADE;
  DROP TABLE "_home_v_version_services_cards" CASCADE;
  DROP TABLE "_home_v_version_cleaning_steps" CASCADE;
  DROP TABLE "_home_v_version_repairs_items" CASCADE;
  DROP TABLE "_home_v" CASCADE;
  DROP TABLE "_cleaning_v_version_highlights" CASCADE;
  DROP TABLE "_cleaning_v_version_process_blocks" CASCADE;
  DROP TABLE "_cleaning_v" CASCADE;
  DROP TABLE "_visit_v" CASCADE;
  DROP TABLE "_team_v_version_members" CASCADE;
  DROP TABLE "_team_v" CASCADE;
  DROP TABLE "_tour_v" CASCADE;
  DROP TABLE "_designers_v_version_benefits" CASCADE;
  DROP TABLE "_designers_v" CASCADE;
  DROP TABLE "_blog_v" CASCADE;
  DROP TABLE "_settings_v_version_hours_days" CASCADE;
  DROP TABLE "_settings_v_version_hours" CASCADE;
  DROP TABLE "_settings_v_version_map_towns" CASCADE;
  DROP TABLE "_settings_v_version_main_menu_children" CASCADE;
  DROP TABLE "_settings_v_version_main_menu" CASCADE;
  DROP TABLE "_settings_v_version_service_areas" CASCADE;
  DROP TABLE "_settings_v_version_social" CASCADE;
  DROP TABLE "_settings_v" CASCADE;
  DROP INDEX "repairs__status_idx";
  DROP INDEX "areas__status_idx";
  DROP INDEX "posts__status_idx";
  DROP INDEX "testimonials__status_idx";
  DROP INDEX "home__status_idx";
  DROP INDEX "cleaning__status_idx";
  DROP INDEX "visit__status_idx";
  DROP INDEX "team__status_idx";
  DROP INDEX "tour__status_idx";
  DROP INDEX "designers__status_idx";
  DROP INDEX "blog__status_idx";
  DROP INDEX "settings__status_idx";
  ALTER TABLE "repairs" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "repairs" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "areas" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "areas" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "pub_date" SET NOT NULL;
  ALTER TABLE "testimonials" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "repairs" DROP COLUMN "generate_slug";
  ALTER TABLE "repairs" DROP COLUMN "_status";
  ALTER TABLE "areas" DROP COLUMN "generate_slug";
  ALTER TABLE "areas" DROP COLUMN "_status";
  ALTER TABLE "posts" DROP COLUMN "generate_slug";
  ALTER TABLE "posts" DROP COLUMN "_status";
  ALTER TABLE "testimonials" DROP COLUMN "_status";
  ALTER TABLE "home" DROP COLUMN "_status";
  ALTER TABLE "cleaning" DROP COLUMN "_status";
  ALTER TABLE "visit" DROP COLUMN "_status";
  ALTER TABLE "team" DROP COLUMN "_status";
  ALTER TABLE "tour" DROP COLUMN "_status";
  ALTER TABLE "designers" DROP COLUMN "_status";
  ALTER TABLE "blog" DROP COLUMN "_status";
  ALTER TABLE "settings" DROP COLUMN "_status";
  DROP TYPE "public"."enum_repairs_status";
  DROP TYPE "public"."enum__repairs_v_version_status";
  DROP TYPE "public"."enum_areas_status";
  DROP TYPE "public"."enum__areas_v_version_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum_home_status";
  DROP TYPE "public"."enum__home_v_version_status";
  DROP TYPE "public"."enum_cleaning_status";
  DROP TYPE "public"."enum__cleaning_v_version_process_image_position";
  DROP TYPE "public"."enum__cleaning_v_version_status";
  DROP TYPE "public"."enum_visit_status";
  DROP TYPE "public"."enum__visit_v_version_status";
  DROP TYPE "public"."enum_team_status";
  DROP TYPE "public"."enum__team_v_version_status";
  DROP TYPE "public"."enum_tour_status";
  DROP TYPE "public"."enum__tour_v_version_status";
  DROP TYPE "public"."enum_designers_status";
  DROP TYPE "public"."enum__designers_v_version_status";
  DROP TYPE "public"."enum_blog_status";
  DROP TYPE "public"."enum__blog_v_version_status";
  DROP TYPE "public"."enum_settings_status";
  DROP TYPE "public"."enum__settings_v_version_hours_days";
  DROP TYPE "public"."enum__settings_v_version_social_platform";
  DROP TYPE "public"."enum__settings_v_version_status";`)
}
