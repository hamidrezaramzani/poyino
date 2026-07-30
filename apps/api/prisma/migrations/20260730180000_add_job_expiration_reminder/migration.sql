-- AlterTable
ALTER TABLE "jobs" ADD COLUMN "expiration_reminder_sent_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "jobs_status_expiration_date_idx" ON "jobs"("status", "expiration_date");
