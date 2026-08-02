-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1000),
    "color" VARCHAR(7),
    "manager_id" UUID,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "departments_organization_id_name_key" ON "departments"("organization_id", "name");
CREATE INDEX "departments_organization_id_archived_at_idx" ON "departments"("organization_id", "archived_at");

ALTER TABLE "departments" ADD CONSTRAINT "departments_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed General department per organization
INSERT INTO "departments" ("id", "organization_id", "name", "is_default", "created_at", "updated_at")
SELECT gen_random_uuid(), o."id", 'General', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "organizations" o;

-- Create departments from distinct job department strings
INSERT INTO "departments" ("id", "organization_id", "name", "is_default", "created_at", "updated_at")
SELECT gen_random_uuid(), j."organization_id", TRIM(j."department"), false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (
  SELECT DISTINCT "organization_id", TRIM("department") AS "department"
  FROM "jobs"
  WHERE "department" IS NOT NULL AND TRIM("department") <> '' AND TRIM("department") <> 'General'
) j
ON CONFLICT ("organization_id", "name") DO NOTHING;

-- Add nullable columns first
ALTER TABLE "users" ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "users" ADD COLUMN "department_id" UUID;

ALTER TABLE "jobs" ADD COLUMN "department_id" UUID;
ALTER TABLE "job_templates" ADD COLUMN "department_id" UUID;

-- Backfill users → General + promote ADMINISTRATOR → OWNER
UPDATE "users" u
SET "department_id" = d."id",
    "role" = 'OWNER'
FROM "departments" d
WHERE d."organization_id" = u."organization_id"
  AND d."is_default" = true
  AND u."role" = 'ADMINISTRATOR';

UPDATE "users" u
SET "department_id" = d."id"
FROM "departments" d
WHERE d."organization_id" = u."organization_id"
  AND d."is_default" = true
  AND u."department_id" IS NULL;

-- Backfill jobs
UPDATE "jobs" j
SET "department_id" = d."id"
FROM "departments" d
WHERE d."organization_id" = j."organization_id"
  AND j."department" IS NOT NULL
  AND TRIM(j."department") <> ''
  AND d."name" = TRIM(j."department")
  AND j."department_id" IS NULL;

UPDATE "jobs" j
SET "department_id" = d."id",
    "department" = COALESCE(NULLIF(TRIM(j."department"), ''), 'General')
FROM "departments" d
WHERE d."organization_id" = j."organization_id"
  AND d."is_default" = true
  AND j."department_id" IS NULL;

-- Backfill job templates
UPDATE "job_templates" jt
SET "department_id" = d."id"
FROM "departments" d
WHERE d."organization_id" = jt."organization_id"
  AND jt."department" IS NOT NULL
  AND TRIM(jt."department") <> ''
  AND d."name" = TRIM(jt."department")
  AND jt."department_id" IS NULL;

UPDATE "job_templates" jt
SET "department_id" = d."id"
FROM "departments" d
WHERE d."organization_id" = jt."organization_id"
  AND d."is_default" = true
  AND jt."department_id" IS NULL;

-- Make required columns NOT NULL
ALTER TABLE "users" ALTER COLUMN "department_id" SET NOT NULL;
ALTER TABLE "jobs" ALTER COLUMN "department_id" SET NOT NULL;

ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'OWNER'::"UserRole";

ALTER TABLE "departments" ADD CONSTRAINT "departments_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "job_templates" ADD CONSTRAINT "job_templates_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "users_organization_id_department_id_idx" ON "users"("organization_id", "department_id");
CREATE INDEX "jobs_organization_id_department_id_idx" ON "jobs"("organization_id", "department_id");
