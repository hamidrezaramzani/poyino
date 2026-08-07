-- CreateEnum
CREATE TYPE "AiCreditFeature" AS ENUM (
  'GENERATE_JOB',
  'RESUME_ANALYSIS',
  'RESUME_AUTOFILL',
  'CANDIDATE_RANKING',
  'INTERVIEW_QUESTIONS',
  'INTERVIEW_SUMMARY'
);

-- CreateEnum
CREATE TYPE "AiCreditTransactionType" AS ENUM (
  'GRANT',
  'CONSUME',
  'REFUND',
  'ADJUSTMENT',
  'BONUS',
  'PURCHASE',
  'EXPIRATION'
);

-- CreateTable
CREATE TABLE "organization_ai_credits" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "balance" INTEGER NOT NULL DEFAULT 0,
  "lifetime_granted" INTEGER NOT NULL DEFAULT 0,
  "lifetime_consumed" INTEGER NOT NULL DEFAULT 0,
  "renews_at" TIMESTAMP(3),
  "expires_at" TIMESTAMP(3),
  "plan_code" VARCHAR(64),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "organization_ai_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_credit_transactions" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "user_id" UUID,
  "type" "AiCreditTransactionType" NOT NULL,
  "feature" "AiCreditFeature",
  "amount" INTEGER NOT NULL,
  "balance_after" INTEGER NOT NULL,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ai_credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_ai_credits_organization_id_key" ON "organization_ai_credits"("organization_id");

-- CreateIndex
CREATE INDEX "ai_credit_transactions_organization_id_created_at_idx" ON "ai_credit_transactions"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "ai_credit_transactions_organization_id_feature_type_idx" ON "ai_credit_transactions"("organization_id", "feature", "type");

-- CreateIndex
CREATE INDEX "ai_credit_transactions_user_id_idx" ON "ai_credit_transactions"("user_id");

-- AddForeignKey
ALTER TABLE "organization_ai_credits"
  ADD CONSTRAINT "organization_ai_credits_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_credit_transactions"
  ADD CONSTRAINT "ai_credit_transactions_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_credit_transactions"
  ADD CONSTRAINT "ai_credit_transactions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill Beta grant for existing organizations
INSERT INTO "organization_ai_credits" (
  "id",
  "organization_id",
  "balance",
  "lifetime_granted",
  "lifetime_consumed",
  "plan_code",
  "created_at",
  "updated_at"
)
SELECT
  gen_random_uuid(),
  o."id",
  50,
  50,
  0,
  'beta',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "organizations" o
WHERE NOT EXISTS (
  SELECT 1
  FROM "organization_ai_credits" c
  WHERE c."organization_id" = o."id"
);

INSERT INTO "ai_credit_transactions" (
  "id",
  "organization_id",
  "user_id",
  "type",
  "feature",
  "amount",
  "balance_after",
  "metadata",
  "created_at"
)
SELECT
  gen_random_uuid(),
  c."organization_id",
  NULL,
  'GRANT',
  NULL,
  50,
  c."balance",
  '{"reason":"beta_initial_grant"}'::jsonb,
  CURRENT_TIMESTAMP
FROM "organization_ai_credits" c
WHERE NOT EXISTS (
  SELECT 1
  FROM "ai_credit_transactions" t
  WHERE t."organization_id" = c."organization_id"
    AND t."type" = 'GRANT'
);
