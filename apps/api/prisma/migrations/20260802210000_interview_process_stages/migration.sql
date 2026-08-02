-- CreateEnum
CREATE TYPE "InterviewProcessStatus" AS ENUM ('WAITING', 'INTERVIEWING', 'PASSED', 'FAILED', 'HIRED');

-- CreateEnum
CREATE TYPE "InterviewResult" AS ENUM ('PASSED', 'FAILED', 'PENDING');

-- AlterEnum InterviewType
ALTER TYPE "InterviewType" ADD VALUE 'TEAM_LEAD';
ALTER TYPE "InterviewType" ADD VALUE 'CUSTOM';

-- AlterEnum InterviewStatus (add new values; keep existing)
ALTER TYPE "InterviewStatus" ADD VALUE 'IN_PROGRESS';
ALTER TYPE "InterviewStatus" ADD VALUE 'NO_SHOW';

-- AlterEnum ApplicationActivityType
ALTER TYPE "ApplicationActivityType" ADD VALUE 'INTERVIEW_STARTED';
ALTER TYPE "ApplicationActivityType" ADD VALUE 'INTERVIEW_NO_SHOW';
ALTER TYPE "ApplicationActivityType" ADD VALUE 'INTERVIEW_PROCESS_UPDATED';

-- CreateTable
CREATE TABLE "interview_processes" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "status" "InterviewProcessStatus" NOT NULL DEFAULT 'WAITING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_processes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interview_processes_application_id_key" ON "interview_processes"("application_id");

-- CreateIndex
CREATE INDEX "interview_processes_organization_id_status_idx" ON "interview_processes"("organization_id", "status");

-- CreateIndex
CREATE INDEX "interview_processes_job_id_idx" ON "interview_processes"("job_id");

-- CreateIndex
CREATE INDEX "interview_processes_candidate_id_idx" ON "interview_processes"("candidate_id");

-- AddForeignKey
ALTER TABLE "interview_processes" ADD CONSTRAINT "interview_processes_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "interview_processes" ADD CONSTRAINT "interview_processes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "interview_processes" ADD CONSTRAINT "interview_processes_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "interview_processes" ADD CONSTRAINT "interview_processes_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable interviews: add new columns (nullable first for backfill)
ALTER TABLE "interviews" ADD COLUMN "process_id" UUID;
ALTER TABLE "interviews" ADD COLUMN "name" VARCHAR(120);
ALTER TABLE "interviews" ADD COLUMN "result" "InterviewResult";
ALTER TABLE "interviews" ADD COLUMN "internal_notes" VARCHAR(5000);
ALTER TABLE "interviews" ADD COLUMN "candidate_notes" VARCHAR(5000);
ALTER TABLE "interviews" ADD COLUMN "recruiter_user_id" UUID;

-- Backfill notes -> internal_notes
UPDATE "interviews" SET "internal_notes" = "notes" WHERE "notes" IS NOT NULL;

-- Backfill stage name from type
UPDATE "interviews" SET "name" = CASE "type"
  WHEN 'HR' THEN 'HR Interview'
  WHEN 'TECHNICAL' THEN 'Technical Interview'
  WHEN 'MANAGER' THEN 'Manager Interview'
  WHEN 'FINAL' THEN 'Final Interview'
  ELSE 'Interview'
END
WHERE "name" IS NULL;

-- Create processes for applications that already have interviews
INSERT INTO "interview_processes" ("id", "application_id", "organization_id", "job_id", "candidate_id", "status", "created_at", "updated_at")
SELECT
  gen_random_uuid(),
  i."application_id",
  i."organization_id",
  i."job_id",
  i."candidate_id",
  CASE
    WHEN bool_or(i."status" = 'SCHEDULED') THEN 'INTERVIEWING'::"InterviewProcessStatus"
    WHEN bool_or(i."status" = 'COMPLETED') THEN 'PASSED'::"InterviewProcessStatus"
    ELSE 'WAITING'::"InterviewProcessStatus"
  END,
  MIN(i."created_at"),
  NOW()
FROM "interviews" i
GROUP BY i."application_id", i."organization_id", i."job_id", i."candidate_id";

-- Link interviews to processes
UPDATE "interviews" AS inv
SET "process_id" = p."id"
FROM "interview_processes" AS p
WHERE inv."application_id" = p."application_id"
  AND inv."process_id" IS NULL;

-- Make required columns NOT NULL
ALTER TABLE "interviews" ALTER COLUMN "process_id" SET NOT NULL;
ALTER TABLE "interviews" ALTER COLUMN "name" SET NOT NULL;

-- Drop old notes column
ALTER TABLE "interviews" DROP COLUMN "notes";

-- Indexes and FKs for interviews
CREATE INDEX "interviews_process_id_scheduled_at_idx" ON "interviews"("process_id", "scheduled_at");
CREATE INDEX "interviews_recruiter_user_id_scheduled_at_idx" ON "interviews"("recruiter_user_id", "scheduled_at");

ALTER TABLE "interviews" ADD CONSTRAINT "interviews_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "interview_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "interviews" ADD CONSTRAINT "interviews_recruiter_user_id_fkey" FOREIGN KEY ("recruiter_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
