import type { NotificationEventName } from "@poyino/contracts";

export type DomainNotificationEvent = {
  eventId: string;
  event: NotificationEventName | string;
  organizationId: string;
  triggeredBy: string | null;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  targetUserIds?: string[];
  applicationId?: string | null;
  includeCandidate?: boolean;
  metadata?: Record<string, unknown>;
};
