-- Collaborative interview responses: statuses, response fields, audit trail

-- Recreate InterviewStatus with collaborative lifecycle values
CREATE TYPE "InterviewStatus_new" AS ENUM (
  'DRAFT',
  'SCHEDULED',
  'WAITING_CANDIDATE_CONFIRMATION',
  'ACCEPTED',
  'RESCHEDULE_REQUESTED',
  'DECLINED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW'
);

ALTER TABLE "interviews" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "interviews"
  ALTER COLUMN "status" TYPE "InterviewStatus_new"
  USING (
    CASE "status"::text
      WHEN 'SCHEDULED' THEN 'WAITING_CANDIDATE_CONFIRMATION'
      ELSE "status"::text
    END::"InterviewStatus_new"
  );

DROP TYPE "InterviewStatus";
ALTER TYPE "InterviewStatus_new" RENAME TO "InterviewStatus";

ALTER TABLE "interviews"
  ALTER COLUMN "status" SET DEFAULT 'WAITING_CANDIDATE_CONFIRMATION';

-- Candidate response enum
CREATE TYPE "InterviewCandidateResponse" AS ENUM (
  'ACCEPTED',
  'RESCHEDULE_REQUESTED',
  'DECLINED'
);

-- Status transition actor
CREATE TYPE "InterviewStatusActor" AS ENUM (
  'RECRUITER',
  'CANDIDATE',
  'SYSTEM'
);

-- Application activity types for candidate responses
CREATE TYPE "ApplicationActivityType_new" AS ENUM (
  'APPLICATION_SUBMITTED',
  'RESUME_PROCESSED',
  'AI_ANALYSIS_COMPLETED',
  'STATUS_CHANGED',
  'NOTE_ADDED',
  'NOTE_UPDATED',
  'NOTE_DELETED',
  'INTERVIEW_SCHEDULED',
  'INTERVIEW_UPDATED',
  'INTERVIEW_CANCELLED',
  'INTERVIEW_COMPLETED',
  'INTERVIEW_STARTED',
  'INTERVIEW_NO_SHOW',
  'INTERVIEW_PROCESS_UPDATED',
  'INTERVIEW_ACCEPTED',
  'INTERVIEW_RESCHEDULE_REQUESTED',
  'INTERVIEW_DECLINED',
  'INTERVIEW_RESCHEDULED'
);

ALTER TABLE "application_activity_events"
  ALTER COLUMN "type" TYPE "ApplicationActivityType_new"
  USING ("type"::text::"ApplicationActivityType_new");

DROP TYPE "ApplicationActivityType";
ALTER TYPE "ApplicationActivityType_new" RENAME TO "ApplicationActivityType";

-- Interview response fields
ALTER TABLE "interviews"
  ADD COLUMN "candidate_response" "InterviewCandidateResponse",
  ADD COLUMN "responded_at" TIMESTAMP(3),
  ADD COLUMN "response_message" VARCHAR(2000),
  ADD COLUMN "proposed_scheduled_at" TIMESTAMP(3);

CREATE INDEX "interviews_status_idx" ON "interviews"("status");

-- Status transition audit
CREATE TABLE "interview_status_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "interview_id" UUID NOT NULL,
  "from_status" "InterviewStatus",
  "to_status" "InterviewStatus" NOT NULL,
  "actor_type" "InterviewStatusActor" NOT NULL,
  "actor_user_id" UUID,
  "message" VARCHAR(2000),
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "interview_status_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "interview_status_events_interview_id_created_at_idx"
  ON "interview_status_events"("interview_id", "created_at");

ALTER TABLE "interview_status_events"
  ADD CONSTRAINT "interview_status_events_interview_id_fkey"
  FOREIGN KEY ("interview_id") REFERENCES "interviews"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
