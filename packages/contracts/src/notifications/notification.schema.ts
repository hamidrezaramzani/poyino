import { z } from "zod";

export const NotificationCategorySchema = z.enum([
  "CANDIDATES",
  "JOBS",
  "INTERVIEWS",
  "ORGANIZATION",
  "SYSTEM",
  "AI",
]);

export type NotificationCategory = z.infer<typeof NotificationCategorySchema>;

export const NotificationPrioritySchema = z.enum([
  "LOW",
  "NORMAL",
  "HIGH",
  "CRITICAL",
]);

export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;

export const NotificationReadFilterSchema = z.enum(["all", "unread", "read"]);

export type NotificationReadFilter = z.infer<
  typeof NotificationReadFilterSchema
>;

export const NotificationItemSchema = z.object({
  id: z.string().uuid(),
  eventName: z.string(),
  category: NotificationCategorySchema,
  title: z.string(),
  description: z.string(),
  actionUrl: z.string().nullable(),
  priority: NotificationPrioritySchema,
  isRead: z.boolean(),
  readAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type NotificationItem = z.infer<typeof NotificationItemSchema>;

export const ListNotificationsQuerySchema = z.object({
  filter: NotificationReadFilterSchema.default("all"),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ListNotificationsQuery = z.infer<
  typeof ListNotificationsQuerySchema
>;

export const ListNotificationsSuccessSchema = z.object({
  success: z.literal(true),
  notifications: z.array(NotificationItemSchema),
  unreadCount: z.number().int().nonnegative(),
  nextCursor: z.string().uuid().nullable(),
});

export type ListNotificationsSuccess = z.infer<
  typeof ListNotificationsSuccessSchema
>;

export const UnreadCountSuccessSchema = z.object({
  success: z.literal(true),
  unreadCount: z.number().int().nonnegative(),
});

export type UnreadCountSuccess = z.infer<typeof UnreadCountSuccessSchema>;

export const MarkNotificationReadSuccessSchema = z.object({
  success: z.literal(true),
  notification: NotificationItemSchema,
});

export type MarkNotificationReadSuccess = z.infer<
  typeof MarkNotificationReadSuccessSchema
>;

export const MarkAllNotificationsReadSuccessSchema = z.object({
  success: z.literal(true),
  updatedCount: z.number().int().nonnegative(),
});

export type MarkAllNotificationsReadSuccess = z.infer<
  typeof MarkAllNotificationsReadSuccessSchema
>;

export const DeleteNotificationSuccessSchema = z.object({
  success: z.literal(true),
});

export type DeleteNotificationSuccess = z.infer<
  typeof DeleteNotificationSuccessSchema
>;

export const NotificationPreferenceItemSchema = z.object({
  category: NotificationCategorySchema,
  inAppEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  mandatory: z.boolean(),
});

export type NotificationPreferenceItem = z.infer<
  typeof NotificationPreferenceItemSchema
>;

export const NotificationPreferencesSuccessSchema = z.object({
  success: z.literal(true),
  preferences: z.array(NotificationPreferenceItemSchema),
});

export type NotificationPreferencesSuccess = z.infer<
  typeof NotificationPreferencesSuccessSchema
>;

export const UpdateNotificationPreferencesSchema = z.object({
  preferences: z
    .array(
      z.object({
        category: NotificationCategorySchema,
        inAppEnabled: z.boolean(),
        emailEnabled: z.boolean(),
      }),
    )
    .min(1),
});

export type UpdateNotificationPreferencesInput = z.infer<
  typeof UpdateNotificationPreferencesSchema
>;

export const TrackingNotificationItemSchema = NotificationItemSchema;

export type TrackingNotificationItem = z.infer<
  typeof TrackingNotificationItemSchema
>;

export const ListTrackingNotificationsSuccessSchema = z.object({
  success: z.literal(true),
  notifications: z.array(TrackingNotificationItemSchema),
});

export type ListTrackingNotificationsSuccess = z.infer<
  typeof ListTrackingNotificationsSuccessSchema
>;

export const NotificationRealtimePayloadSchema = z.object({
  notification: NotificationItemSchema,
  unreadCount: z.number().int().nonnegative().optional(),
});

export type NotificationRealtimePayload = z.infer<
  typeof NotificationRealtimePayloadSchema
>;
