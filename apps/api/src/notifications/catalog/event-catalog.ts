import type {
  NotificationCategory,
  NotificationPriority,
} from "@poyino/contracts";
import { NotificationEventName } from "@poyino/contracts";

export type EventCatalogEntry = {
  category: NotificationCategory;
  priority: NotificationPriority;
  mandatory?: boolean;
  resolveTitle: (metadata: Record<string, unknown>, locale: "fa" | "en") => string;
  resolveDescription: (
    metadata: Record<string, unknown>,
    locale: "fa" | "en",
  ) => string;
  resolveActionUrl?: (metadata: Record<string, unknown>) => string | null;
  /** When true, create an application-scoped notification for the candidate tracking page. */
  notifyCandidate?: boolean;
};

function str(metadata: Record<string, unknown>, key: string, fallback = "") {
  const value = metadata[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function candidateActionUrl(metadata: Record<string, unknown>) {
  const jobId = str(metadata, "jobId");
  const candidateId = str(metadata, "candidateId");
  if (!jobId || !candidateId) {
    return null;
  }
  return `/jobs/${jobId}/candidates/${candidateId}`;
}

function interviewActionUrl(metadata: Record<string, unknown>) {
  const jobId = str(metadata, "jobId");
  const candidateId = str(metadata, "candidateId");
  if (!jobId || !candidateId) {
    return null;
  }
  return `/jobs/${jobId}/candidates/${candidateId}/interviews`;
}

function jobActionUrl(metadata: Record<string, unknown>) {
  const jobId = str(metadata, "jobId");
  return jobId ? `/jobs/${jobId}` : null;
}

export const EVENT_CATALOG: Record<string, EventCatalogEntry> = {
  [NotificationEventName.CANDIDATE_APPLIED]: {
    category: "CANDIDATES",
    priority: "NORMAL",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "درخواست جدید دریافت شد" : "New application received",
    resolveDescription: (m, locale) => {
      const name = str(m, "candidateName", "Candidate");
      const job = str(m, "jobTitle", "job");
      return locale === "fa"
        ? `${name} برای ${job} درخواست داد.`
        : `${name} applied for ${job}.`;
    },
    resolveActionUrl: candidateActionUrl,
  },
  [NotificationEventName.CANDIDATE_STATUS_CHANGED]: {
    category: "CANDIDATES",
    priority: "NORMAL",
    notifyCandidate: true,
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "وضعیت درخواست به‌روز شد" : "Application status updated",
    resolveDescription: (m, locale) => {
      const status = str(m, "status", "updated");
      const job = str(m, "jobTitle", "job");
      return locale === "fa"
        ? `وضعیت درخواست شما برای ${job} به ${status} تغییر کرد.`
        : `Your application for ${job} is now ${status}.`;
    },
    resolveActionUrl: candidateActionUrl,
  },
  [NotificationEventName.CANDIDATE_HIRED]: {
    category: "CANDIDATES",
    priority: "HIGH",
    notifyCandidate: true,
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "استخدام انجام شد" : "Candidate hired",
    resolveDescription: (m, locale) => {
      const name = str(m, "candidateName", "Candidate");
      const job = str(m, "jobTitle", "job");
      return locale === "fa"
        ? `${name} برای ${job} استخدام شد.`
        : `${name} was hired for ${job}.`;
    },
    resolveActionUrl: candidateActionUrl,
  },
  [NotificationEventName.CANDIDATE_REJECTED]: {
    category: "CANDIDATES",
    priority: "HIGH",
    notifyCandidate: true,
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "رد شدن کاندیدا" : "Candidate rejected",
    resolveDescription: (m, locale) => {
      const name = str(m, "candidateName", "Candidate");
      const job = str(m, "jobTitle", "job");
      return locale === "fa"
        ? `${name} برای ${job} رد شد.`
        : `${name} was rejected for ${job}.`;
    },
    resolveActionUrl: candidateActionUrl,
  },
  [NotificationEventName.INTERVIEW_CREATED]: {
    category: "INTERVIEWS",
    priority: "HIGH",
    notifyCandidate: true,
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "مصاحبه زمان‌بندی شد" : "Interview scheduled",
    resolveDescription: (m, locale) => {
      const name = str(m, "candidateName", "Candidate");
      const interview = str(m, "interviewName", "Interview");
      return locale === "fa"
        ? `${interview} برای ${name} زمان‌بندی شد.`
        : `${interview} was scheduled for ${name}.`;
    },
    resolveActionUrl: interviewActionUrl,
  },
  [NotificationEventName.INTERVIEW_UPDATED]: {
    category: "INTERVIEWS",
    priority: "HIGH",
    notifyCandidate: true,
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "مصاحبه به‌روزرسانی شد" : "Interview updated",
    resolveDescription: (m, locale) => {
      const interview = str(m, "interviewName", "Interview");
      return locale === "fa"
        ? `${interview} به‌روزرسانی شد.`
        : `${interview} was updated.`;
    },
    resolveActionUrl: interviewActionUrl,
  },
  [NotificationEventName.INTERVIEW_CANCELLED]: {
    category: "INTERVIEWS",
    priority: "HIGH",
    notifyCandidate: true,
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "مصاحبه لغو شد" : "Interview cancelled",
    resolveDescription: (m, locale) => {
      const interview = str(m, "interviewName", "Interview");
      return locale === "fa"
        ? `${interview} لغو شد.`
        : `${interview} was cancelled.`;
    },
    resolveActionUrl: interviewActionUrl,
  },
  [NotificationEventName.INTERVIEW_COMPLETED]: {
    category: "INTERVIEWS",
    priority: "NORMAL",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "مصاحبه تکمیل شد" : "Interview completed",
    resolveDescription: (m, locale) => {
      const name = str(m, "candidateName", "Candidate");
      const interview = str(m, "interviewName", "Interview");
      return locale === "fa"
        ? `${interview} برای ${name} تکمیل شد.`
        : `${interview} for ${name} was completed.`;
    },
    resolveActionUrl: interviewActionUrl,
  },
  [NotificationEventName.INTERVIEW_NOTE_ADDED]: {
    category: "INTERVIEWS",
    priority: "LOW",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "یادداشت مصاحبه افزوده شد" : "Interview note added",
    resolveDescription: (m, locale) => {
      const name = str(m, "candidateName", "Candidate");
      return locale === "fa"
        ? `یادداشت جدیدی برای مصاحبه ${name} ثبت شد.`
        : `A new note was added for ${name}'s interview.`;
    },
    resolveActionUrl: interviewActionUrl,
  },
  [NotificationEventName.JOB_CREATED]: {
    category: "JOBS",
    priority: "LOW",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "شغل جدید ایجاد شد" : "Job created",
    resolveDescription: (m, locale) => {
      const job = str(m, "jobTitle", "Job");
      return locale === "fa" ? `${job} ایجاد شد.` : `${job} was created.`;
    },
    resolveActionUrl: jobActionUrl,
  },
  [NotificationEventName.JOB_PUBLISHED]: {
    category: "JOBS",
    priority: "LOW",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "شغل منتشر شد" : "Job published",
    resolveDescription: (m, locale) => {
      const job = str(m, "jobTitle", "Job");
      return locale === "fa" ? `${job} منتشر شد.` : `${job} was published.`;
    },
    resolveActionUrl: jobActionUrl,
  },
  [NotificationEventName.JOB_UNPUBLISHED]: {
    category: "JOBS",
    priority: "LOW",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "انتشار شغل لغو شد" : "Job unpublished",
    resolveDescription: (m, locale) => {
      const job = str(m, "jobTitle", "Job");
      return locale === "fa"
        ? `انتشار ${job} لغو شد.`
        : `${job} was unpublished.`;
    },
    resolveActionUrl: jobActionUrl,
  },
  [NotificationEventName.JOB_EXPIRED]: {
    category: "JOBS",
    priority: "NORMAL",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "شغل منقضی شد" : "Job expired",
    resolveDescription: (m, locale) => {
      const job = str(m, "jobTitle", "Job");
      return locale === "fa" ? `${job} منقضی شد.` : `${job} has expired.`;
    },
    resolveActionUrl: jobActionUrl,
  },
  [NotificationEventName.ORGANIZATION_MEMBER_INVITED]: {
    category: "ORGANIZATION",
    priority: "NORMAL",
    mandatory: true,
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "دعوت به سازمان" : "Organization invitation",
    resolveDescription: (m, locale) => {
      const org = str(m, "organizationName", "organization");
      return locale === "fa"
        ? `به ${org} دعوت شدید.`
        : `You were invited to ${org}.`;
    },
    resolveActionUrl: () => "/settings/profile",
  },
  [NotificationEventName.ORGANIZATION_MEMBER_JOINED]: {
    category: "ORGANIZATION",
    priority: "NORMAL",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "عضو جدید پیوست" : "Member joined",
    resolveDescription: (m, locale) => {
      const email = str(m, "memberEmail", "A member");
      return locale === "fa"
        ? `${email} به سازمان پیوست.`
        : `${email} joined the organization.`;
    },
    resolveActionUrl: () => "/settings/members",
  },
  [NotificationEventName.MEMBER_ROLE_CHANGED]: {
    category: "ORGANIZATION",
    priority: "NORMAL",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "نقش شما تغییر کرد" : "Your role changed",
    resolveDescription: (m, locale) => {
      const role = str(m, "role", "updated");
      return locale === "fa"
        ? `نقش شما به ${role} تغییر کرد.`
        : `Your role was changed to ${role}.`;
    },
    resolveActionUrl: () => "/settings/profile",
  },
  [NotificationEventName.MEMBER_DEPARTMENT_CHANGED]: {
    category: "ORGANIZATION",
    priority: "NORMAL",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "دپارتمان شما تغییر کرد" : "Your department changed",
    resolveDescription: (m, locale) => {
      const department = str(m, "departmentName", "updated");
      return locale === "fa"
        ? `دپارتمان شما به ${department} تغییر کرد.`
        : `Your department was changed to ${department}.`;
    },
    resolveActionUrl: () => "/settings/profile",
  },
  [NotificationEventName.DEPARTMENT_CREATED]: {
    category: "ORGANIZATION",
    priority: "LOW",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "دپارتمان جدید" : "Department created",
    resolveDescription: (m, locale) => {
      const name = str(m, "departmentName", "Department");
      return locale === "fa" ? `${name} ایجاد شد.` : `${name} was created.`;
    },
    resolveActionUrl: () => "/settings/members",
  },
  [NotificationEventName.AI_RESUME_ANALYSIS_COMPLETED]: {
    category: "AI",
    priority: "NORMAL",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "تحلیل رزومه آماده شد" : "Resume analysis ready",
    resolveDescription: (m, locale) => {
      const name = str(m, "candidateName", "Candidate");
      return locale === "fa"
        ? `تحلیل هوش مصنوعی برای ${name} آماده است.`
        : `AI analysis for ${name} is ready.`;
    },
    resolveActionUrl: candidateActionUrl,
  },
  [NotificationEventName.AI_JOB_GENERATED]: {
    category: "AI",
    priority: "LOW",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "محتوای شغل تولید شد" : "Job content generated",
    resolveDescription: (_m, locale) =>
      locale === "fa"
        ? "محتوای شغل با هوش مصنوعی تولید شد."
        : "Job content was generated with AI.",
    resolveActionUrl: jobActionUrl,
  },
  [NotificationEventName.AI_INTERVIEW_QUESTIONS_GENERATED]: {
    category: "AI",
    priority: "LOW",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "سؤالات مصاحبه آماده شد" : "Interview questions ready",
    resolveDescription: (m, locale) => {
      const interview = str(m, "interviewName", "Interview");
      return locale === "fa"
        ? `سؤالات ${interview} آماده است.`
        : `Questions for ${interview} are ready.`;
    },
    resolveActionUrl: interviewActionUrl,
  },
  [NotificationEventName.AI_INTERVIEW_SUMMARY_GENERATED]: {
    category: "AI",
    priority: "NORMAL",
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "خلاصه مصاحبه آماده شد" : "Interview summary ready",
    resolveDescription: (m, locale) => {
      const name = str(m, "candidateName", "Candidate");
      return locale === "fa"
        ? `خلاصه مصاحبه برای ${name} آماده است.`
        : `Interview summary for ${name} is ready.`;
    },
    resolveActionUrl: interviewActionUrl,
  },
  [NotificationEventName.SYSTEM_SECURITY_ALERT]: {
    category: "SYSTEM",
    priority: "CRITICAL",
    mandatory: true,
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "هشدار امنیتی" : "Security alert",
    resolveDescription: (m, locale) =>
      str(
        m,
        "message",
        locale === "fa" ? "یک هشدار امنیتی ثبت شد." : "A security alert was raised.",
      ),
    resolveActionUrl: () => "/settings/profile",
  },
  [NotificationEventName.SYSTEM_MAINTENANCE]: {
    category: "SYSTEM",
    priority: "HIGH",
    mandatory: true,
    resolveTitle: (_m, locale) =>
      locale === "fa" ? "اطلاع نگهداری سیستم" : "System maintenance",
    resolveDescription: (m, locale) =>
      str(
        m,
        "message",
        locale === "fa"
          ? "نگهداری برنامه‌ریزی‌شده سیستم."
          : "Scheduled system maintenance.",
      ),
  },
};
