import {
  JobMatchAnalysisSchema,
  type JobMatchAnalysis,
} from "@poyino/contracts";
import { z } from "zod";

const JOB_MATCH_HINT = [
  "{",
  '"matchScore":0,',
  '"executiveSummary":"string",',
  '"strengths":["string"],',
  '"weaknesses":["string"],',
  '"missingSkills":["string"],',
  '"interviewQuestions":["string"],',
  '"yearsExperience":0',
  "}",
].join("");

function asTrimmedString(value: unknown): string {
  if (value == null) {
    return "";
  }
  return String(value).trim();
}

function asStringArray(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) {
    if (typeof value === "string" && value.trim()) {
      return value
        .split(/\n|;/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, max);
    }
    return [];
  }

  return value
    .map((item) => asTrimmedString(item))
    .filter(Boolean)
    .slice(0, max);
}

function asScore(value: unknown): number {
  const number =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN;
  if (!Number.isFinite(number)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(number)));
}

function asYears(value: unknown): number | null {
  if (value == null || value === "") {
    return null;
  }
  const number =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN;
  if (!Number.isFinite(number)) {
    return null;
  }
  return Math.max(0, Math.min(60, Math.round(number)));
}

export function normalizeJobMatchAnalysis(raw: unknown): unknown {
  const record =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    matchScore: asScore(
      record.matchScore ?? record.score ?? record.aiScore ?? record.match,
    ),
    executiveSummary: asTrimmedString(
      record.executiveSummary ?? record.summary ?? record.overview,
    ).slice(0, 2000),
    strengths: asStringArray(record.strengths ?? record.pros, 20),
    weaknesses: asStringArray(
      record.weaknesses ?? record.cons ?? record.gaps,
      20,
    ),
    missingSkills: asStringArray(
      record.missingSkills ?? record.requiredMissingSkills,
      30,
    ),
    interviewQuestions: asStringArray(
      record.interviewQuestions ?? record.questions,
      10,
    ),
    yearsExperience: asYears(
      record.yearsExperience ?? record.experienceYears ?? record.years,
    ),
  };
}

export const jobMatchAnalysisZodSchema: z.ZodType<JobMatchAnalysis> =
  JobMatchAnalysisSchema;

export type JobMatchPromptInput = {
  jobTitle: string;
  jobDescription: string;
  responsibilities: string | null;
  requirements: string | null;
  skills: string[];
  candidateFullName: string;
  candidateCurrentPosition: string | null;
  candidateSkills: string[];
  candidateExperience: string | null;
  candidateEducation: string | null;
  extractedText: string | null;
};

export function buildJobMatchPrompt(input: JobMatchPromptInput) {
  const resumeText = (input.extractedText ?? "").slice(0, 16_000);
  const experienceText = (input.candidateExperience ?? "").slice(0, 4_000);
  const educationText = (input.candidateEducation ?? "").slice(0, 2_000);

  return [
    "Evaluate how well this candidate matches the job posting.",
    "Return JSON matching the schema.",
    "matchScore must be an integer 0-100 representing overall fit.",
    "executiveSummary should be 2-4 sentences covering background, strongest skills, and overall impression.",
    "strengths and weaknesses should be concrete bullet points.",
    "missingSkills should list important job skills not evidenced in the resume.",
    "interviewQuestions should be up to 10 relevant questions for recruiters.",
    "yearsExperience should estimate total professional years as an integer, or null if unknown.",
    "",
    "Job title:",
    input.jobTitle,
    "",
    "Job description:",
    input.jobDescription.slice(0, 6_000),
    "",
    "Responsibilities:",
    (input.responsibilities ?? "").slice(0, 3_000) || "(none)",
    "",
    "Requirements:",
    (input.requirements ?? "").slice(0, 3_000) || "(none)",
    "",
    "Required skills:",
    input.skills.length > 0 ? input.skills.join(", ") : "(none listed)",
    "",
    "Candidate name:",
    input.candidateFullName,
    "",
    "Current position:",
    input.candidateCurrentPosition ?? "(unknown)",
    "",
    "Candidate skills:",
    input.candidateSkills.length > 0
      ? input.candidateSkills.join(", ")
      : "(none)",
    "",
    "Candidate experience summary:",
    experienceText || "(none)",
    "",
    "Candidate education summary:",
    educationText || "(none)",
    "",
    "Resume text:",
    resumeText || "(not available)",
  ].join("\n");
}

export const jobMatchSystemPrompt =
  "You are a recruiting assistant that evaluates candidate-job fit. Respond with JSON only.";

export const jobMatchSchemaHint = JOB_MATCH_HINT;
