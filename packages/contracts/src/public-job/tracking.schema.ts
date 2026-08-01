import { z } from "zod";
import {
  EmploymentTypeSchema,
  WorkplaceTypeSchema,
} from "../jobs/create-job.schema";

export const ApplicationStatusSchema = z.enum([
  "APPLIED",
  "REVIEWING",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_PASSED",
  "REJECTED",
  "HIRED",
]);

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

export const TrackingTimelineEventSchema = z.object({
  status: ApplicationStatusSchema,
  createdAt: z.string(),
});

export type TrackingTimelineEvent = z.infer<typeof TrackingTimelineEventSchema>;

export const TrackingSubmittedInfoSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  currentPosition: z.string().nullable(),
});

export type TrackingSubmittedInfo = z.infer<typeof TrackingSubmittedInfoSchema>;

export const TrackingJobInfoSchema = z.object({
  title: z.string(),
  organizationName: z.string(),
  employmentType: EmploymentTypeSchema,
  workplaceType: WorkplaceTypeSchema,
  location: z.string().nullable(),
});

export type TrackingJobInfo = z.infer<typeof TrackingJobInfoSchema>;

export const TrackingInfoSchema = z.object({
  status: ApplicationStatusSchema,
  submittedAt: z.string(),
  updatedAt: z.string(),
  timezone: z.string(),
  job: TrackingJobInfoSchema,
  submitted: TrackingSubmittedInfoSchema,
  timeline: z.array(TrackingTimelineEventSchema),
});

export type TrackingInfo = z.infer<typeof TrackingInfoSchema>;

export const TrackingSuccessSchema = z.object({
  success: z.literal(true),
  tracking: TrackingInfoSchema,
});

export type TrackingSuccess = z.infer<typeof TrackingSuccessSchema>;

export const TrackingErrorCode = {
  TRACKING_NOT_FOUND: "TRACKING_NOT_FOUND",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type TrackingErrorCode =
  (typeof TrackingErrorCode)[keyof typeof TrackingErrorCode];
