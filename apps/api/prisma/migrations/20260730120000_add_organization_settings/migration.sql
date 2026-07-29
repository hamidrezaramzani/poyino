-- CreateTable
CREATE TABLE "stored_files" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "storage_key" VARCHAR(255) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stored_files_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "organizations"
ADD COLUMN "display_name" VARCHAR(80),
ADD COLUMN "description" VARCHAR(300),
ADD COLUMN "email" VARCHAR(255),
ADD COLUMN "phone" VARCHAR(20),
ADD COLUMN "website" VARCHAR(255),
ADD COLUMN "country" VARCHAR(80),
ADD COLUMN "city" VARCHAR(80),
ADD COLUMN "address" VARCHAR(300),
ADD COLUMN "timezone" VARCHAR(64) NOT NULL DEFAULT 'Asia/Tehran',
ADD COLUMN "language" VARCHAR(8) NOT NULL DEFAULT 'fa',
ADD COLUMN "primary_color" VARCHAR(7) NOT NULL DEFAULT '#150578',
ADD COLUMN "secondary_color" VARCHAR(7) NOT NULL DEFAULT '#3943B7',
ADD COLUMN "logo_id" UUID,
ADD COLUMN "dark_logo_id" UUID,
ADD COLUMN "new_candidate_email" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "candidate_status_email" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "interview_reminder_email" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "job_expiration_email" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "job_published_email" BOOLEAN NOT NULL DEFAULT false;

-- Backfill organization email from the first user in each organization
UPDATE "organizations" AS o
SET "email" = u."email"
FROM (
    SELECT DISTINCT ON ("organization_id")
        "organization_id",
        "email"
    FROM "users"
    ORDER BY "organization_id", "created_at" ASC
) AS u
WHERE o."id" = u."organization_id"
  AND o."email" IS NULL;

UPDATE "organizations"
SET "email" = CONCAT('org-', REPLACE("id"::text, '-', ''), '@poyino.local')
WHERE "email" IS NULL;

ALTER TABLE "organizations"
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_email_key" ON "organizations"("email");

-- CreateIndex
CREATE INDEX "stored_files_organization_id_idx" ON "stored_files"("organization_id");

-- AddForeignKey
ALTER TABLE "stored_files" ADD CONSTRAINT "stored_files_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "stored_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_dark_logo_id_fkey" FOREIGN KEY ("dark_logo_id") REFERENCES "stored_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
