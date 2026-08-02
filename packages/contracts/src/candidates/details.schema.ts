import { z } from "zod";
import { DashboardCandidateStatusSchema } from "../dashboard/dashboard.schema";
import { ResumeAnalysisSchema } from "../public-job/apply.schema";
import { InterviewSchema } from "./interviews.schema";
import { JobMatchAnalysisSchema } from "./job-match.schema";
import { CandidateNoteSchema } from "./notes.schema";

export const ApplicationActivityTypeSchema = z.enum([
  "APPLICATION_SUBMITTED",
  "RESUME_PROCESSED",
  "AI_ANALYSIS_COMPLETED",
  "STATUS_CHANGED",
  "NOTE_ADDED",
  "NOTE_UPDATED",
  "NOTE_DELETED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_UPDATED",
  "INTERVIEW_CANCELLED",
  "INTERVIEW_COMPLETED",
]);

export type ApplicationActivityType = z.infer<
  typeof ApplicationActivityTypeSchema
>;

export const CandidateActivityEventSchema = z.object({
  id: z.string().uuid(),
  type: ApplicationActivityTypeSchema,
  description: z.string(),
  actorUserId: z.string().uuid().nullable(),
  actorEmail: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export type CandidateActivityEvent = z.infer<
  typeof CandidateActivityEventSchema
>;

export const CandidateProfileSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  currentPosition: z.string().nullable(),
  skills: z.array(z.string()),
  experience: z.string().nullable(),
  education: z.string().nullable(),
  linkedin: z.string().nullable(),
  portfolio: z.string().nullable(),
  website: z.string().nullable(),
  status: DashboardCandidateStatusSchema,
  aiScore: z.number().int().min(0).max(100).nullable(),
  yearsExperience: z.number().int().min(0).max(60).nullable(),
  appliedAt: z.string().datetime(),
  resume: z
    .object({
      fileId: z.string().uuid(),
      fileName: z.string(),
      mimeType: z.string(),
      downloadUrl: z.string(),
    })
    .nullable(),
  resumeAnalysis: ResumeAnalysisSchema.nullable(),
  jobMatchAnalysis: JobMatchAnalysisSchema.nullable(),
  notes: z.array(CandidateNoteSchema),
  timeline: z.array(CandidateActivityEventSchema),
  interviews: z.array(InterviewSchema),
});

export type CandidateProfile = z.infer<typeof CandidateProfileSchema>;

export const GetCandidateProfileSuccessSchema = z.object({
  success: z.literal(true),
  job: z.object({
    id: z.string().uuid(),
    title: z.string(),
  }),
  candidate: CandidateProfileSchema,
});

export type GetCandidateProfileSuccess = z.infer<
  typeof GetCandidateProfileSuccessSchema
>;
