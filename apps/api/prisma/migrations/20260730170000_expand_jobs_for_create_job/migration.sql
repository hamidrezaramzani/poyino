-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "WorkplaceType" AS ENUM ('ON_SITE', 'HYBRID', 'REMOTE');

-- AlterTable organizations
ALTER TABLE "organizations" ADD COLUMN "default_currency" VARCHAR(3) NOT NULL DEFAULT 'IRR';

-- AlterTable jobs: add new columns with temporary defaults for existing rows
ALTER TABLE "jobs"
  ADD COLUMN "department" VARCHAR(80),
  ADD COLUMN "employment_type" "EmploymentType",
  ADD COLUMN "workplace_type" "WorkplaceType",
  ADD COLUMN "location" VARCHAR(120),
  ADD COLUMN "salary_min" INTEGER,
  ADD COLUMN "salary_max" INTEGER,
  ADD COLUMN "currency" VARCHAR(3) NOT NULL DEFAULT 'IRR',
  ADD COLUMN "salary_visible" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "description" TEXT,
  ADD COLUMN "responsibilities" TEXT,
  ADD COLUMN "requirements" TEXT,
  ADD COLUMN "benefits" TEXT,
  ADD COLUMN "positions" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "expiration_date" DATE;

-- Backfill existing jobs
UPDATE "jobs"
SET
  "employment_type" = 'FULL_TIME',
  "workplace_type" = 'ON_SITE',
  "description" = 'Job description pending.'
WHERE "employment_type" IS NULL OR "workplace_type" IS NULL OR "description" IS NULL;

-- Enforce required columns
ALTER TABLE "jobs"
  ALTER COLUMN "employment_type" SET NOT NULL,
  ALTER COLUMN "workplace_type" SET NOT NULL,
  ALTER COLUMN "description" SET NOT NULL;

-- Shrink title length (existing titles may be longer; truncate safely)
UPDATE "jobs" SET "title" = LEFT("title", 100) WHERE LENGTH("title") > 100;
ALTER TABLE "jobs" ALTER COLUMN "title" TYPE VARCHAR(100);

-- CreateTable skills
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable job_skills
CREATE TABLE "job_skills" (
    "job_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_skills_pkey" PRIMARY KEY ("job_id","skill_id")
);

-- CreateTable job_templates
CREATE TABLE "job_templates" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "department" VARCHAR(80),
    "employment_type" "EmploymentType" NOT NULL,
    "workplace_type" "WorkplaceType" NOT NULL,
    "location" VARCHAR(120),
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'IRR',
    "salary_visible" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT,
    "requirements" TEXT,
    "benefits" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "positions" INTEGER NOT NULL DEFAULT 1,
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skills_organization_id_idx" ON "skills"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "skills_organization_id_name_key" ON "skills"("organization_id", "name");

-- CreateIndex
CREATE INDEX "job_skills_skill_id_idx" ON "job_skills"("skill_id");

-- CreateIndex
CREATE INDEX "job_templates_organization_id_created_at_idx" ON "job_templates"("organization_id", "created_at");

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_skills" ADD CONSTRAINT "job_skills_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_skills" ADD CONSTRAINT "job_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_templates" ADD CONSTRAINT "job_templates_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
