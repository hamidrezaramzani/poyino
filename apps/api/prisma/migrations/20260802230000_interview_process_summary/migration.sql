-- AlterTable
ALTER TABLE "interview_processes" ADD COLUMN "ai_summary" JSONB;
ALTER TABLE "interview_processes" ADD COLUMN "ai_summary_generated_at" TIMESTAMP(3);
