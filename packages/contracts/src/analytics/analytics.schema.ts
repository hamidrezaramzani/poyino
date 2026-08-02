import { z } from "zod";
import { DashboardCandidateStatusSchema } from "../dashboard/dashboard.schema";

export const AnalyticsDateRangeSchema = z.enum([
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "LAST_90_DAYS",
  "LAST_YEAR",
  "CUSTOM",
]);

export type AnalyticsDateRange = z.infer<typeof AnalyticsDateRangeSchema>;

export const AnalyticsQuerySchema = z.object({
  range: AnalyticsDateRangeSchema.default("LAST_30_DAYS"),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  jobId: z.string().uuid().optional(),
});

export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;

export const AnalyticsDashboardSchema = z.object({
  totalJobs: z.number().int().nonnegative(),
  activeJobs: z.number().int().nonnegative(),
  totalApplications: z.number().int().nonnegative(),
  totalCandidates: z.number().int().nonnegative(),
  interviewsScheduled: z.number().int().nonnegative(),
  hiredCandidates: z.number().int().nonnegative(),
  rejectedCandidates: z.number().int().nonnegative(),
  averageTimeToHireDays: z.number().nonnegative().nullable(),
});

export type AnalyticsDashboard = z.infer<typeof AnalyticsDashboardSchema>;

export const AnalyticsDashboardSuccessSchema = z.object({
  success: z.literal(true),
  dashboard: AnalyticsDashboardSchema,
  statusDistribution: z.array(
    z.object({
      status: DashboardCandidateStatusSchema,
      count: z.number().int().nonnegative(),
    }),
  ),
});

export type AnalyticsDashboardSuccess = z.infer<
  typeof AnalyticsDashboardSuccessSchema
>;

export const FunnelStageSchema = z.object({
  stage: z.enum([
    "APPLICATIONS",
    "UNDER_REVIEW",
    "INTERVIEW_SCHEDULED",
    "INTERVIEW_COMPLETED",
    "HIRED",
  ]),
  count: z.number().int().nonnegative(),
  percentage: z.number().min(0).max(100),
});

export type FunnelStage = z.infer<typeof FunnelStageSchema>;

export const AnalyticsFunnelSuccessSchema = z.object({
  success: z.literal(true),
  funnel: z.array(FunnelStageSchema),
});

export type AnalyticsFunnelSuccess = z.infer<
  typeof AnalyticsFunnelSuccessSchema
>;

export const JobPerformanceItemSchema = z.object({
  jobId: z.string().uuid(),
  title: z.string(),
  applications: z.number().int().nonnegative(),
  interviews: z.number().int().nonnegative(),
  hires: z.number().int().nonnegative(),
  hireRate: z.number().min(0).max(100),
});

export type JobPerformanceItem = z.infer<typeof JobPerformanceItemSchema>;

export const AnalyticsJobsSuccessSchema = z.object({
  success: z.literal(true),
  jobs: z.array(JobPerformanceItemSchema),
});

export type AnalyticsJobsSuccess = z.infer<typeof AnalyticsJobsSuccessSchema>;

export const TrendPointSchema = z.object({
  date: z.string(),
  count: z.number().int().nonnegative(),
});

export type TrendPoint = z.infer<typeof TrendPointSchema>;

export const AnalyticsTrendsSuccessSchema = z.object({
  success: z.literal(true),
  trends: z.array(TrendPointSchema),
});

export type AnalyticsTrendsSuccess = z.infer<
  typeof AnalyticsTrendsSuccessSchema
>;

export const AnalyticsErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type AnalyticsErrorCode =
  (typeof AnalyticsErrorCode)[keyof typeof AnalyticsErrorCode];
