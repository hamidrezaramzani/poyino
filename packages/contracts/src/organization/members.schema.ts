import { z } from "zod";
import { OrganizationRoleSchema } from "./permissions";

export const MemberStatusSchema = z.enum(["ACTIVE", "SUSPENDED"]);

export type MemberStatus = z.infer<typeof MemberStatusSchema>;

export const AssignableMemberRoleSchema = z.enum([
  "ADMINISTRATOR",
  "RECRUITER",
  "HIRING_MANAGER",
  "INTERVIEWER",
  "VIEWER",
]);

export type AssignableMemberRole = z.infer<typeof AssignableMemberRoleSchema>;

export const OrganizationMemberSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: OrganizationRoleSchema,
  status: MemberStatusSchema,
  departmentId: z.string().uuid(),
  departmentName: z.string(),
  createdAt: z.string().datetime(),
  lastLoginAt: z.string().datetime().nullable(),
  isOwner: z.boolean(),
});

export type OrganizationMember = z.infer<typeof OrganizationMemberSchema>;

export const ListMembersSuccessSchema = z.object({
  success: z.literal(true),
  members: z.array(OrganizationMemberSchema),
});

export type ListMembersSuccess = z.infer<typeof ListMembersSuccessSchema>;

export const CreateMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "EMAIL_REQUIRED")
    .email("EMAIL_INVALID"),
  password: z
    .string()
    .min(1, "PASSWORD_REQUIRED")
    .min(6, "PASSWORD_TOO_SHORT"),
  role: AssignableMemberRoleSchema,
  departmentId: z.string().uuid("DEPARTMENT_ID_INVALID"),
});

export type CreateMemberInput = z.infer<typeof CreateMemberSchema>;

export const CreateMemberSuccessSchema = z.object({
  success: z.literal(true),
  member: OrganizationMemberSchema,
});

export type CreateMemberSuccess = z.infer<typeof CreateMemberSuccessSchema>;

export const UpdateMemberSchema = z
  .object({
    role: AssignableMemberRoleSchema.optional(),
    departmentId: z.string().uuid("DEPARTMENT_ID_INVALID").optional(),
    status: MemberStatusSchema.optional(),
  })
  .refine(
    (value) =>
      value.role !== undefined ||
      value.departmentId !== undefined ||
      value.status !== undefined,
    { message: "NO_CHANGES" },
  );

export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>;

export const UpdateMemberSuccessSchema = z.object({
  success: z.literal(true),
  member: OrganizationMemberSchema,
});

export type UpdateMemberSuccess = z.infer<typeof UpdateMemberSuccessSchema>;

export const MemberErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  MEMBER_NOT_FOUND: "MEMBER_NOT_FOUND",
  DEPARTMENT_NOT_FOUND: "DEPARTMENT_NOT_FOUND",
  CANNOT_MODIFY_OWNER: "CANNOT_MODIFY_OWNER",
  CANNOT_MODIFY_SELF: "CANNOT_MODIFY_SELF",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type MemberErrorCode =
  (typeof MemberErrorCode)[keyof typeof MemberErrorCode];
