import { z } from "zod";

/** Central cost table for all AI features. Prefer this over hardcoding. */
export const AI_ACTION_COSTS = {
  GENERATE_JOB: 5,
  RESUME_ANALYSIS: 2,
  RESUME_AUTOFILL: 1,
  CANDIDATE_RANKING: 2,
  INTERVIEW_QUESTIONS: 2,
  INTERVIEW_SUMMARY: 2,
} as const;

export type AiCreditFeature = keyof typeof AI_ACTION_COSTS;

export const AiCreditFeatureSchema = z.enum([
  "GENERATE_JOB",
  "RESUME_ANALYSIS",
  "RESUME_AUTOFILL",
  "CANDIDATE_RANKING",
  "INTERVIEW_QUESTIONS",
  "INTERVIEW_SUMMARY",
]);

export const AI_CREDITS_INITIAL_GRANT = 50;

/** Remaining balance at or below this value is treated as "low". */
export const AI_CREDITS_LOW_THRESHOLD = 5;

export const AiCreditTransactionTypeSchema = z.enum([
  "GRANT",
  "CONSUME",
  "REFUND",
  "ADJUSTMENT",
  "BONUS",
  "PURCHASE",
  "EXPIRATION",
]);

export type AiCreditTransactionType = z.infer<
  typeof AiCreditTransactionTypeSchema
>;

export function getAiActionCost(feature: AiCreditFeature): number {
  return AI_ACTION_COSTS[feature];
}

export const AiCreditsBalanceSchema = z.object({
  remaining: z.number().int().nonnegative(),
  low: z.boolean(),
  lowThreshold: z.number().int().nonnegative(),
  initialGrant: z.number().int().nonnegative(),
});

export type AiCreditsBalance = z.infer<typeof AiCreditsBalanceSchema>;

export const GetAiCreditsSuccessSchema = z.object({
  success: z.literal(true),
  credits: AiCreditsBalanceSchema,
});

export type GetAiCreditsSuccess = z.infer<typeof GetAiCreditsSuccessSchema>;

export const AiCreditUsageItemSchema = z.object({
  id: z.string().uuid(),
  type: AiCreditTransactionTypeSchema,
  feature: AiCreditFeatureSchema.nullable(),
  amount: z.number().int().positive(),
  balanceAfter: z.number().int().nonnegative(),
  userId: z.string().uuid().nullable(),
  userEmail: z.string().email().nullable(),
  createdAt: z.string().datetime(),
});

export type AiCreditUsageItem = z.infer<typeof AiCreditUsageItemSchema>;

export const GetAiCreditHistoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type GetAiCreditHistoryQuery = z.infer<
  typeof GetAiCreditHistoryQuerySchema
>;

export const GetAiCreditHistorySuccessSchema = z.object({
  success: z.literal(true),
  credits: AiCreditsBalanceSchema,
  items: z.array(AiCreditUsageItemSchema),
  pagination: z.object({
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export type GetAiCreditHistorySuccess = z.infer<
  typeof GetAiCreditHistorySuccessSchema
>;

export const AiCreditBreakdownItemSchema = z.object({
  feature: AiCreditFeatureSchema,
  creditsUsed: z.number().int().nonnegative(),
  transactionCount: z.number().int().nonnegative(),
});

export type AiCreditBreakdownItem = z.infer<typeof AiCreditBreakdownItemSchema>;

export const GetAiCreditBreakdownSuccessSchema = z.object({
  success: z.literal(true),
  credits: AiCreditsBalanceSchema,
  breakdown: z.array(AiCreditBreakdownItemSchema),
});

export type GetAiCreditBreakdownSuccess = z.infer<
  typeof GetAiCreditBreakdownSuccessSchema
>;

export const AiCreditsErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS",
  CREDITS_NOT_INITIALIZED: "CREDITS_NOT_INITIALIZED",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type AiCreditsErrorCode =
  (typeof AiCreditsErrorCode)[keyof typeof AiCreditsErrorCode];
