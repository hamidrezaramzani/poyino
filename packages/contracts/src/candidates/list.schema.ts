import { z } from "zod";
import { DashboardCandidateStatusSchema } from "../dashboard/dashboard.schema";

export const CandidateExperienceLevelSchema = z.enum([
  "JUNIOR",
  "MID",
  "SENIOR",
]);

export type CandidateExperienceLevel = z.infer<
  typeof CandidateExperienceLevelSchema
>;

export const ListCandidatesSortBySchema = z.enum([
  "aiScore",
  "appliedAt",
  "fullName",
]);

export type ListCandidatesSortBy = z.infer<typeof ListCandidatesSortBySchema>;

export const ListCandidatesSortOrderSchema = z.enum(["asc", "desc"]);

export type ListCandidatesSortOrder = z.infer<
  typeof ListCandidatesSortOrderSchema
>;

export const ListCandidatesDateRangeSchema = z.enum([
  "TODAY",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "CUSTOM",
]);

export type ListCandidatesDateRange = z.infer<
  typeof ListCandidatesDateRangeSchema
>;

export const ListCandidatesQuerySchema = z.object({
  search: z.string().trim().max(120).optional().default(""),
  status: DashboardCandidateStatusSchema.optional(),
  experienceLevel: CandidateExperienceLevelSchema.optional(),
  education: z.string().trim().max(200).optional(),
  dateRange: ListCandidatesDateRangeSchema.optional(),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  sortBy: ListCandidatesSortBySchema.default("aiScore"),
  sortOrder: ListCandidatesSortOrderSchema.default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .refine((value) => [10, 20, 50, 100].includes(value), {
      message: "PAGE_SIZE_INVALID",
    })
    .default(20),
});

export type ListCandidatesQuery = z.infer<typeof ListCandidatesQuerySchema>;

export const CandidateListItemSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  currentPosition: z.string().nullable(),
  aiScore: z.number().int().min(0).max(100).nullable(),
  yearsExperience: z.number().int().min(0).max(60).nullable(),
  skills: z.array(z.string()),
  status: DashboardCandidateStatusSchema,
  appliedAt: z.string().datetime(),
});

export type CandidateListItem = z.infer<typeof CandidateListItemSchema>;

export const CandidateListStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  reviewing: z.number().int().nonnegative(),
  interviewScheduled: z.number().int().nonnegative(),
  hired: z.number().int().nonnegative(),
  rejected: z.number().int().nonnegative(),
});

export type CandidateListStats = z.infer<typeof CandidateListStatsSchema>;

export const ListCandidatesPaginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type ListCandidatesPagination = z.infer<
  typeof ListCandidatesPaginationSchema
>;

export const ListCandidatesSuccessSchema = z.object({
  success: z.literal(true),
  job: z.object({
    id: z.string().uuid(),
    title: z.string(),
    updatedAt: z.string().datetime(),
  }),
  items: z.array(CandidateListItemSchema),
  stats: CandidateListStatsSchema,
  pagination: ListCandidatesPaginationSchema,
  sortBy: ListCandidatesSortBySchema,
  sortOrder: ListCandidatesSortOrderSchema,
});

export type ListCandidatesSuccess = z.infer<typeof ListCandidatesSuccessSchema>;

export const ListOrgCandidatesQuerySchema = z.object({
  search: z.string().trim().max(120).optional().default(""),
  status: DashboardCandidateStatusSchema.optional(),
  sortBy: ListCandidatesSortBySchema.default("appliedAt"),
  sortOrder: ListCandidatesSortOrderSchema.default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .refine((value) => [10, 20, 50, 100].includes(value), {
      message: "PAGE_SIZE_INVALID",
    })
    .default(20),
});

export type ListOrgCandidatesQuery = z.infer<
  typeof ListOrgCandidatesQuerySchema
>;

export const OrgCandidateListItemSchema = CandidateListItemSchema.extend({
  jobId: z.string().uuid(),
  jobTitle: z.string(),
});

export type OrgCandidateListItem = z.infer<typeof OrgCandidateListItemSchema>;

export const ListOrgCandidatesSuccessSchema = z.object({
  success: z.literal(true),
  items: z.array(OrgCandidateListItemSchema),
  pagination: ListCandidatesPaginationSchema,
  sortBy: ListCandidatesSortBySchema,
  sortOrder: ListCandidatesSortOrderSchema,
});

export type ListOrgCandidatesSuccess = z.infer<
  typeof ListOrgCandidatesSuccessSchema
>;

export const CandidateErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  JOB_NOT_FOUND: "JOB_NOT_FOUND",
  CANDIDATE_NOT_FOUND: "CANDIDATE_NOT_FOUND",
  NOTE_NOT_FOUND: "NOTE_NOT_FOUND",
  INTERVIEW_NOT_FOUND: "INTERVIEW_NOT_FOUND",
  INTERVIEW_NOT_EDITABLE: "INTERVIEW_NOT_EDITABLE",
  INTERVIEW_NOT_RESPONDABLE: "INTERVIEW_NOT_RESPONDABLE",
  INTERVIEW_IN_PAST: "INTERVIEW_IN_PAST",
  INTERVIEW_PROCESS_NOT_FOUND: "INTERVIEW_PROCESS_NOT_FOUND",
  INTERVIEW_AI_FAILED: "INTERVIEW_AI_FAILED",
  INTERVIEW_SUMMARY_FAILED: "INTERVIEW_SUMMARY_FAILED",
  NO_COMPLETED_INTERVIEWS: "NO_COMPLETED_INTERVIEWS",
  RESUME_NOT_FOUND: "RESUME_NOT_FOUND",
  INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS",
  AI_ANALYSIS_FAILED: "AI_ANALYSIS_FAILED",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type CandidateErrorCode =
  (typeof CandidateErrorCode)[keyof typeof CandidateErrorCode];
