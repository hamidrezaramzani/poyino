import { z } from "zod";

export const JobMatchAnalysisSchema = z.object({
  matchScore: z.number().int().min(0).max(100),
  executiveSummary: z.string().trim().max(2000).default(""),
  strengths: z.array(z.string().trim().min(1).max(500)).max(20).default([]),
  weaknesses: z.array(z.string().trim().min(1).max(500)).max(20).default([]),
  missingSkills: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
  interviewQuestions: z
    .array(z.string().trim().min(1).max(500))
    .max(10)
    .default([]),
  yearsExperience: z.number().int().min(0).max(60).nullable().optional(),
});

export type JobMatchAnalysis = z.infer<typeof JobMatchAnalysisSchema>;
