import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_repairs_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_areas_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_posts_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_testimonials_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_home_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_cleaning_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_visit_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_team_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_tour_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_designers_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_blog_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_settings_v" ADD COLUMN "autosave" boolean;
  CREATE INDEX "_repairs_v_autosave_idx" ON "_repairs_v" USING btree ("autosave");
  CREATE INDEX "_areas_v_autosave_idx" ON "_areas_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_testimonials_v_autosave_idx" ON "_testimonials_v" USING btree ("autosave");
  CREATE INDEX "_home_v_autosave_idx" ON "_home_v" USING btree ("autosave");
  CREATE INDEX "_cleaning_v_autosave_idx" ON "_cleaning_v" USING btree ("autosave");
  CREATE INDEX "_visit_v_autosave_idx" ON "_visit_v" USING btree ("autosave");
  CREATE INDEX "_team_v_autosave_idx" ON "_team_v" USING btree ("autosave");
  CREATE INDEX "_tour_v_autosave_idx" ON "_tour_v" USING btree ("autosave");
  CREATE INDEX "_designers_v_autosave_idx" ON "_designers_v" USING btree ("autosave");
  CREATE INDEX "_blog_v_autosave_idx" ON "_blog_v" USING btree ("autosave");
  CREATE INDEX "_settings_v_autosave_idx" ON "_settings_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "_repairs_v_autosave_idx";
  DROP INDEX "_areas_v_autosave_idx";
  DROP INDEX "_posts_v_autosave_idx";
  DROP INDEX "_testimonials_v_autosave_idx";
  DROP INDEX "_home_v_autosave_idx";
  DROP INDEX "_cleaning_v_autosave_idx";
  DROP INDEX "_visit_v_autosave_idx";
  DROP INDEX "_team_v_autosave_idx";
  DROP INDEX "_tour_v_autosave_idx";
  DROP INDEX "_designers_v_autosave_idx";
  DROP INDEX "_blog_v_autosave_idx";
  DROP INDEX "_settings_v_autosave_idx";
  ALTER TABLE "_repairs_v" DROP COLUMN "autosave";
  ALTER TABLE "_areas_v" DROP COLUMN "autosave";
  ALTER TABLE "_posts_v" DROP COLUMN "autosave";
  ALTER TABLE "_testimonials_v" DROP COLUMN "autosave";
  ALTER TABLE "_home_v" DROP COLUMN "autosave";
  ALTER TABLE "_cleaning_v" DROP COLUMN "autosave";
  ALTER TABLE "_visit_v" DROP COLUMN "autosave";
  ALTER TABLE "_team_v" DROP COLUMN "autosave";
  ALTER TABLE "_tour_v" DROP COLUMN "autosave";
  ALTER TABLE "_designers_v" DROP COLUMN "autosave";
  ALTER TABLE "_blog_v" DROP COLUMN "autosave";
  ALTER TABLE "_settings_v" DROP COLUMN "autosave";`)
}
