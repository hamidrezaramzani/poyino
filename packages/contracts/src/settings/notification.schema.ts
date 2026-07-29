import { z } from "zod";

export const NotificationSettingsSchema = z.object({
  newCandidateEmail: z.boolean(),
  candidateStatusEmail: z.boolean(),
  interviewReminderEmail: z.boolean(),
  jobExpirationEmail: z.boolean(),
  jobPublishedEmail: z.boolean(),
});

export type NotificationSettingsInput = z.infer<
  typeof NotificationSettingsSchema
>;

export const NotificationSettingsDataSchema = NotificationSettingsSchema;

export type NotificationSettingsData = z.infer<
  typeof NotificationSettingsDataSchema
>;

export const NotificationSettingsSuccessSchema = z.object({
  success: z.literal(true),
  settings: NotificationSettingsDataSchema.optional(),
});

export type NotificationSettingsSuccess = z.infer<
  typeof NotificationSettingsSuccessSchema
>;
