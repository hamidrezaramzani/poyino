import { z } from "zod";
import {
  EmploymentTypeSchema,
  WorkplaceTypeSchema,
} from "../jobs/create-job.schema";

export const PublicJobOrganizationSchema = z.object({
  name: z.string(),
  displayName: z.string().nullable(),
  description: z.string().nullable(),
  logoUrl: z.string().nullable(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  language: z.string(),
  timezone: z.string(),
});

export type PublicJobOrganization = z.infer<typeof PublicJobOrganizationSchema>;

export const PublicJobSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  department: z.string().nullable(),
  employmentType: EmploymentTypeSchema,
  workplaceType: WorkplaceTypeSchema,
  location: z.string().nullable(),
  description: z.string(),
  responsibilities: z.string().nullable(),
  requirements: z.string().nullable(),
  benefits: z.string().nullable(),
  positions: z.number().int().positive(),
  publishedAt: z.string().nullable(),
  expirationDate: z.string().nullable(),
  acceptingApplications: z.boolean(),
  isExpired: z.boolean(),
  organization: PublicJobOrganizationSchema,
});

export type PublicJob = z.infer<typeof PublicJobSchema>;

export const PublicJobSuccessSchema = z.object({
  success: z.literal(true),
  job: PublicJobSchema,
});

export type PublicJobSuccess = z.infer<typeof PublicJobSuccessSchema>;

export const PublicJobErrorCode = {
  JOB_NOT_FOUND: "JOB_NOT_FOUND",
  JOB_NOT_ACCEPTING: "JOB_NOT_ACCEPTING",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type PublicJobErrorCode =
  (typeof PublicJobErrorCode)[keyof typeof PublicJobErrorCode];
