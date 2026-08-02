import {
  InterviewAiPreparationSchema,
  type InterviewAiPreparation,
} from "@poyino/contracts";
import { z } from "zod";

const INTERVIEW_AI_HINT = [
  "{",
  '"executiveSummary":"string",',
  '"interviewObjectives":["string"],',
  '"technicalQuestions":["string"],',
  '"behavioralQuestions":["string"],',
  '"followUpQuestions":["string"],',
  '"strengths":["string"],',
  '"weaknesses":["string"],',
  '"missingSkills":["string"],',
  '"evaluationChecklist":[{"label":"string","explanation":"string"}]',
  "}",
].join("");

function asTrimmedString(value: unknown): string {
  if (value == null) return "";
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

function asChecklist(value: unknown): Array<{ label: string; explanation: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const label = asTrimmedString(record.label ?? record.name ?? record.criterion);
      const explanation = asTrimmedString(
        record.explanation ?? record.description ?? record.detail,
      );
      if (!label) return null;
      return { label, explanation: explanation || label };
    })
    .filter((item): item is { label: string; explanation: string } => item != null)
    .slice(0, 12);
}

export function normalizeInterviewAiPreparation(raw: unknown): unknown {
  const record =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    executiveSummary: asTrimmedString(
      record.executiveSummary ?? record.summary ?? record.overview,
    ).slice(0, 2500),
    interviewObjectives: asStringArray(
      record.interviewObjectives ?? record.objectives,
      10,
    ),
    technicalQuestions: asStringArray(record.technicalQuestions, 10),
    behavioralQuestions: asStringArray(record.behavioralQuestions, 10),
    followUpQuestions: asStringArray(
      record.followUpQuestions ?? record.followups,
      10,
    ),
    strengths: asStringArray(record.strengths ?? record.pros, 20),
    weaknesses: asStringArray(record.weaknesses ?? record.cons, 20),
    missingSkills: asStringArray(record.missingSkills, 30),
    evaluationChecklist: asChecklist(
      record.evaluationChecklist ?? record.checklist,
    ),
  };
}

export const interviewAiPreparationZodSchema: z.ZodType<InterviewAiPreparation> =
  InterviewAiPreparationSchema;

export type InterviewAiPromptInput = {
  language: string;
  recruiterPrompt?: string;
  interviewName?: string;
  interviewType?: string;
  jobTitle: string;
  department: string | null;
  employmentType: string;
  workplaceType: string;
  jobDescription: string;
  responsibilities: string | null;
  requirements: string | null;
  requiredSkills: string[];
  candidateFullName: string;
  candidateCurrentPosition: string | null;
  candidateSkills: string[];
  candidateExperience: string | null;
  candidateEducation: string | null;
  resumeSummary: string | null;
  matchScore: number | null;
  missingSkills: string[];
  extractedText: string | null;
};

const PERSIAN_SCRIPT_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

export function resolveInterviewAiLanguage(input: {
  organizationLanguage?: string | null;
  recruiterPrompt?: string | null;
  sourceTexts?: Array<string | null | undefined>;
}): "fa" | "en" {
  const samples = [input.recruiterPrompt, ...(input.sourceTexts ?? [])];
  for (const sample of samples) {
    const text = sample?.trim() ?? "";
    if (text && PERSIAN_SCRIPT_RE.test(text)) {
      return "fa";
    }
  }

  const orgLanguage = (input.organizationLanguage ?? "fa").trim().toLowerCase();
  if (orgLanguage === "en" || orgLanguage.startsWith("en-")) {
    return "en";
  }
  return "fa";
}

