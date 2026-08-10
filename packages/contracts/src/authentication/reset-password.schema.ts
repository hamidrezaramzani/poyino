import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, "TOKEN_REQUIRED"),
    password: z
      .string()
      .min(1, "PASSWORD_REQUIRED")
      .min(6, "PASSWORD_TOO_SHORT"),
    confirmPassword: z.string().min(1, "CONFIRM_PASSWORD_REQUIRED"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "PASSWORDS_DO_NOT_MATCH",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const ValidateResetTokenSchema = z.object({
  token: z.string().trim().min(1, "TOKEN_REQUIRED"),
});

export type ValidateResetTokenInput = z.infer<typeof ValidateResetTokenSchema>;

export const ResetPasswordSuccessSchema = z.object({
  success: z.literal(true),
});

export type ResetPasswordSuccess = z.infer<typeof ResetPasswordSuccessSchema>;

export const ResetPasswordErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type ResetPasswordError = z.infer<typeof ResetPasswordErrorSchema>;

export const ResetPasswordErrorCode = {
  INVALID_TOKEN: "INVALID_TOKEN",
  EXPIRED_TOKEN: "EXPIRED_TOKEN",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
  FEATURE_DISABLED: "FEATURE_DISABLED",
} as const;

export type ResetPasswordErrorCode =
  (typeof ResetPasswordErrorCode)[keyof typeof ResetPasswordErrorCode];
