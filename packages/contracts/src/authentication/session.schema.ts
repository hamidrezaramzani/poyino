import { z } from "zod";
import { OrganizationRoleSchema } from "../organization/permissions";

export const SessionUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: OrganizationRoleSchema,
  departmentId: z.string().uuid(),
  organization: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
});

export type SessionUser = z.infer<typeof SessionUserSchema>;

export const SessionMeSuccessSchema = z.object({
  success: z.literal(true),
  user: SessionUserSchema,
});

export type SessionMeSuccess = z.infer<typeof SessionMeSuccessSchema>;

export const SessionMeErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type SessionMeError = z.infer<typeof SessionMeErrorSchema>;

export const SessionErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type SessionErrorCode =
  (typeof SessionErrorCode)[keyof typeof SessionErrorCode];
