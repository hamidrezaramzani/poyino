import type { NotificationItem } from "@poyino/contracts";
import type { Translation } from "../../../shared/i18n/translations";

type NotificationEventCopy = {
  title: string;
  description: string;
};

function metaString(
  metadata: Record<string, unknown> | null | undefined,
  key: string,
  fallback = "",
) {
  const value = metadata?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function interpolate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

function resolveStatusLabel(t: Translation, status: string) {
  const labels = t.dashboard.candidateStatus as Record<string, string>;
  return labels[status] ?? status;
}

function resolveRoleLabel(t: Translation, role: string) {
  const labels = t.settings.members.roles as Record<string, string>;
  return labels[role] ?? role;
}

export function resolveNotificationCopy(
  notification: Pick<
    NotificationItem,
    "eventName" | "title" | "description" | "metadata"
  >,
  t: Translation,
): NotificationEventCopy {
  const metadata =
    notification.metadata && typeof notification.metadata === "object"
      ? notification.metadata
      : null;
  const eventCopy = t.notifications.events[notification.eventName];

  if (!eventCopy) {
    return {
      title: notification.title,
      description: notification.description,
    };
  }

  const values: Record<string, string> = {
    candidateName: metaString(metadata, "candidateName", t.notifications.fallbacks.candidate),
    jobTitle: metaString(metadata, "jobTitle", t.notifications.fallbacks.job),
    interviewName: metaString(
      metadata,
      "interviewName",
      t.notifications.fallbacks.interview,
    ),
    organizationName: metaString(
      metadata,
      "organizationName",
      t.notifications.fallbacks.organization,
    ),
    memberEmail: metaString(
      metadata,
      "memberEmail",
      t.notifications.fallbacks.member,
    ),
    departmentName: metaString(
      metadata,
      "departmentName",
      t.notifications.fallbacks.department,
    ),
    status: resolveStatusLabel(t, metaString(metadata, "status", "")),
    role: resolveRoleLabel(t, metaString(metadata, "role", "")),
    message:
      metaString(metadata, "message", "") ||
      notification.description ||
      eventCopy.description,
    matchScore: metaString(metadata, "matchScore", ""),
  };

  const description = interpolate(eventCopy.description, values).trim();

  return {
    title: eventCopy.title,
    description: description || notification.description,
  };
}
