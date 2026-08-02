import { z } from "zod";

export const InterviewTypeSchema = z.enum([
  "HR",
  "TECHNICAL",
  "TEAM_LEAD",
  "MANAGER",
  "FINAL",
  "CUSTOM",
]);

export type InterviewType = z.infer<typeof InterviewTypeSchema>;

export const InterviewStatusSchema = z.enum([
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export type InterviewStatus = z.infer<typeof InterviewStatusSchema>;

export const InterviewProcessStatusSchema = z.enum([
  "WAITING",
  "INTERVIEWING",
  "PASSED",
  "FAILED",
  "HIRED",
]);

export type InterviewProcessStatus = z.infer<
  typeof InterviewProcessStatusSchema
>;

export const InterviewResultSchema = z.enum(["PASSED", "FAILED", "PENDING"]);

export type InterviewResult = z.infer<typeof InterviewResultSchema>;

export const InterviewDecisionSchema = z.enum(["HIRE", "REJECT"]);

export type InterviewDecision = z.infer<typeof InterviewDecisionSchema>;

const optionalTrimmed = (max: number, message?: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) return null;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    });

const optionalMeetingUrl = z
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
  .refine((value) => value == null || /^https?:\/\/.+/i.test(value), {
    message: "MEETING_URL_INVALID",
  });

export const CreateInterviewSchema = z.object({
  name: z.string().trim().min(1, "NAME_REQUIRED").max(120, "NAME_TOO_LONG"),
  scheduledAt: z.string().datetime({ message: "SCHEDULED_AT_REQUIRED" }),
  type: InterviewTypeSchema,
  location: optionalTrimmed(255),
  meetingUrl: optionalMeetingUrl,
  internalNotes: optionalTrimmed(5000, "NOTES_TOO_LONG"),
  candidateNotes: optionalTrimmed(5000, "NOTES_TOO_LONG"),
  recruiterUserId: z.string().uuid().optional().nullable(),
});

export type CreateInterviewInput = z.infer<typeof CreateInterviewSchema>;

export const UpdateInterviewSchema = CreateInterviewSchema;

export type UpdateInterviewInput = z.infer<typeof UpdateInterviewSchema>;

export const CompleteInterviewSchema = z.object({
  result: InterviewResultSchema.optional().nullable(),
  internalNotes: optionalTrimmed(5000, "NOTES_TOO_LONG").optional(),
  candidateNotes: optionalTrimmed(5000, "NOTES_TOO_LONG").optional(),
});

export type CompleteInterviewInput = z.infer<typeof CompleteInterviewSchema>;

export const UpdateInterviewStatusSchema = z.object({
  status: InterviewStatusSchema,
  result: InterviewResultSchema.optional().nullable(),
  internalNotes: optionalTrimmed(5000, "NOTES_TOO_LONG").optional(),
});

export type UpdateInterviewStatusInput = z.infer<
  typeof UpdateInterviewStatusSchema
>;

export const InterviewHiringDecisionSchema = z.object({
  decision: InterviewDecisionSchema,
});

export type InterviewHiringDecisionInput = z.infer<
  typeof InterviewHiringDecisionSchema
>;

export const EvaluationChecklistItemSchema = z.object({
  label: z.string(),
  explanation: z.string(),
});

export type EvaluationChecklistItem = z.infer<
  typeof EvaluationChecklistItemSchema
>;

export const InterviewAiPreparationSchema = z.object({
  executiveSummary: z.string(),
  interviewObjectives: z.array(z.string()),
  technicalQuestions: z.array(z.string()),
  behavioralQuestions: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missingSkills: z.array(z.string()),
  evaluationChecklist: z.array(EvaluationChecklistItemSchema),
});

export type InterviewAiPreparation = z.infer<
  typeof InterviewAiPreparationSchema
>;

export const InterviewAiRequestSchema = z.object({
  interviewId: z.string().uuid(),
  prompt: z.string().trim().max(2000).optional(),
});

export type InterviewAiRequest = z.infer<typeof InterviewAiRequestSchema>;

export const InterviewAiSuccessSchema = z.object({
  success: z.literal(true),
  interviewId: z.string().uuid(),
  preparation: InterviewAiPreparationSchema,
  aiPrompt: z.string().nullable(),
  aiGeneratedAt: z.string().datetime(),
});

export type InterviewAiSuccess = z.infer<typeof InterviewAiSuccessSchema>;

