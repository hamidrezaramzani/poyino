import type {
  ListNotificationsSuccess,
  ListTrackingNotificationsSuccess,
  MarkAllNotificationsReadSuccess,
  MarkNotificationReadSuccess,
  DeleteNotificationSuccess,
  NotificationPreferencesSuccess,
  UnreadCountSuccess,
  UpdateNotificationPreferencesInput,
  NotificationReadFilter,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

export function listNotifications(params?: {
  filter?: NotificationReadFilter;
  cursor?: string;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params?.filter) search.set("filter", params.filter);
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.limit) search.set("limit", String(params.limit));
  const query = search.toString();
  return apiRequest<ListNotificationsSuccess>(
    `/notifications${query ? `?${query}` : ""}`,
  );
}

export function getUnreadCount() {
  return apiRequest<UnreadCountSuccess>("/notifications/unread-count");
}

export function markNotificationRead(notificationId: string) {
  return apiRequest<MarkNotificationReadSuccess>(
    `/notifications/${notificationId}/read`,
    { method: "PATCH" },
  );
}

export function markAllNotificationsRead() {
  return apiRequest<MarkAllNotificationsReadSuccess>(
    "/notifications/read-all",
    { method: "PATCH" },
  );
}

export function deleteNotification(notificationId: string) {
  return apiRequest<DeleteNotificationSuccess>(
    `/notifications/${notificationId}`,
    { method: "DELETE" },
  );
}

export function getNotificationPreferences() {
  return apiRequest<NotificationPreferencesSuccess>(
    "/notification-preferences",
  );
}

export function updateNotificationPreferences(
  input: UpdateNotificationPreferencesInput,
) {
  return apiRequest<NotificationPreferencesSuccess>(
    "/notification-preferences",
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export function resetNotificationPreferences() {
  return apiRequest<NotificationPreferencesSuccess>(
    "/notification-preferences/reset",
    { method: "POST" },
  );
}

export function listTrackingNotifications(token: string) {
  return apiRequest<ListTrackingNotificationsSuccess>(
    `/public/tracking/${encodeURIComponent(token)}/notifications`,
  );
}
