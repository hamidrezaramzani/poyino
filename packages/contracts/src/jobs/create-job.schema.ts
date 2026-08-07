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
    departmentId: z.string().uuid("DEPARTMENT_ID_INVALID").optional().nullable(),
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
    department: z.string().nullable(),
    employmentType: EmploymentTypeSchema,
    workplaceType: WorkplaceTypeSchema,
    location: z.string().nullable(),
    salaryMin: z.number().int().nonnegative().nullable(),
    salaryMax: z.number().int().nonnegative().nullable(),
    currency: z.string(),
    salaryVisible: z.boolean(),
    description: z.string(),
    responsibilities: z.string(),
    requirements: z.string(),
    benefits: z.string(),
    skills: z.array(z.string()),
    positions: z.number().int().positive(),
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
  departmentId: z.string().uuid().nullable(),
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

export const ListJobsSortBySchema = z.enum([
  "createdAt",
  "title",
  "candidateCount",
  "status",
]);

export type ListJobsSortBy = z.infer<typeof ListJobsSortBySchema>;

export const ListJobsSortOrderSchema = z.enum(["asc", "desc"]);

export type ListJobsSortOrder = z.infer<typeof ListJobsSortOrderSchema>;

export const ListJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  sortBy: ListJobsSortBySchema.default("createdAt"),
  sortOrder: ListJobsSortOrderSchema.default("desc"),
});

export type ListJobsQuery = z.infer<typeof ListJobsQuerySchema>;

export const JobListItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  status: JobStatusSchema,
  isExpired: z.boolean(),
  department: z.string().nullable(),
  departmentId: z.string().uuid(),
  candidateCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  publishedAt: z.string().datetime().nullable(),
});

export type JobListItem = z.infer<typeof JobListItemSchema>;

export const ListJobsPaginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type ListJobsPagination = z.infer<typeof ListJobsPaginationSchema>;

export const ListJobsSuccessSchema = z.object({
  success: z.literal(true),
  jobs: z.array(JobListItemSchema),
  pagination: ListJobsPaginationSchema,
  sortBy: ListJobsSortBySchema,
  sortOrder: ListJobsSortOrderSchema,
});

export type ListJobsSuccess = z.infer<typeof ListJobsSuccessSchema>;

export const JobErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  JOB_NOT_FOUND: "JOB_NOT_FOUND",
  TEMPLATE_NOT_FOUND: "TEMPLATE_NOT_FOUND",
  INVALID_JOB_STATUS: "INVALID_JOB_STATUS",
  JOB_HAS_CANDIDATES: "JOB_HAS_CANDIDATES",
  JOB_NOT_PUBLISHABLE: "JOB_NOT_PUBLISHABLE",
  DEPARTMENT_NOT_FOUND: "DEPARTMENT_NOT_FOUND",
  INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type JobErrorCode = (typeof JobErrorCode)[keyof typeof JobErrorCode];

export const UpdateJobSchema = CreateJobSchema;
export type UpdateJobInput = CreateJobInput;

export const UpdateJobSuccessSchema = z.object({
  success: z.literal(true),
});

export type UpdateJobSuccess = z.infer<typeof UpdateJobSuccessSchema>;

const expirationDateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "EXPIRATION_DATE_INVALID")
  .nullable()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : null));

export const UpdateJobExpirationSchema = z
  .object({
    expirationDate: expirationDateField,
  })
  .superRefine((value, ctx) => {
    if (!value.expirationDate) {
      return;
    }

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
  });

export type UpdateJobExpirationInput = z.infer<typeof UpdateJobExpirationSchema>;

export const UpdateJobExpirationSuccessSchema = z.object({
  success: z.literal(true),
});

export type UpdateJobExpirationSuccess = z.infer<
  typeof UpdateJobExpirationSuccessSchema
>;

export const PublishJobSuccessSchema = z.object({
  success: z.literal(true),
  status: z.literal("PUBLISHED"),
  publicUrl: z.string(),
});

export type PublishJobSuccess = z.infer<typeof PublishJobSuccessSchema>;

export const UnpublishJobSuccessSchema = z.object({
  success: z.literal(true),
  status: z.literal("DRAFT"),
});

export type UnpublishJobSuccess = z.infer<typeof UnpublishJobSuccessSchema>;

export const JobDetailsCandidateSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  appliedAt: z.string().datetime(),
});

export type JobDetailsCandidate = z.infer<typeof JobDetailsCandidateSchema>;

export const JobDetailsStatisticsSchema = z.object({
  applications: z.number().int().nonnegative(),
  newApplications: z.number().int().nonnegative(),
  interviews: z.number().int().nonnegative(),
  hired: z.number().int().nonnegative(),
});

export type JobDetailsStatistics = z.infer<typeof JobDetailsStatisticsSchema>;

export const JobDetailsSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  status: JobStatusSchema,
  isExpired: z.boolean(),
  department: z.string().nullable(),
  departmentId: z.string().uuid(),
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
  expirationDate: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime().nullable(),
  publicUrl: z.string().nullable(),
  statistics: JobDetailsStatisticsSchema,
  latestCandidate: JobDetailsCandidateSchema.nullable(),
});

export type JobDetails = z.infer<typeof JobDetailsSchema>;

export const JobDetailsSuccessSchema = z.object({
  success: z.literal(true),
  job: JobDetailsSchema,
});

export type JobDetailsSuccess = z.infer<typeof JobDetailsSuccessSchema>;

/** @deprecated Use CreateJobSchema */
export const createJobSchema = CreateJobSchema;
/** @deprecated Use CreateJobInput */
export type CreateJob = CreateJobInput;
