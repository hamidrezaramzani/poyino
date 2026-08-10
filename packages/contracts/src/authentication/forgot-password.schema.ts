import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "EMAIL_REQUIRED").email("EMAIL_INVALID"),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordSuccessSchema = z.object({
  success: z.literal(true),
});

export type ForgotPasswordSuccess = z.infer<typeof ForgotPasswordSuccessSchema>;

export const ForgotPasswordErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type ForgotPasswordError = z.infer<typeof ForgotPasswordErrorSchema>;

export const ForgotPasswordErrorCode = {
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
  FEATURE_DISABLED: "FEATURE_DISABLED",
} as const;

export type ForgotPasswordErrorCode =
  (typeof ForgotPasswordErrorCode)[keyof typeof ForgotPasswordErrorCode];
