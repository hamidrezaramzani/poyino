import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "CURRENT_PASSWORD_REQUIRED"),
    newPassword: z
      .string()
      .min(1, "PASSWORD_REQUIRED")
      .min(6, "PASSWORD_TOO_SHORT"),
    confirmPassword: z.string().min(1, "CONFIRM_PASSWORD_REQUIRED"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "PASSWORDS_DO_NOT_MATCH",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "SAME_PASSWORD",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export const ChangePasswordSuccessSchema = z.object({
  success: z.literal(true),
});

export type ChangePasswordSuccess = z.infer<typeof ChangePasswordSuccessSchema>;
