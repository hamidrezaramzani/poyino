-- AlterTable: expand candidates for person-level profile
ALTER TABLE "candidates" ADD COLUMN "email" VARCHAR(255);
ALTER TABLE "candidates" ADD COLUMN "phone" VARCHAR(40);
ALTER TABLE "candidates" ADD COLUMN "current_position" VARCHAR(120);
ALTER TABLE "candidates" ADD COLUMN "skills" JSONB;
ALTER TABLE "candidates" ADD COLUMN "experience" TEXT;
ALTER TABLE "candidates" ADD COLUMN "education" TEXT;
ALTER TABLE "candidates" ADD COLUMN "linkedin" VARCHAR(255);
ALTER TABLE "candidates" ADD COLUMN "portfolio" VARCHAR(255);
ALTER TABLE "candidates" ADD COLUMN "website" VARCHAR(255);

-- Backfill required fields for any existing rows
UPDATE "candidates"
SET
  "email" = CONCAT('legacy-', "id", '@placeholder.local'),
  "phone" = '0000000000'
WHERE "email" IS NULL OR "phone" IS NULL;

ALTER TABLE "candidates" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "candidates" ALTER COLUMN "phone" SET NOT NULL;

-- Allow job_id to be nullable (Application owns the job link going forward)
ALTER TABLE "candidates" ALTER COLUMN "job_id" DROP NOT NULL;

ALTER TABLE "candidates" DROP CONSTRAINT "candidates_job_id_fkey";
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "candidates_organization_id_email_key" ON "candidates"("organization_id", "email");

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'APPLIED',
    "tracking_token_hash" VARCHAR(64) NOT NULL,
    "extracted_text" TEXT,
    "ai_analysis" JSONB,
    "resume_file_id" UUID,
    "candidate_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "applications_tracking_token_hash_key" ON "applications"("tracking_token_hash");
CREATE UNIQUE INDEX "applications_job_id_candidate_id_key" ON "applications"("job_id", "candidate_id");
CREATE INDEX "applications_organization_id_applied_at_idx" ON "applications"("organization_id", "applied_at");
CREATE INDEX "applications_job_id_idx" ON "applications"("job_id");
CREATE INDEX "applications_candidate_id_idx" ON "applications"("candidate_id");

ALTER TABLE "applications" ADD CONSTRAINT "applications_resume_file_id_fkey" FOREIGN KEY ("resume_file_id") REFERENCES "stored_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "applications" ADD CONSTRAINT "applications_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "application_status_events" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "status" "CandidateStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_status_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "application_status_events_application_id_created_at_idx" ON "application_status_events"("application_id", "created_at");

ALTER TABLE "application_status_events" ADD CONSTRAINT "application_status_events_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
