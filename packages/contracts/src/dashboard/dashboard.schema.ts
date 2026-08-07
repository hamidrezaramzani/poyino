import { z } from "zod";

export const DashboardJobStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export type DashboardJobStatus = z.infer<typeof DashboardJobStatusSchema>;

export const DashboardCandidateStatusSchema = z.enum([
  "APPLIED",
  "REVIEWING",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_PASSED",
  "REJECTED",
  "HIRED",
]);

export type DashboardCandidateStatus = z.infer<
  typeof DashboardCandidateStatusSchema
>;

export const DashboardStatisticsSchema = z.object({
  totalJobs: z.number().int().nonnegative(),
  activeJobs: z.number().int().nonnegative(),
  totalCandidates: z.number().int().nonnegative(),
  totalHired: z.number().int().nonnegative(),
});

export type DashboardStatistics = z.infer<typeof DashboardStatisticsSchema>;

export const DashboardRecentJobSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  status: DashboardJobStatusSchema,
  publishedAt: z.string().datetime().nullable(),
  candidateCount: z.number().int().nonnegative(),
});

export type DashboardRecentJob = z.infer<typeof DashboardRecentJobSchema>;

export const DashboardRecentCandidateSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  jobTitle: z.string(),
  jobId: z.string().uuid(),
  aiScore: z.number().int().min(0).max(100).nullable(),
  status: DashboardCandidateStatusSchema,
  submittedAt: z.string().datetime(),
});

export type DashboardRecentCandidate = z.infer<
  typeof DashboardRecentCandidateSchema
>;

export const DashboardAiCreditsSchema = z.object({
  remaining: z.number().int().nonnegative(),
  low: z.boolean(),
  lowThreshold: z.number().int().nonnegative(),
});

export type DashboardAiCredits = z.infer<typeof DashboardAiCreditsSchema>;

export const DashboardSuccessSchema = z.object({
  success: z.literal(true),
  statistics: DashboardStatisticsSchema,
  aiCredits: DashboardAiCreditsSchema,
  recentJobs: z.array(DashboardRecentJobSchema).max(10),
  recentCandidates: z.array(DashboardRecentCandidateSchema).max(10),
});

export type DashboardSuccess = z.infer<typeof DashboardSuccessSchema>;

export const DashboardErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type DashboardError = z.infer<typeof DashboardErrorSchema>;

export const DashboardErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type DashboardErrorCode =
  (typeof DashboardErrorCode)[keyof typeof DashboardErrorCode];
