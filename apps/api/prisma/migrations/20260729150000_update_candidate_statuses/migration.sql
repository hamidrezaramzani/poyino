-- Recreate CandidateStatus enum to match product statuses.
CREATE TYPE "CandidateStatus_new" AS ENUM (
  'APPLIED',
  'REVIEWING',
  'INTERVIEW_SCHEDULED',
  'INTERVIEW_PASSED',
  'REJECTED',
  'HIRED'
);

ALTER TABLE "candidates" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "candidates"
  ALTER COLUMN "status" TYPE "CandidateStatus_new"
  USING (
    CASE "status"::text
      WHEN 'INTERVIEW_PENDING' THEN 'INTERVIEW_SCHEDULED'
      WHEN 'INTERVIEW_APPROVED' THEN 'INTERVIEW_PASSED'
      ELSE "status"::text
    END::"CandidateStatus_new"
  );

DROP TYPE "CandidateStatus";

ALTER TYPE "CandidateStatus_new" RENAME TO "CandidateStatus";

ALTER TABLE "candidates" ALTER COLUMN "status" SET DEFAULT 'APPLIED';
