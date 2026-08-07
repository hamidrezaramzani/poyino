import { z } from "zod";

/** Active product-validation survey identity (A/B or new surveys use new keys). */
export const BETA_FEEDBACK_SURVEY_KEY = "product-validation";
export const BETA_FEEDBACK_SURVEY_VERSION = "v1";

/** Organizations may update an existing response; new distinct submissions are blocked within this window. */
export const BETA_FEEDBACK_COOLDOWN_DAYS = 30;

/** Org must be at least this old (unless it already has jobs/candidates). */
export const BETA_FEEDBACK_MIN_ORG_AGE_DAYS = 7;

export const BetaFeedbackTimeReductionSchema = z.enum([
  "YES",
  "SOMEWHAT",
  "NO",
]);

export type BetaFeedbackTimeReduction = z.infer<
  typeof BetaFeedbackTimeReductionSchema
>;

export const BetaFeedbackTimeReduction = BetaFeedbackTimeReductionSchema.enum;

export const BetaFeedbackValuableFeatureSchema = z.enum([
  "AI_JOB_CREATION",
  "RESUME_ANALYSIS",
  "CANDIDATE_RANKING",
  "INTERVIEW_MANAGEMENT",
  "ORGANIZATION_MANAGEMENT",
  "OTHER",
]);

export type BetaFeedbackValuableFeature = z.infer<
  typeof BetaFeedbackValuableFeatureSchema
>;

export const BetaFeedbackValuableFeature =
  BetaFeedbackValuableFeatureSchema.enum;

export const BetaFeedbackAiHelpSchema = z.enum([
  "ALWAYS",
  "SOMETIMES",
  "RARELY",
  "NEVER",
]);

export type BetaFeedbackAiHelp = z.infer<typeof BetaFeedbackAiHelpSchema>;

export const BetaFeedbackAiHelp = BetaFeedbackAiHelpSchema.enum;

export const BetaFeedbackWillingnessToPaySchema = z.enum([
  "DEFINITELY",
  "PROBABLY",
  "MAYBE",
  "NO",
]);

export type BetaFeedbackWillingnessToPay = z.infer<
  typeof BetaFeedbackWillingnessToPaySchema
>;

export const BetaFeedbackWillingnessToPay =
  BetaFeedbackWillingnessToPaySchema.enum;

/** Versioned answer payload — keep additive when evolving surveys. */
export const BetaFeedbackAnswersV1Schema = z.object({
  satisfaction: z.number().int().min(1).max(10),
  timeReduction: BetaFeedbackTimeReductionSchema,
  mostValuableFeature: BetaFeedbackValuableFeatureSchema,
  needsImprovement: z.string().trim().min(1).max(2_000),
  aiRecommendationsHelp: BetaFeedbackAiHelpSchema,
  confusingAspects: z.string().trim().max(2_000).default(""),
  missingFeature: z.string().trim().max(2_000).default(""),
  disappointmentIfGone: z.number().int().min(1).max(10),
  willingnessToPay: BetaFeedbackWillingnessToPaySchema,
  additionalComments: z.string().trim().max(5_000).optional().default(""),
});

export type BetaFeedbackAnswersV1 = z.infer<typeof BetaFeedbackAnswersV1Schema>;

export const SubmitBetaFeedbackSchema = z.object({
  surveyKey: z.string().trim().min(1).max(64).default(BETA_FEEDBACK_SURVEY_KEY),
  surveyVersion: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .default(BETA_FEEDBACK_SURVEY_VERSION),
  answers: BetaFeedbackAnswersV1Schema,
});

export type SubmitBetaFeedbackInput = z.infer<typeof SubmitBetaFeedbackSchema>;

export const BetaFeedbackResponseSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  organizationName: z.string().optional(),
  submittedByUserId: z.string().uuid(),
  submittedByEmail: z.string().optional(),
  surveyKey: z.string(),
  surveyVersion: z.string(),
  productVersion: z.string().nullable(),
  answers: BetaFeedbackAnswersV1Schema,
  submittedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type BetaFeedbackResponse = z.infer<typeof BetaFeedbackResponseSchema>;

