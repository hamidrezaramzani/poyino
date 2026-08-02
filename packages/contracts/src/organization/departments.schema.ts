import { z } from "zod";

export const DepartmentSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  color: z.string().nullable(),
  isDefault: z.boolean(),
  archivedAt: z.string().datetime().nullable(),
});

export type DepartmentSummary = z.infer<typeof DepartmentSummarySchema>;

export const ListDepartmentsSuccessSchema = z.object({
  success: z.literal(true),
  departments: z.array(DepartmentSummarySchema),
});

export type ListDepartmentsSuccess = z.infer<
  typeof ListDepartmentsSuccessSchema
>;

export const CreateDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "DEPARTMENT_NAME_REQUIRED")
    .max(100, "DEPARTMENT_NAME_TOO_LONG"),
  description: z
    .string()
    .trim()
    .max(1000, "DEPARTMENT_DESCRIPTION_TOO_LONG")
    .optional()
    .nullable()
    .transform((value) => (value && value.length > 0 ? value : null)),
});

export type CreateDepartmentInput = z.input<typeof CreateDepartmentSchema>;

export const CreateDepartmentSuccessSchema = z.object({
  success: z.literal(true),
  department: DepartmentSummarySchema,
});

export type CreateDepartmentSuccess = z.infer<
  typeof CreateDepartmentSuccessSchema
>;

export const DepartmentErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DEPARTMENT_NAME_EXISTS: "DEPARTMENT_NAME_EXISTS",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type DepartmentErrorCode =
  (typeof DepartmentErrorCode)[keyof typeof DepartmentErrorCode];
