export type MappedNotification = {
  id: string;
  eventName: string;
  category:
    | "CANDIDATES"
    | "JOBS"
    | "INTERVIEWS"
    | "ORGANIZATION"
    | "SYSTEM"
    | "AI";
  title: string;
  description: string;
  actionUrl: string | null;
  priority: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  metadata: Record<string, unknown> | null;
};

export function mapNotification(notification: {
  id: string;
  eventName: string;
  category: MappedNotification["category"];
  title: string;
  description: string;
  actionUrl: string | null;
  priority: MappedNotification["priority"];
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
  metadata: unknown;
}): MappedNotification {
  return {
    id: notification.id,
    eventName: notification.eventName,
    category: notification.category,
    title: notification.title,
    description: notification.description,
    actionUrl: notification.actionUrl,
    priority: notification.priority,
    isRead: notification.isRead,
    readAt: notification.readAt?.toISOString() ?? null,
    createdAt: notification.createdAt.toISOString(),
    metadata:
      notification.metadata &&
      typeof notification.metadata === "object" &&
      !Array.isArray(notification.metadata)
        ? (notification.metadata as Record<string, unknown>)
        : null,
  };
}
