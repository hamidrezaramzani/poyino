-- Migrate stored_files from local path keys to object-storage metadata.

ALTER TABLE "stored_files" RENAME COLUMN "storage_key" TO "object_key";

ALTER TABLE "stored_files"
  ALTER COLUMN "object_key" TYPE VARCHAR(512);

ALTER TABLE "stored_files"
  ADD COLUMN "provider" VARCHAR(50),
  ADD COLUMN "bucket" VARCHAR(255),
  ADD COLUMN "extension" VARCHAR(20),
  ADD COLUMN "etag" VARCHAR(255),
  ADD COLUMN "public_url" TEXT;

-- Backfill metadata for any rows created under the local filesystem provider.
UPDATE "stored_files"
SET
  "provider" = COALESCE("provider", 'local'),
  "bucket" = COALESCE("bucket", 'local'),
  "extension" = COALESCE(
    "extension",
    CASE
      WHEN "object_key" ~ '\.[A-Za-z0-9]+$'
        THEN lower(substring("object_key" from '\.([A-Za-z0-9]+)$'))
      ELSE ''
    END
  );

ALTER TABLE "stored_files"
  ALTER COLUMN "provider" SET NOT NULL,
  ALTER COLUMN "bucket" SET NOT NULL,
  ALTER COLUMN "extension" SET NOT NULL;

CREATE INDEX "stored_files_object_key_idx" ON "stored_files"("object_key");
