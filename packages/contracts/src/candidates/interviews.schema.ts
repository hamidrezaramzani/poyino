import { z } from "zod";

export const InterviewTypeSchema = z.enum([
  "HR",
  "TECHNICAL",
  "MANAGER",
  "FINAL",
]);

export type InterviewType = z.infer<typeof InterviewTypeSchema>;

export const InterviewStatusSchema = z.enum([
  "SCHEDULED",
  "CANCELLED",
  "COMPLETED",
]);

export type InterviewStatus = z.infer<typeof InterviewStatusSchema>;

export const CreateInterviewSchema = z.object({
  scheduledAt: z.string().datetime({ message: "SCHEDULED_AT_REQUIRED" }),
  type: InterviewTypeSchema,
  location: z
    .string()
    .trim()
    .max(255)
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) return null;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
  meetingUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) return null;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    })
    .refine(
      (value) =>
        value == null ||
        /^https?:\/\/.+/i.test(value),
      { message: "MEETING_URL_INVALID" },
    ),
  notes: z
    .string()
    .trim()
    .max(5000, "NOTES_TOO_LONG")
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) return null;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
});

export type CreateInterviewInput = z.infer<typeof CreateInterviewSchema>;

export const UpdateInterviewSchema = CreateInterviewSchema;

export type UpdateInterviewInput = z.infer<typeof UpdateInterviewSchema>;

export const CompleteInterviewSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(5000, "NOTES_TOO_LONG")
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) return null;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
});

export type CompleteInterviewInput = z.infer<typeof CompleteInterviewSchema>;

export const InterviewSchema = z.object({
  id: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  type: InterviewTypeSchema,
  status: InterviewStatusSchema,
  location: z.string().nullable(),
  meetingUrl: z.string().nullable(),
  notes: z.string().nullable(),
  createdByUserId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Interview = z.infer<typeof InterviewSchema>;

export const InterviewSuccessSchema = z.object({
  success: z.literal(true),
  interview: InterviewSchema,
});

export type InterviewSuccess = z.infer<typeof InterviewSuccessSchema>;

export const ListInterviewsSuccessSchema = z.object({
  success: z.literal(true),
  interviews: z.array(InterviewSchema),
});

export type ListInterviewsSuccess = z.infer<typeof ListInterviewsSuccessSchema>;
