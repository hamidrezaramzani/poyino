import { z } from "zod";

export const RegisterSchema = z
  .object({
    organizationName: z
      .string()
      .trim()
      .min(1, "ORGANIZATION_NAME_REQUIRED")
      .min(3, "ORGANIZATION_NAME_TOO_SHORT")
      .max(80, "ORGANIZATION_NAME_TOO_LONG"),
    email: z
      .string()
      .trim()
      .min(1, "EMAIL_REQUIRED")
      .email("EMAIL_INVALID"),
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

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const RegisterSuccessSchema = z.object({
  success: z.literal(true),
});

export type RegisterSuccess = z.infer<typeof RegisterSuccessSchema>;

export const RegisterErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type RegisterError = z.infer<typeof RegisterErrorSchema>;

export const RegisterErrorCode = {
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type RegisterErrorCode =
  (typeof RegisterErrorCode)[keyof typeof RegisterErrorCode];
