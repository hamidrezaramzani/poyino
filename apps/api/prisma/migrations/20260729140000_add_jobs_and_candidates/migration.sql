-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('APPLIED', 'INTERVIEW_PENDING', 'INTERVIEW_APPROVED', 'HIRED', 'REJECTED');

-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'APPLIED',
    "ai_score" INTEGER,
    "job_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobs_organization_id_created_at_idx" ON "jobs"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "jobs_organization_id_status_idx" ON "jobs"("organization_id", "status");

-- CreateIndex
CREATE INDEX "candidates_organization_id_applied_at_idx" ON "candidates"("organization_id", "applied_at");

-- CreateIndex
CREATE INDEX "candidates_job_id_idx" ON "candidates"("job_id");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
