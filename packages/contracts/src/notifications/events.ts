export const NotificationEventName = {
  AUTH_EMAIL_VERIFIED: "auth.email_verified",
  ORGANIZATION_MEMBER_INVITED: "organization.member_invited",
  ORGANIZATION_MEMBER_JOINED: "organization.member_joined",
  JOB_CREATED: "job.created",
  JOB_PUBLISHED: "job.published",
  JOB_UNPUBLISHED: "job.unpublished",
  JOB_ARCHIVED: "job.archived",
  JOB_EXPIRED: "job.expired",
  CANDIDATE_APPLIED: "candidate.applied",
  CANDIDATE_STATUS_CHANGED: "candidate.status_changed",
  CANDIDATE_HIRED: "candidate.hired",
  CANDIDATE_REJECTED: "candidate.rejected",
  INTERVIEW_CREATED: "interview.created",
  INTERVIEW_UPDATED: "interview.updated",
  INTERVIEW_CANCELLED: "interview.cancelled",
  INTERVIEW_COMPLETED: "interview.completed",
  INTERVIEW_NOTE_ADDED: "interview.note_added",
  INTERVIEW_RESCHEDULED: "interview.rescheduled",
  INTERVIEW_ACCEPTED_BY_CANDIDATE: "interview.accepted_by_candidate",
  INTERVIEW_RESCHEDULE_REQUESTED_BY_CANDIDATE:
    "interview.reschedule_requested_by_candidate",
  INTERVIEW_DECLINED_BY_CANDIDATE: "interview.declined_by_candidate",
  DEPARTMENT_CREATED: "department.created",
  MEMBER_ROLE_CHANGED: "member.role_changed",
  MEMBER_DEPARTMENT_CHANGED: "member.department_changed",
  INVITATION_ACCEPTED: "invitation.accepted",
  AI_RESUME_ANALYSIS_COMPLETED: "ai.resume_analysis_completed",
  AI_JOB_GENERATED: "ai.job_generated",
  AI_INTERVIEW_QUESTIONS_GENERATED: "ai.interview_questions_generated",
  AI_INTERVIEW_SUMMARY_GENERATED: "ai.interview_summary_generated",
  BILLING_AI_CREDIT_LOW: "billing.ai_credit_low",
  SYSTEM_MAINTENANCE: "system.maintenance",
  SYSTEM_SECURITY_ALERT: "system.security_alert",
} as const;

export type NotificationEventName =
  (typeof NotificationEventName)[keyof typeof NotificationEventName];

export const DOMAIN_NOTIFICATION_EVENT = "notification.domain_event";
