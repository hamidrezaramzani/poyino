import { z } from "zod";

export const EmploymentTypeSchema = z.enum(
  ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"],
  { message: "EMPLOYMENT_TYPE_REQUIRED" },
);

export type EmploymentType = z.infer<typeof EmploymentTypeSchema>;

export const WorkplaceTypeSchema = z.enum(["ON_SITE", "HYBRID", "REMOTE"], {
  message: "WORKPLACE_TYPE_REQUIRED",
});

export type WorkplaceType = z.infer<typeof WorkplaceTypeSchema>;

export const JobStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export type JobStatus = z.infer<typeof JobStatusSchema>;

const optionalTrimmedString = (max: number, tooLongCode: string) =>
  z
    .string()
    .trim()
    .max(max, tooLongCode)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null));

const optionalRichText = () =>
  z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    });

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function startOfTodayUtc() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

export const CreateJobSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "TITLE_REQUIRED")
      .min(3, "TITLE_TOO_SHORT")
      .max(100, "TITLE_TOO_LONG"),
    department: optionalTrimmedString(80, "DEPARTMENT_TOO_LONG"),
    employmentType: EmploymentTypeSchema,
    workplaceType: WorkplaceTypeSchema,
    location: optionalTrimmedString(120, "LOCATION_TOO_LONG"),
    salaryMin: z
      .number()
      .int("SALARY_MIN_INVALID")
      .nonnegative("SALARY_MIN_INVALID")
      .nullable()
      .optional()
      .transform((value) => (value == null ? null : value)),
    salaryMax: z
      .number()
      .int("SALARY_MAX_INVALID")
      .nonnegative("SALARY_MAX_INVALID")
      .nullable()
      .optional()
      .transform((value) => (value == null ? null : value)),
    currency: z
      .string()
      .trim()
      .length(3, "CURRENCY_INVALID")
      .regex(/^[A-Z]{3}$/, "CURRENCY_INVALID")
      .optional()
      .default("IRR"),
    salaryVisible: z.boolean({
      message: "SALARY_VISIBILITY_REQUIRED",
    }),
    description: z
      .string()
      .min(1, "DESCRIPTION_REQUIRED")
      .refine((value) => stripHtml(value).length >= 50, {
        message: "DESCRIPTION_TOO_SHORT",
      }),
    responsibilities: optionalRichText(),
    requirements: optionalRichText(),
    benefits: optionalRichText(),
    skills: z
      .array(
        z
          .string()
          .trim()
          .min(1, "SKILL_REQUIRED")
          .max(80, "SKILL_TOO_LONG"),
      )
      .max(50, "SKILLS_TOO_MANY")
      .optional()
      .default([]),
    positions: z
      .number()
      .int("POSITIONS_INVALID")
      .min(1, "POSITIONS_TOO_LOW")
      .max(999, "POSITIONS_TOO_HIGH")
      .default(1),
    expirationDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "EXPIRATION_DATE_INVALID")
      .nullable()
      .optional()
      .transform((value) => (value && value.length > 0 ? value : null)),
  })
  .superRefine((value, ctx) => {
    if (
      value.salaryMin != null &&
      value.salaryMax != null &&
      value.salaryMax <= value.salaryMin
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["salaryMax"],
        message: "SALARY_RANGE_INVALID",
      });
    }

    if (value.expirationDate) {
      const expiration = new Date(`${value.expirationDate}T00:00:00.000Z`);
      if (Number.isNaN(expiration.getTime())) {
        ctx.addIssue({
          code: "custom",
          path: ["expirationDate"],
          message: "EXPIRATION_DATE_INVALID",
        });
        return;
      }

      if (expiration < startOfTodayUtc()) {
        ctx.addIssue({
          code: "custom",
          path: ["expirationDate"],
          message: "EXPIRATION_DATE_IN_PAST",
        });
      }
    }
  });

export type CreateJobInput = z.infer<typeof CreateJobSchema>;

export const CreateJobSuccessSchema = z.object({
  success: z.literal(true),
  id: z.string().uuid(),
  status: z.literal("DRAFT"),
});

export type CreateJobSuccess = z.infer<typeof CreateJobSuccessSchema>;

export const GenerateJobContentSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(10, "PROMPT_TOO_SHORT")
    .max(500, "PROMPT_TOO_LONG"),
});

export type GenerateJobContentInput = z.infer<typeof GenerateJobContentSchema>;

export const GenerateJobContentSuccessSchema = z.object({
  success: z.literal(true),
  content: z.object({
    title: z.string(),
    description: z.string(),
    responsibilities: z.string(),
    requirements: z.string(),
    benefits: z.string(),
  }),
});

export type GenerateJobContentSuccess = z.infer<
  typeof GenerateJobContentSuccessSchema
>;

export const JobTemplateSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  title: z.string(),
  department: z.string().nullable(),
  employmentType: EmploymentTypeSchema,
  workplaceType: WorkplaceTypeSchema,
  location: z.string().nullable(),
  salaryMin: z.number().int().nullable(),
  salaryMax: z.number().int().nullable(),
  currency: z.string(),
  salaryVisible: z.boolean(),
  description: z.string(),
  responsibilities: z.string().nullable(),
  requirements: z.string().nullable(),
  benefits: z.string().nullable(),
  skills: z.array(z.string()),
  positions: z.number().int(),
});

export type JobTemplateSummary = z.infer<typeof JobTemplateSummarySchema>;

export const JobTemplatesSuccessSchema = z.object({
  success: z.literal(true),
  templates: z.array(JobTemplateSummarySchema),
});

export type JobTemplatesSuccess = z.infer<typeof JobTemplatesSuccessSchema>;

export const JobErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  TEMPLATE_NOT_FOUND: "TEMPLATE_NOT_FOUND",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type JobErrorCode = (typeof JobErrorCode)[keyof typeof JobErrorCode];

/** @deprecated Use CreateJobSchema */
export const createJobSchema = CreateJobSchema;
/** @deprecated Use CreateJobInput */
export type CreateJob = CreateJobInput;