export const InterviewSchema = z.object({
  id: z.string().uuid(),
  processId: z.string().uuid(),
  name: z.string(),
  scheduledAt: z.string().datetime(),
  type: InterviewTypeSchema,
  status: InterviewStatusSchema,
  result: InterviewResultSchema.nullable(),
  location: z.string().nullable(),
  meetingUrl: z.string().nullable(),
  internalNotes: z.string().nullable(),
  candidateNotes: z.string().nullable(),
  recruiterUserId: z.string().uuid().nullable(),
  recruiterEmail: z.string().nullable(),
  createdByUserId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  aiPreparation: InterviewAiPreparationSchema.nullable(),
  aiPrompt: z.string().nullable(),
  aiGeneratedAt: z.string().datetime().nullable(),
});

export type Interview = z.infer<typeof InterviewSchema>;

export const InterviewSummarySchema = z.object({
  executiveSummary: z.string(),
  timelineSummary: z.array(
    z.object({
      interviewName: z.string(),
      interviewType: z.string(),
      summary: z.string(),
    }),
  ),
  consensus: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  risks: z.array(z.string()),
  outstandingQuestions: z.array(z.string()),
  suggestedNextStep: z.string(),
});

export type InterviewSummary = z.infer<typeof InterviewSummarySchema>;

export const InterviewProcessSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  status: InterviewProcessStatusSchema,
  stages: z.array(InterviewSchema),
  aiSummary: InterviewSummarySchema.nullable(),
  aiSummaryGeneratedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type InterviewProcess = z.infer<typeof InterviewProcessSchema>;

export const InterviewSuccessSchema = z.object({
  success: z.literal(true),
  interview: InterviewSchema,
  conflict: z.boolean().optional(),
});

export type InterviewSuccess = z.infer<typeof InterviewSuccessSchema>;

export const ListInterviewsSuccessSchema = z.object({
  success: z.literal(true),
  process: InterviewProcessSchema,
});

export type ListInterviewsSuccess = z.infer<typeof ListInterviewsSuccessSchema>;

export const InterviewProcessSuccessSchema = z.object({
  success: z.literal(true),
  process: InterviewProcessSchema,
});

export type InterviewProcessSuccess = z.infer<
  typeof InterviewProcessSuccessSchema
>;

/** @deprecated Prefer InterviewSchema fields; kept for gradual migration */
export const LegacyInterviewNotesAlias = z.object({
  notes: z.string().nullable().optional(),
});

export const CalendarInterviewEventSchema = z.object({
  id: z.string().uuid(),
  processId: z.string().uuid(),
  applicationId: z.string().uuid(),
  jobId: z.string().uuid(),
  jobTitle: z.string(),
  candidateId: z.string().uuid(),
  candidateName: z.string(),
  name: z.string(),
  type: InterviewTypeSchema,
  status: InterviewStatusSchema,
  result: InterviewResultSchema.nullable(),
  scheduledAt: z.string().datetime(),
  location: z.string().nullable(),
  meetingUrl: z.string().nullable(),
  internalNotes: z.string().nullable(),
  candidateNotes: z.string().nullable(),
  recruiterUserId: z.string().uuid().nullable(),
  recruiterEmail: z.string().nullable(),
  hasConflict: z.boolean(),
});

export type CalendarInterviewEvent = z.infer<
  typeof CalendarInterviewEventSchema
>;

export const CalendarInterviewsQuerySchema = z.object({
  from: z.string().datetime({ message: "FROM_REQUIRED" }),
  to: z.string().datetime({ message: "TO_REQUIRED" }),
  recruiterUserId: z.string().uuid().optional(),
  jobId: z.string().uuid().optional(),
  type: InterviewTypeSchema.optional(),
  status: InterviewStatusSchema.optional(),
});

export type CalendarInterviewsQuery = z.infer<
  typeof CalendarInterviewsQuerySchema
>;

export const CalendarInterviewsSuccessSchema = z.object({
  success: z.literal(true),
  events: z.array(CalendarInterviewEventSchema),
  today: z.array(CalendarInterviewEventSchema),
  upcoming: z.array(CalendarInterviewEventSchema),
});

export type CalendarInterviewsSuccess = z.infer<
  typeof CalendarInterviewsSuccessSchema
>;

export const PublicInterviewSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: InterviewTypeSchema,
  status: InterviewStatusSchema,
  scheduledAt: z.string().datetime(),
  location: z.string().nullable(),
  meetingUrl: z.string().nullable(),
  candidateNotes: z.string().nullable(),
});

export type PublicInterview = z.infer<typeof PublicInterviewSchema>;

export const InterviewSummarySuccessSchema = z.object({
  success: z.literal(true),
  summary: InterviewSummarySchema,
  completedInterviewCount: z.number().int().nonnegative(),
  aiSummaryGeneratedAt: z.string().datetime(),
});

export type InterviewSummarySuccess = z.infer<
  typeof InterviewSummarySuccessSchema
>;