export function buildInterviewAiPrompt(input: InterviewAiPromptInput) {
  const languageCode = resolveInterviewAiLanguage({
    organizationLanguage: input.language,
    recruiterPrompt: input.recruiterPrompt,
  });
  const isPersian = languageCode === "fa";
  const languageName = isPersian ? "Persian (Farsi)" : "English";

  const languageRules = isPersian
    ? [
        "CRITICAL LANGUAGE RULES:",
        "- Write EVERY string value in Persian (Farsi).",
        "- Do NOT use English for summaries, questions, strengths, weaknesses, objectives, or checklist text.",
        "- Keep JSON keys in English exactly as in the schema.",
        "- Skill names may stay in their common technical form (e.g. React, Kubernetes) but surrounding text must be Persian.",
        "- Recruiter instructions are in Persian; respond entirely in Persian.",
      ]
    : [
        "CRITICAL LANGUAGE RULES:",
        "- Write EVERY string value in English.",
        "- Keep JSON keys in English exactly as in the schema.",
      ];

  return [
    `Generate a concise interview preparation guide for a recruiter.`,
    `Output language: ${languageName}.`,
    ...languageRules,
    "Tailor every question and objective to THIS interview stage only.",
    `Interview stage name: ${input.interviewName?.trim() || "(unspecified)"}`,
    `Interview stage type: ${input.interviewType?.trim() || "(unspecified)"}`,
    "Return JSON matching the schema exactly.",
    "Keep answers short to stay fast:",
    "- executiveSummary: max 80 words",
    "- interviewObjectives: exactly 4 short items",
    "- technicalQuestions: exactly 5 short questions",
    "- behavioralQuestions: exactly 5 short questions",
    "- followUpQuestions: exactly 3 short questions",
    "- strengths / weaknesses: up to 3 short items each",
    "- missingSkills: up to 5 items",
    "- evaluationChecklist: exactly 4 items with one-sentence explanations",
    "Never make a hiring decision.",
    "",
    "Job title:",
    input.jobTitle,
    "",
    "Department:",
    input.department ?? "(none)",
    "",
    "Employment / workplace:",
    `${input.employmentType} / ${input.workplaceType}`,
    "",
    "Job description:",
    input.jobDescription.slice(0, 2_500),
    "",
    "Responsibilities:",
    (input.responsibilities ?? "").slice(0, 1_200) || "(none)",
    "",
    "Requirements:",
    (input.requirements ?? "").slice(0, 1_200) || "(none)",
    "",
    "Required skills:",
    input.requiredSkills.length > 0
      ? input.requiredSkills.slice(0, 20).join(", ")
      : "(none listed)",
    "",
    "Candidate name:",
    input.candidateFullName,
    "",
    "Current position:",
    input.candidateCurrentPosition ?? "(unknown)",
    "",
    "Candidate skills:",
    input.candidateSkills.length > 0
      ? input.candidateSkills.slice(0, 25).join(", ")
      : "(none)",
    "",
    "Experience:",
    (input.candidateExperience ?? "").slice(0, 1_500) || "(none)",
    "",
    "Education:",
    (input.candidateEducation ?? "").slice(0, 800) || "(none)",
    "",
    "Resume AI summary:",
    (input.resumeSummary ?? "(none)").slice(0, 800),
    "",
    "Match score:",
    input.matchScore == null ? "(unknown)" : String(input.matchScore),
    "",
    "Known missing skills:",
    input.missingSkills.length > 0
      ? input.missingSkills.slice(0, 12).join(", ")
      : "(none)",
    "",
    "Resume extract:",
    (input.extractedText ?? "").slice(0, 3_500) || "(none)",
    "",
    "Recruiter instructions:",
    (input.recruiterPrompt?.trim() || "(none)").slice(0, 800),
  ].join("\n");
}

export function buildInterviewAiSystemPrompt(language: "fa" | "en") {
  if (language === "fa") {
    return [
      "You are an expert recruiting assistant that prepares interview guides.",
      "Respond with JSON only.",
      "Never make a hiring decision; provide advisory recommendations only.",
      "All human-readable string values MUST be written in Persian (Farsi).",
      "JSON property names must remain in English.",
      "Do not answer in English unless a technical skill/tool name has no common Persian equivalent.",
    ].join(" ");
  }

  return [
    "You are an expert recruiting assistant that prepares interview guides.",
    "Respond with JSON only.",
    "Never make a hiring decision; provide advisory recommendations only.",
    "All human-readable string values MUST be written in English.",
    "JSON property names must remain in English.",
  ].join(" ");
}

/** @deprecated Prefer buildInterviewAiSystemPrompt(language) */
export const interviewAiSystemPrompt = buildInterviewAiSystemPrompt("fa");

export const interviewAiSchemaHint = INTERVIEW_AI_HINT;
