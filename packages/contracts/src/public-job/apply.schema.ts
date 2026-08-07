import { z } from "zod";

export const MAX_RESUME_UPLOAD_BYTES = 10 * 1024 * 1024;

export const RESUME_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
] as const;

export type ResumeMimeType = (typeof RESUME_MIME_TYPES)[number];

export const ResumeMimeTypeSchema = z.enum(RESUME_MIME_TYPES, {
  message: "FILE_INVALID_TYPE",
});

export const UploadResumeSchema = z.object({
  fileName: z.string().trim().min(1, "FILE_NAME_REQUIRED").max(255),
  mimeType: ResumeMimeTypeSchema,
  contentBase64: z.string().min(1, "FILE_REQUIRED"),
});

export type UploadResumeInput = z.infer<typeof UploadResumeSchema>;

export const UploadResumeSuccessSchema = z.object({
  success: z.literal(true),
  fileId: z.string().uuid(),
  fileName: z.string(),
  sizeBytes: z.number().int().nonnegative(),
});

export type UploadResumeSuccess = z.infer<typeof UploadResumeSuccessSchema>;

export const AnalyzeResumeSchema = z.object({
  fileId: z.string().uuid({ message: "FILE_REQUIRED" }),
});

export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeSchema>;

export const ResumeAnalysisSchema = z.object({
  fullName: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().max(255).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  currentPosition: z.string().trim().max(120).optional().nullable().default(null),
  skills: z.array(z.string().trim().min(1).max(80)).max(50).optional().default([]),
  experience: z.string().optional().default(""),
  education: z.string().optional().default(""),
  linkedin: z.string().trim().max(255).optional().nullable().default(null),
  portfolio: z.string().trim().max(255).optional().nullable().default(null),
  website: z.string().trim().max(255).optional().nullable().default(null),
});

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;

export const AnalyzeResumeSuccessSchema = z.object({
  success: z.literal(true),
  analysis: ResumeAnalysisSchema,
  extractedTextLength: z.number().int().nonnegative(),
});

export type AnalyzeResumeSuccess = z.infer<typeof AnalyzeResumeSuccessSchema>;

export const AnalyzeResumeSoftFailureSchema = z.object({
  success: z.literal(true),
  analysis: z.null(),
  extractedTextLength: z.number().int().nonnegative(),
  warningCode: z.enum([
    "EXTRACTION_FAILED",
    "ANALYSIS_FAILED",
    "INSUFFICIENT_CREDITS",
  ]),
});

export type AnalyzeResumeSoftFailure = z.infer<
  typeof AnalyzeResumeSoftFailureSchema
>;

const optionalUrl = z
  .string()
  .trim()
  .max(255)
  .optional()
  .nullable()
  .transform((value) => {
    if (value == null) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

export const SubmitApplicationSchema = z.object({
  fileId: z.string().uuid({ message: "RESUME_REQUIRED" }),
  fullName: z
    .string()
    .trim()
    .min(1, "FULL_NAME_REQUIRED")
    .max(120, "FULL_NAME_TOO_LONG"),
  email: z
    .string()
    .trim()
    .min(1, "EMAIL_REQUIRED")
    .email("EMAIL_INVALID")
    .max(255, "EMAIL_TOO_LONG"),
  phone: z
    .string()
    .trim()
    .min(1, "PHONE_REQUIRED")
    .max(40, "PHONE_TOO_LONG"),
  currentPosition: z
    .string()
    .trim()
    .max(120)
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
  skills: z.array(z.string().trim().min(1).max(80)).max(50).optional().default([]),
  experience: z
    .string()
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
  education: z
    .string()
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
  linkedin: optionalUrl,
  portfolio: optionalUrl,
  website: optionalUrl,
  extractedText: z.string().optional().nullable(),
  aiAnalysis: ResumeAnalysisSchema.optional().nullable(),
});

export type SubmitApplicationInput = z.infer<typeof SubmitApplicationSchema>;

export const SubmitApplicationSuccessSchema = z.object({
  success: z.literal(true),
  applicationId: z.string().uuid(),
  trackingToken: z.string().min(1),
  trackingUrl: z.string().min(1),
  jobTitle: z.string(),
  organizationName: z.string(),
  submittedAt: z.string(),
});

export type SubmitApplicationSuccess = z.infer<
  typeof SubmitApplicationSuccessSchema
>;

export const ApplyErrorCode = {
  JOB_NOT_FOUND: "JOB_NOT_FOUND",
  JOB_NOT_ACCEPTING: "JOB_NOT_ACCEPTING",
  FILE_REQUIRED: "FILE_REQUIRED",
  FILE_INVALID_TYPE: "FILE_INVALID_TYPE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  EXTRACTION_FAILED: "EXTRACTION_FAILED",
  ANALYSIS_FAILED: "ANALYSIS_FAILED",
  DUPLICATE_APPLICATION: "DUPLICATE_APPLICATION",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type ApplyErrorCode = (typeof ApplyErrorCode)[keyof typeof ApplyErrorCode];
