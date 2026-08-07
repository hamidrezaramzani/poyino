-- CreateTable
CREATE TABLE "beta_feedback_responses" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "submitted_by_user_id" UUID NOT NULL,
    "survey_key" VARCHAR(64) NOT NULL,
    "survey_version" VARCHAR(32) NOT NULL,
    "product_version" VARCHAR(64),
    "answers" JSONB NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_feedback_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "beta_feedback_responses_survey_key_survey_version_submitted_at_idx" ON "beta_feedback_responses"("survey_key", "survey_version", "submitted_at");

-- CreateIndex
CREATE INDEX "beta_feedback_responses_submitted_at_idx" ON "beta_feedback_responses"("submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "beta_feedback_responses_organization_id_survey_key_key" ON "beta_feedback_responses"("organization_id", "survey_key");

-- AddForeignKey
ALTER TABLE "beta_feedback_responses" ADD CONSTRAINT "beta_feedback_responses_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_feedback_responses" ADD CONSTRAINT "beta_feedback_responses_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
