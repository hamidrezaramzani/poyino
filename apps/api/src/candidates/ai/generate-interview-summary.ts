import {
  InterviewSummarySchema,
  type InterviewSummary,
} from "@poyino/contracts";
import { z } from "zod";
import { resolveInterviewAiLanguage } from "./generate-interview-prep";

const SUMMARY_HINT = [
  "{",
  '"executiveSummary":"string",',
  '"timelineSummary":[{"interviewName":"string","interviewType":"string","summary":"string"}],',
  '"consensus":"string",',
  '"strengths":["string"],',
  '"weaknesses":["string"],',
  '"risks":["string"],',
  '"outstandingQuestions":["string"],',
  '"suggestedNextStep":"string"',
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

function asTimeline(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const interviewName = asTrimmedString(
        record.interviewName ?? record.name ?? record.stage,
      );
      const interviewType = asTrimmedString(
        record.interviewType ?? record.type,
      );
      const summary = asTrimmedString(
        record.summary ?? record.overview ?? record.notes,
      );
      if (!interviewName && !summary) return null;
      return {
        interviewName: interviewName || interviewType || "Interview",
        interviewType: interviewType || "CUSTOM",
        summary: summary || interviewName,
      };
    })
    .filter(
      (
        item,
      ): item is {
        interviewName: string;
        interviewType: string;
        summary: string;
      } => item != null,
    )
    .slice(0, 20);
}

export function normalizeInterviewSummary(raw: unknown): unknown {
  const record =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    executiveSummary: asTrimmedString(
      record.executiveSummary ?? record.summary ?? record.overview,
    ).slice(0, 4000),
    timelineSummary: asTimeline(
      record.timelineSummary ?? record.timeline ?? record.interviews,
    ),
    consensus: asTrimmedString(
      record.consensus ?? record.recruiterConsensus ?? record.overallOpinion,
    ).slice(0, 1500),
    strengths: asStringArray(record.strengths ?? record.pros, 15),
    weaknesses: asStringArray(
      record.weaknesses ?? record.concerns ?? record.cons,
      15,
    ),
    risks: asStringArray(record.risks ?? record.hiringRisks, 12),
    outstandingQuestions: asStringArray(
      record.outstandingQuestions ?? record.openQuestions ?? record.unanswered,
      12,
    ),
    suggestedNextStep: asTrimmedString(
      record.suggestedNextStep ?? record.nextStep ?? record.recommendation,
    ).slice(0, 1000),
  };
}

export const interviewSummaryZodSchema: z.ZodType<InterviewSummary> =
  InterviewSummarySchema;

export type CompletedInterviewSummaryInput = {
  name: string;
  type: string;
  result: string | null;
  status: string;
  internalNotes: string | null;
  scheduledAt: string;
};

export type InterviewSummaryPromptInput = {
  language: string;
  jobTitle: string;
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
  completedInterviews: CompletedInterviewSummaryInput[];
};

export function buildInterviewSummaryPrompt(input: InterviewSummaryPromptInput) {
  const sourceTexts = input.completedInterviews.flatMap((interview) => [
    interview.internalNotes,
    interview.name,
  ]);
  const languageCode = resolveInterviewAiLanguage({
    organizationLanguage: input.language,
    sourceTexts,
  });
  const isPersian = languageCode === "fa";
  const languageName = isPersian ? "Persian (Farsi)" : "English";

  const languageRules = isPersian
    ? [
        "CRITICAL LANGUAGE RULES:",
        "- Write EVERY string value in Persian (Farsi).",
        "- Do NOT use English for executiveSummary, timeline summaries, consensus, strengths, weaknesses, risks, outstanding questions, or suggested next step.",
        "- Keep JSON keys in English exactly as in the schema.",
        "- Technical skill names may remain in English, but surrounding text must be Persian.",
        "- Interviewer notes are in Persian; the entire summary MUST be Persian.",
      ]
    : [
        "CRITICAL LANGUAGE RULES:",
        "- Write EVERY string value in English.",
        "- Keep JSON keys in English exactly as in the schema.",
      ];

  const interviewBlocks = input.completedInterviews.map((interview, index) =>
    [
      `Interview ${index + 1}:`,
      `Name: ${interview.name}`,
      `Type: ${interview.type}`,
      `Status: ${interview.status}`,
      `Result: ${interview.result ?? "(none)"}`,
      `Scheduled at: ${interview.scheduledAt}`,
      `Internal notes: ${(interview.internalNotes ?? "(none)").slice(0, 1500)}`,
    ].join("\n"),
  );

  return [
    "Generate an AI summary of the full interview journey for a hiring manager.",
    `Output language: ${languageName}.`,
    `Required output language code: ${languageCode}.`,
    ...languageRules,
    "Use ONLY completed interviews and internal recruiter notes.",
    "Ignore candidate-visible notes.",
    "Recommendations are advisory only — never make a final hiring decision as fact.",
    "Return JSON matching the schema exactly.",
    "Keep content concise:",
    "- executiveSummary: max 250 words",
    "- timelineSummary: one short summary per completed interview",
    "- consensus: 1-3 sentences about interviewer agreement",
    "- strengths / weaknesses / risks / outstandingQuestions: up to 5 short items each",
    "- suggestedNextStep: one clear advisory recommendation (Hire / another interview / references / Reject)",
    "",
    "Job title:",
    input.jobTitle,
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
      : "(none)",
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
    (input.candidateExperience ?? "").slice(0, 1_200) || "(none)",
    "",
    "Education:",
    (input.candidateEducation ?? "").slice(0, 800) || "(none)",
    "",
    "Resume / match summary:",
    (input.resumeSummary ?? "(none)").slice(0, 800),
    "",
    "Match score:",
    input.matchScore == null ? "(unknown)" : String(input.matchScore),
    "",
    "Completed interviews:",
    interviewBlocks.length > 0 ? interviewBlocks.join("\n\n") : "(none)",
  ].join("\n");
}

export function buildInterviewSummarySystemPrompt(language: "fa" | "en") {
  if (language === "fa") {
    return [
      "You are an expert recruiting assistant that summarizes interview journeys.",
      "Respond with JSON only.",
      "Never make an automatic hiring decision; suggestions are advisory only.",
      "All human-readable string values MUST be written in Persian (Farsi).",
      "Do not write English sentences in any string field.",
      "JSON property names must remain in English.",
    ].join(" ");
  }

  return [
    "You are an expert recruiting assistant that summarizes interview journeys.",
    "Respond with JSON only.",
    "Never make an automatic hiring decision; suggestions are advisory only.",
    "All human-readable string values MUST be written in English.",
    "JSON property names must remain in English.",
  ].join(" ");
}

export const interviewSummarySchemaHint = SUMMARY_HINT;
