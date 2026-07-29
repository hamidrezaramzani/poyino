import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().min(1, "EMAIL_REQUIRED").email("EMAIL_INVALID"),
  password: z
    .string()
    .min(1, "PASSWORD_REQUIRED")
    .min(6, "PASSWORD_TOO_SHORT"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const LoginSuccessSchema = z.object({
  success: z.literal(true),
});

export type LoginSuccess = z.infer<typeof LoginSuccessSchema>;

export const LoginErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type LoginError = z.infer<typeof LoginErrorSchema>;

export const LoginErrorCode = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type LoginErrorCode =
  (typeof LoginErrorCode)[keyof typeof LoginErrorCode];
