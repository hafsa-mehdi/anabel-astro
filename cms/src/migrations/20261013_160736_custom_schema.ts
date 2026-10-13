import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "repairs" ADD COLUMN "structured_data_custom" varchar;
  ALTER TABLE "_repairs_v" ADD COLUMN "version_structured_data_custom" varchar;
  ALTER TABLE "areas" ADD COLUMN "structured_data_custom" varchar;
  ALTER TABLE "_areas_v" ADD COLUMN "version_structured_data_custom" varchar;
  ALTER TABLE "posts" ADD COLUMN "structured_data_custom" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_structured_data_custom" varchar;
  ALTER TABLE "home" ADD COLUMN "structured_data_custom" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_structured_data_custom" varchar;
  ALTER TABLE "cleaning" ADD COLUMN "structured_data_custom" varchar;
  ALTER TABLE "_cleaning_v" ADD COLUMN "version_structured_data_custom" varchar;
  ALTER TABLE "visit" ADD COLUMN "structured_data_custom" varchar;
  ALTER TABLE "_visit_v" ADD COLUMN "version_structured_data_custom" varchar;
  ALTER TABLE "team" ADD COLUMN "structured_data_custom" varchar;
  ALTER TABLE "_team_v" ADD COLUMN "version_structured_data_custom" varchar;
  ALTER TABLE "tour" ADD COLUMN "structured_data_custom" varchar;
  ALTER TABLE "_tour_v" ADD COLUMN "version_structured_data_custom" varchar;
  ALTER TABLE "designers" ADD COLUMN "structured_data_custom" varchar;
  ALTER TABLE "_designers_v" ADD COLUMN "version_structured_data_custom" varchar;
  ALTER TABLE "blog" ADD COLUMN "structured_data_custom" varchar;
  ALTER TABLE "_blog_v" ADD COLUMN "version_structured_data_custom" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "repairs" DROP COLUMN "structured_data_custom";
  ALTER TABLE "_repairs_v" DROP COLUMN "version_structured_data_custom";
  ALTER TABLE "areas" DROP COLUMN "structured_data_custom";
  ALTER TABLE "_areas_v" DROP COLUMN "version_structured_data_custom";
  ALTER TABLE "posts" DROP COLUMN "structured_data_custom";
  ALTER TABLE "_posts_v" DROP COLUMN "version_structured_data_custom";
  ALTER TABLE "home" DROP COLUMN "structured_data_custom";
  ALTER TABLE "_home_v" DROP COLUMN "version_structured_data_custom";
  ALTER TABLE "cleaning" DROP COLUMN "structured_data_custom";
  ALTER TABLE "_cleaning_v" DROP COLUMN "version_structured_data_custom";
  ALTER TABLE "visit" DROP COLUMN "structured_data_custom";
  ALTER TABLE "_visit_v" DROP COLUMN "version_structured_data_custom";
  ALTER TABLE "team" DROP COLUMN "structured_data_custom";
  ALTER TABLE "_team_v" DROP COLUMN "version_structured_data_custom";
  ALTER TABLE "tour" DROP COLUMN "structured_data_custom";
  ALTER TABLE "_tour_v" DROP COLUMN "version_structured_data_custom";
  ALTER TABLE "designers" DROP COLUMN "structured_data_custom";
  ALTER TABLE "_designers_v" DROP COLUMN "version_structured_data_custom";
  ALTER TABLE "blog" DROP COLUMN "structured_data_custom";
  ALTER TABLE "_blog_v" DROP COLUMN "version_structured_data_custom";`)
}
