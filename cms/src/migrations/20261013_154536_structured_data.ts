import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_repairs_structured_data_type" AS ENUM('auto', 'Service', 'Article', 'BlogPosting', 'WebPage');
  CREATE TYPE "public"."enum__repairs_v_version_structured_data_type" AS ENUM('auto', 'Service', 'Article', 'BlogPosting', 'WebPage');
  CREATE TYPE "public"."enum_areas_structured_data_type" AS ENUM('auto', 'Service', 'Article', 'BlogPosting', 'WebPage');
  CREATE TYPE "public"."enum__areas_v_version_structured_data_type" AS ENUM('auto', 'Service', 'Article', 'BlogPosting', 'WebPage');
  CREATE TYPE "public"."enum_posts_structured_data_type" AS ENUM('auto', 'Service', 'Article', 'BlogPosting', 'WebPage');
  CREATE TYPE "public"."enum__posts_v_version_structured_data_type" AS ENUM('auto', 'Service', 'Article', 'BlogPosting', 'WebPage');
  CREATE TYPE "public"."enum_cleaning_structured_data_type" AS ENUM('auto', 'Service', 'Article', 'BlogPosting', 'WebPage');
  CREATE TYPE "public"."enum__cleaning_v_version_structured_data_type" AS ENUM('auto', 'Service', 'Article', 'BlogPosting', 'WebPage');
  CREATE TABLE "repairs_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "repairs_structured_data_area_served" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "_repairs_v_version_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_repairs_v_version_structured_data_area_served" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "areas_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "areas_structured_data_area_served" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "_areas_v_version_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_areas_v_version_structured_data_area_served" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "posts_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "_posts_v_version_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "home_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "_home_v_version_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cleaning_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "cleaning_structured_data_area_served" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "_cleaning_v_version_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cleaning_v_version_structured_data_area_served" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "visit_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "_visit_v_version_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "team_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "_team_v_version_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "tour_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "_tour_v_version_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "designers_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "_designers_v_version_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "blog_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "_blog_v_version_structured_data_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "repairs" ADD COLUMN "structured_data_type" "enum_repairs_structured_data_type" DEFAULT 'auto';
  ALTER TABLE "repairs" ADD COLUMN "structured_data_service_name" varchar;
  ALTER TABLE "repairs" ADD COLUMN "structured_data_starting_price" numeric;
  ALTER TABLE "repairs" ADD COLUMN "structured_data_off" boolean DEFAULT false;
  ALTER TABLE "_repairs_v" ADD COLUMN "version_structured_data_type" "enum__repairs_v_version_structured_data_type" DEFAULT 'auto';
  ALTER TABLE "_repairs_v" ADD COLUMN "version_structured_data_service_name" varchar;
  ALTER TABLE "_repairs_v" ADD COLUMN "version_structured_data_starting_price" numeric;
  ALTER TABLE "_repairs_v" ADD COLUMN "version_structured_data_off" boolean DEFAULT false;
  ALTER TABLE "areas" ADD COLUMN "structured_data_type" "enum_areas_structured_data_type" DEFAULT 'auto';
  ALTER TABLE "areas" ADD COLUMN "structured_data_service_name" varchar;
  ALTER TABLE "areas" ADD COLUMN "structured_data_starting_price" numeric;
  ALTER TABLE "areas" ADD COLUMN "structured_data_off" boolean DEFAULT false;
  ALTER TABLE "_areas_v" ADD COLUMN "version_structured_data_type" "enum__areas_v_version_structured_data_type" DEFAULT 'auto';
  ALTER TABLE "_areas_v" ADD COLUMN "version_structured_data_service_name" varchar;
  ALTER TABLE "_areas_v" ADD COLUMN "version_structured_data_starting_price" numeric;
  ALTER TABLE "_areas_v" ADD COLUMN "version_structured_data_off" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "structured_data_type" "enum_posts_structured_data_type" DEFAULT 'auto';
  ALTER TABLE "posts" ADD COLUMN "structured_data_off" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_structured_data_type" "enum__posts_v_version_structured_data_type" DEFAULT 'auto';
  ALTER TABLE "_posts_v" ADD COLUMN "version_structured_data_off" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "structured_data_off" boolean DEFAULT false;
  ALTER TABLE "_home_v" ADD COLUMN "version_structured_data_off" boolean DEFAULT false;
  ALTER TABLE "cleaning" ADD COLUMN "structured_data_type" "enum_cleaning_structured_data_type" DEFAULT 'auto';
  ALTER TABLE "cleaning" ADD COLUMN "structured_data_service_name" varchar;
  ALTER TABLE "cleaning" ADD COLUMN "structured_data_starting_price" numeric;
  ALTER TABLE "cleaning" ADD COLUMN "structured_data_off" boolean DEFAULT false;
  ALTER TABLE "_cleaning_v" ADD COLUMN "version_structured_data_type" "enum__cleaning_v_version_structured_data_type" DEFAULT 'auto';
  ALTER TABLE "_cleaning_v" ADD COLUMN "version_structured_data_service_name" varchar;
  ALTER TABLE "_cleaning_v" ADD COLUMN "version_structured_data_starting_price" numeric;
  ALTER TABLE "_cleaning_v" ADD COLUMN "version_structured_data_off" boolean DEFAULT false;
  ALTER TABLE "visit" ADD COLUMN "structured_data_off" boolean DEFAULT false;
  ALTER TABLE "_visit_v" ADD COLUMN "version_structured_data_off" boolean DEFAULT false;
  ALTER TABLE "team" ADD COLUMN "structured_data_off" boolean DEFAULT false;
  ALTER TABLE "_team_v" ADD COLUMN "version_structured_data_off" boolean DEFAULT false;
  ALTER TABLE "tour" ADD COLUMN "structured_data_off" boolean DEFAULT false;
  ALTER TABLE "_tour_v" ADD COLUMN "version_structured_data_off" boolean DEFAULT false;
  ALTER TABLE "designers" ADD COLUMN "structured_data_off" boolean DEFAULT false;
  ALTER TABLE "_designers_v" ADD COLUMN "version_structured_data_off" boolean DEFAULT false;
  ALTER TABLE "blog" ADD COLUMN "structured_data_off" boolean DEFAULT false;
  ALTER TABLE "_blog_v" ADD COLUMN "version_structured_data_off" boolean DEFAULT false;
  ALTER TABLE "settings" ADD COLUMN "business_description" varchar;
  ALTER TABLE "settings" ADD COLUMN "business_price_range" varchar;
  ALTER TABLE "settings" ADD COLUMN "business_image_id" integer;
  ALTER TABLE "_settings_v" ADD COLUMN "version_business_description" varchar;
  ALTER TABLE "_settings_v" ADD COLUMN "version_business_price_range" varchar;
  ALTER TABLE "_settings_v" ADD COLUMN "version_business_image_id" integer;
  ALTER TABLE "repairs_structured_data_faq" ADD CONSTRAINT "repairs_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repairs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repairs_structured_data_area_served" ADD CONSTRAINT "repairs_structured_data_area_served_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repairs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_repairs_v_version_structured_data_faq" ADD CONSTRAINT "_repairs_v_version_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_repairs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_repairs_v_version_structured_data_area_served" ADD CONSTRAINT "_repairs_v_version_structured_data_area_served_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_repairs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "areas_structured_data_faq" ADD CONSTRAINT "areas_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "areas_structured_data_area_served" ADD CONSTRAINT "areas_structured_data_area_served_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_areas_v_version_structured_data_faq" ADD CONSTRAINT "_areas_v_version_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_areas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_areas_v_version_structured_data_area_served" ADD CONSTRAINT "_areas_v_version_structured_data_area_served_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_areas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_structured_data_faq" ADD CONSTRAINT "posts_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_structured_data_faq" ADD CONSTRAINT "_posts_v_version_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_structured_data_faq" ADD CONSTRAINT "home_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_structured_data_faq" ADD CONSTRAINT "_home_v_version_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cleaning_structured_data_faq" ADD CONSTRAINT "cleaning_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cleaning"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cleaning_structured_data_area_served" ADD CONSTRAINT "cleaning_structured_data_area_served_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cleaning"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cleaning_v_version_structured_data_faq" ADD CONSTRAINT "_cleaning_v_version_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cleaning_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cleaning_v_version_structured_data_area_served" ADD CONSTRAINT "_cleaning_v_version_structured_data_area_served_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cleaning_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visit_structured_data_faq" ADD CONSTRAINT "visit_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."visit"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_visit_v_version_structured_data_faq" ADD CONSTRAINT "_visit_v_version_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_visit_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_structured_data_faq" ADD CONSTRAINT "team_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_v_version_structured_data_faq" ADD CONSTRAINT "_team_v_version_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_structured_data_faq" ADD CONSTRAINT "tour_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tour"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tour_v_version_structured_data_faq" ADD CONSTRAINT "_tour_v_version_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tour_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "designers_structured_data_faq" ADD CONSTRAINT "designers_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."designers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_designers_v_version_structured_data_faq" ADD CONSTRAINT "_designers_v_version_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_designers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_structured_data_faq" ADD CONSTRAINT "blog_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_v_version_structured_data_faq" ADD CONSTRAINT "_blog_v_version_structured_data_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "repairs_structured_data_faq_order_idx" ON "repairs_structured_data_faq" USING btree ("_order");
  CREATE INDEX "repairs_structured_data_faq_parent_id_idx" ON "repairs_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "repairs_structured_data_area_served_order_idx" ON "repairs_structured_data_area_served" USING btree ("_order");
  CREATE INDEX "repairs_structured_data_area_served_parent_id_idx" ON "repairs_structured_data_area_served" USING btree ("_parent_id");
  CREATE INDEX "_repairs_v_version_structured_data_faq_order_idx" ON "_repairs_v_version_structured_data_faq" USING btree ("_order");
  CREATE INDEX "_repairs_v_version_structured_data_faq_parent_id_idx" ON "_repairs_v_version_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "_repairs_v_version_structured_data_area_served_order_idx" ON "_repairs_v_version_structured_data_area_served" USING btree ("_order");
  CREATE INDEX "_repairs_v_version_structured_data_area_served_parent_id_idx" ON "_repairs_v_version_structured_data_area_served" USING btree ("_parent_id");
  CREATE INDEX "areas_structured_data_faq_order_idx" ON "areas_structured_data_faq" USING btree ("_order");
  CREATE INDEX "areas_structured_data_faq_parent_id_idx" ON "areas_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "areas_structured_data_area_served_order_idx" ON "areas_structured_data_area_served" USING btree ("_order");
  CREATE INDEX "areas_structured_data_area_served_parent_id_idx" ON "areas_structured_data_area_served" USING btree ("_parent_id");
  CREATE INDEX "_areas_v_version_structured_data_faq_order_idx" ON "_areas_v_version_structured_data_faq" USING btree ("_order");
  CREATE INDEX "_areas_v_version_structured_data_faq_parent_id_idx" ON "_areas_v_version_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "_areas_v_version_structured_data_area_served_order_idx" ON "_areas_v_version_structured_data_area_served" USING btree ("_order");
  CREATE INDEX "_areas_v_version_structured_data_area_served_parent_id_idx" ON "_areas_v_version_structured_data_area_served" USING btree ("_parent_id");
  CREATE INDEX "posts_structured_data_faq_order_idx" ON "posts_structured_data_faq" USING btree ("_order");
  CREATE INDEX "posts_structured_data_faq_parent_id_idx" ON "posts_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_structured_data_faq_order_idx" ON "_posts_v_version_structured_data_faq" USING btree ("_order");
  CREATE INDEX "_posts_v_version_structured_data_faq_parent_id_idx" ON "_posts_v_version_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "home_structured_data_faq_order_idx" ON "home_structured_data_faq" USING btree ("_order");
  CREATE INDEX "home_structured_data_faq_parent_id_idx" ON "home_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_structured_data_faq_order_idx" ON "_home_v_version_structured_data_faq" USING btree ("_order");
  CREATE INDEX "_home_v_version_structured_data_faq_parent_id_idx" ON "_home_v_version_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "cleaning_structured_data_faq_order_idx" ON "cleaning_structured_data_faq" USING btree ("_order");
  CREATE INDEX "cleaning_structured_data_faq_parent_id_idx" ON "cleaning_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "cleaning_structured_data_area_served_order_idx" ON "cleaning_structured_data_area_served" USING btree ("_order");
  CREATE INDEX "cleaning_structured_data_area_served_parent_id_idx" ON "cleaning_structured_data_area_served" USING btree ("_parent_id");
  CREATE INDEX "_cleaning_v_version_structured_data_faq_order_idx" ON "_cleaning_v_version_structured_data_faq" USING btree ("_order");
  CREATE INDEX "_cleaning_v_version_structured_data_faq_parent_id_idx" ON "_cleaning_v_version_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "_cleaning_v_version_structured_data_area_served_order_idx" ON "_cleaning_v_version_structured_data_area_served" USING btree ("_order");
  CREATE INDEX "_cleaning_v_version_structured_data_area_served_parent_id_idx" ON "_cleaning_v_version_structured_data_area_served" USING btree ("_parent_id");
  CREATE INDEX "visit_structured_data_faq_order_idx" ON "visit_structured_data_faq" USING btree ("_order");
  CREATE INDEX "visit_structured_data_faq_parent_id_idx" ON "visit_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "_visit_v_version_structured_data_faq_order_idx" ON "_visit_v_version_structured_data_faq" USING btree ("_order");
  CREATE INDEX "_visit_v_version_structured_data_faq_parent_id_idx" ON "_visit_v_version_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "team_structured_data_faq_order_idx" ON "team_structured_data_faq" USING btree ("_order");
  CREATE INDEX "team_structured_data_faq_parent_id_idx" ON "team_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "_team_v_version_structured_data_faq_order_idx" ON "_team_v_version_structured_data_faq" USING btree ("_order");
  CREATE INDEX "_team_v_version_structured_data_faq_parent_id_idx" ON "_team_v_version_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "tour_structured_data_faq_order_idx" ON "tour_structured_data_faq" USING btree ("_order");
  CREATE INDEX "tour_structured_data_faq_parent_id_idx" ON "tour_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "_tour_v_version_structured_data_faq_order_idx" ON "_tour_v_version_structured_data_faq" USING btree ("_order");
  CREATE INDEX "_tour_v_version_structured_data_faq_parent_id_idx" ON "_tour_v_version_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "designers_structured_data_faq_order_idx" ON "designers_structured_data_faq" USING btree ("_order");
  CREATE INDEX "designers_structured_data_faq_parent_id_idx" ON "designers_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "_designers_v_version_structured_data_faq_order_idx" ON "_designers_v_version_structured_data_faq" USING btree ("_order");
  CREATE INDEX "_designers_v_version_structured_data_faq_parent_id_idx" ON "_designers_v_version_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "blog_structured_data_faq_order_idx" ON "blog_structured_data_faq" USING btree ("_order");
  CREATE INDEX "blog_structured_data_faq_parent_id_idx" ON "blog_structured_data_faq" USING btree ("_parent_id");
  CREATE INDEX "_blog_v_version_structured_data_faq_order_idx" ON "_blog_v_version_structured_data_faq" USING btree ("_order");
  CREATE INDEX "_blog_v_version_structured_data_faq_parent_id_idx" ON "_blog_v_version_structured_data_faq" USING btree ("_parent_id");
  ALTER TABLE "settings" ADD CONSTRAINT "settings_business_image_id_media_id_fk" FOREIGN KEY ("business_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_settings_v" ADD CONSTRAINT "_settings_v_version_business_image_id_media_id_fk" FOREIGN KEY ("version_business_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "settings_business_business_image_idx" ON "settings" USING btree ("business_image_id");
  CREATE INDEX "_settings_v_version_business_version_business_image_idx" ON "_settings_v" USING btree ("version_business_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "repairs_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repairs_structured_data_area_served" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_repairs_v_version_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_repairs_v_version_structured_data_area_served" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "areas_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "areas_structured_data_area_served" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_areas_v_version_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_areas_v_version_structured_data_area_served" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cleaning_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cleaning_structured_data_area_served" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cleaning_v_version_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cleaning_v_version_structured_data_area_served" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "visit_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_visit_v_version_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_v_version_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tour_v_version_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "designers_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_designers_v_version_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_v_version_structured_data_faq" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "repairs_structured_data_faq" CASCADE;
  DROP TABLE "repairs_structured_data_area_served" CASCADE;
  DROP TABLE "_repairs_v_version_structured_data_faq" CASCADE;
  DROP TABLE "_repairs_v_version_structured_data_area_served" CASCADE;
  DROP TABLE "areas_structured_data_faq" CASCADE;
  DROP TABLE "areas_structured_data_area_served" CASCADE;
  DROP TABLE "_areas_v_version_structured_data_faq" CASCADE;
  DROP TABLE "_areas_v_version_structured_data_area_served" CASCADE;
  DROP TABLE "posts_structured_data_faq" CASCADE;
  DROP TABLE "_posts_v_version_structured_data_faq" CASCADE;
  DROP TABLE "home_structured_data_faq" CASCADE;
  DROP TABLE "_home_v_version_structured_data_faq" CASCADE;
  DROP TABLE "cleaning_structured_data_faq" CASCADE;
  DROP TABLE "cleaning_structured_data_area_served" CASCADE;
  DROP TABLE "_cleaning_v_version_structured_data_faq" CASCADE;
  DROP TABLE "_cleaning_v_version_structured_data_area_served" CASCADE;
  DROP TABLE "visit_structured_data_faq" CASCADE;
  DROP TABLE "_visit_v_version_structured_data_faq" CASCADE;
  DROP TABLE "team_structured_data_faq" CASCADE;
  DROP TABLE "_team_v_version_structured_data_faq" CASCADE;
  DROP TABLE "tour_structured_data_faq" CASCADE;
  DROP TABLE "_tour_v_version_structured_data_faq" CASCADE;
  DROP TABLE "designers_structured_data_faq" CASCADE;
  DROP TABLE "_designers_v_version_structured_data_faq" CASCADE;
  DROP TABLE "blog_structured_data_faq" CASCADE;
  DROP TABLE "_blog_v_version_structured_data_faq" CASCADE;
  ALTER TABLE "settings" DROP CONSTRAINT "settings_business_image_id_media_id_fk";
  
  ALTER TABLE "_settings_v" DROP CONSTRAINT "_settings_v_version_business_image_id_media_id_fk";
  
  DROP INDEX "settings_business_business_image_idx";
  DROP INDEX "_settings_v_version_business_version_business_image_idx";
  ALTER TABLE "repairs" DROP COLUMN "structured_data_type";
  ALTER TABLE "repairs" DROP COLUMN "structured_data_service_name";
  ALTER TABLE "repairs" DROP COLUMN "structured_data_starting_price";
  ALTER TABLE "repairs" DROP COLUMN "structured_data_off";
  ALTER TABLE "_repairs_v" DROP COLUMN "version_structured_data_type";
  ALTER TABLE "_repairs_v" DROP COLUMN "version_structured_data_service_name";
  ALTER TABLE "_repairs_v" DROP COLUMN "version_structured_data_starting_price";
  ALTER TABLE "_repairs_v" DROP COLUMN "version_structured_data_off";
  ALTER TABLE "areas" DROP COLUMN "structured_data_type";
  ALTER TABLE "areas" DROP COLUMN "structured_data_service_name";
  ALTER TABLE "areas" DROP COLUMN "structured_data_starting_price";
  ALTER TABLE "areas" DROP COLUMN "structured_data_off";
  ALTER TABLE "_areas_v" DROP COLUMN "version_structured_data_type";
  ALTER TABLE "_areas_v" DROP COLUMN "version_structured_data_service_name";
  ALTER TABLE "_areas_v" DROP COLUMN "version_structured_data_starting_price";
  ALTER TABLE "_areas_v" DROP COLUMN "version_structured_data_off";
  ALTER TABLE "posts" DROP COLUMN "structured_data_type";
  ALTER TABLE "posts" DROP COLUMN "structured_data_off";
  ALTER TABLE "_posts_v" DROP COLUMN "version_structured_data_type";
  ALTER TABLE "_posts_v" DROP COLUMN "version_structured_data_off";
  ALTER TABLE "home" DROP COLUMN "structured_data_off";
  ALTER TABLE "_home_v" DROP COLUMN "version_structured_data_off";
  ALTER TABLE "cleaning" DROP COLUMN "structured_data_type";
  ALTER TABLE "cleaning" DROP COLUMN "structured_data_service_name";
  ALTER TABLE "cleaning" DROP COLUMN "structured_data_starting_price";
  ALTER TABLE "cleaning" DROP COLUMN "structured_data_off";
  ALTER TABLE "_cleaning_v" DROP COLUMN "version_structured_data_type";
  ALTER TABLE "_cleaning_v" DROP COLUMN "version_structured_data_service_name";
  ALTER TABLE "_cleaning_v" DROP COLUMN "version_structured_data_starting_price";
  ALTER TABLE "_cleaning_v" DROP COLUMN "version_structured_data_off";
  ALTER TABLE "visit" DROP COLUMN "structured_data_off";
  ALTER TABLE "_visit_v" DROP COLUMN "version_structured_data_off";
  ALTER TABLE "team" DROP COLUMN "structured_data_off";
  ALTER TABLE "_team_v" DROP COLUMN "version_structured_data_off";
  ALTER TABLE "tour" DROP COLUMN "structured_data_off";
  ALTER TABLE "_tour_v" DROP COLUMN "version_structured_data_off";
  ALTER TABLE "designers" DROP COLUMN "structured_data_off";
  ALTER TABLE "_designers_v" DROP COLUMN "version_structured_data_off";
  ALTER TABLE "blog" DROP COLUMN "structured_data_off";
  ALTER TABLE "_blog_v" DROP COLUMN "version_structured_data_off";
  ALTER TABLE "settings" DROP COLUMN "business_description";
  ALTER TABLE "settings" DROP COLUMN "business_price_range";
  ALTER TABLE "settings" DROP COLUMN "business_image_id";
  ALTER TABLE "_settings_v" DROP COLUMN "version_business_description";
  ALTER TABLE "_settings_v" DROP COLUMN "version_business_price_range";
  ALTER TABLE "_settings_v" DROP COLUMN "version_business_image_id";
  DROP TYPE "public"."enum_repairs_structured_data_type";
  DROP TYPE "public"."enum__repairs_v_version_structured_data_type";
  DROP TYPE "public"."enum_areas_structured_data_type";
  DROP TYPE "public"."enum__areas_v_version_structured_data_type";
  DROP TYPE "public"."enum_posts_structured_data_type";
  DROP TYPE "public"."enum__posts_v_version_structured_data_type";
  DROP TYPE "public"."enum_cleaning_structured_data_type";
  DROP TYPE "public"."enum__cleaning_v_version_structured_data_type";`)
}
