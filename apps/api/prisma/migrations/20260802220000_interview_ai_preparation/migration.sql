-- AlterTable
ALTER TABLE "interviews" ADD COLUMN "ai_preparation" JSONB;
ALTER TABLE "interviews" ADD COLUMN "ai_prompt" VARCHAR(2000);
ALTER TABLE "interviews" ADD COLUMN "ai_generated_at" TIMESTAMP(3);