export const BetaFeedbackEligibilitySchema = z.object({
  eligible: z.boolean(),
  reasons: z.array(
    z.enum(["ORG_AGE", "HAS_JOBS", "HAS_CANDIDATES", "NOT_ELIGIBLE"]),
  ),
  hasSubmission: z.boolean(),
  canSubmit: z.boolean(),
  canUpdate: z.boolean(),
  nextSubmitAt: z.string().datetime().nullable(),
  submission: BetaFeedbackResponseSchema.nullable(),
});

export type BetaFeedbackEligibility = z.infer<
  typeof BetaFeedbackEligibilitySchema
>;

export const BetaFeedbackEligibilitySuccessSchema = z.object({
  success: z.literal(true),
  eligibility: BetaFeedbackEligibilitySchema,
});

export type BetaFeedbackEligibilitySuccess = z.infer<
  typeof BetaFeedbackEligibilitySuccessSchema
>;

export const SubmitBetaFeedbackSuccessSchema = z.object({
  success: z.literal(true),
  response: BetaFeedbackResponseSchema,
  updated: z.boolean(),
});

export type SubmitBetaFeedbackSuccess = z.infer<
  typeof SubmitBetaFeedbackSuccessSchema
>;

export const ListBetaFeedbackQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  surveyKey: z.string().trim().max(64).optional(),
  surveyVersion: z.string().trim().max(32).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListBetaFeedbackQuery = z.infer<typeof ListBetaFeedbackQuerySchema>;

export const ListBetaFeedbackSuccessSchema = z.object({
  success: z.literal(true),
  responses: z.array(BetaFeedbackResponseSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
});

export type ListBetaFeedbackSuccess = z.infer<
  typeof ListBetaFeedbackSuccessSchema
>;

export const GetBetaFeedbackSuccessSchema = z.object({
  success: z.literal(true),
  response: BetaFeedbackResponseSchema,
});

export type GetBetaFeedbackSuccess = z.infer<
  typeof GetBetaFeedbackSuccessSchema
>;

export const BetaFeedbackAnalyticsSchema = z.object({
  totalResponses: z.number().int().nonnegative(),
  eligibleOrganizationsEstimate: z.number().int().nonnegative().nullable(),
  completionRate: z.number().min(0).max(1).nullable(),
  averageSatisfaction: z.number().nullable(),
  averageDisappointmentIfGone: z.number().nullable(),
  willingnessToPayDistribution: z.record(z.string(), z.number().int()),
  timeReductionDistribution: z.record(z.string(), z.number().int()),
  mostValuableFeatureDistribution: z.record(z.string(), z.number().int()),
  aiHelpDistribution: z.record(z.string(), z.number().int()),
  topMissingFeatures: z.array(
    z.object({ text: z.string(), count: z.number().int() }),
  ),
  topImprovementThemes: z.array(
    z.object({ text: z.string(), count: z.number().int() }),
  ),
  commonKeywords: z.array(
    z.object({ keyword: z.string(), count: z.number().int() }),
  ),
  recentResponses: z.array(BetaFeedbackResponseSchema),
});

export type BetaFeedbackAnalytics = z.infer<typeof BetaFeedbackAnalyticsSchema>;

export const BetaFeedbackAnalyticsSuccessSchema = z.object({
  success: z.literal(true),
  analytics: BetaFeedbackAnalyticsSchema,
});

export type BetaFeedbackAnalyticsSuccess = z.infer<
  typeof BetaFeedbackAnalyticsSuccessSchema
>;

export const BetaFeedbackErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  NOT_ELIGIBLE: "NOT_ELIGIBLE",
  COOLDOWN_ACTIVE: "COOLDOWN_ACTIVE",
  INVALID_SURVEY: "INVALID_SURVEY",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type BetaFeedbackErrorCode =
  (typeof BetaFeedbackErrorCode)[keyof typeof BetaFeedbackErrorCode];
