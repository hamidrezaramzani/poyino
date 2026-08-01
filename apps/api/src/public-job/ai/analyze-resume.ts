import { ResumeAnalysisSchema, type ResumeAnalysis } from "@poyino/contracts";
import { z } from "zod";

const RESUME_ANALYSIS_HINT = [
  "{",
  '"fullName":"string",',
  '"email":"string",',
  '"phone":"string",',
  '"currentPosition":"string|null",',
  '"skills":["string"],',
  '"experience":"string",',
  '"education":"string",',
  '"linkedin":"string|null",',
  '"portfolio":"string|null",',
  '"website":"string|null"',
  "}",
].join("");

function asTrimmedString(value: unknown): string {
  if (value == null) {
    return "";
  }
  return String(value).trim();
}

function asNullableString(value: unknown): string | null {
  const text = asTrimmedString(value);
  return text.length > 0 ? text : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    if (typeof value === "string" && value.trim()) {
      return value
        .split(/[,;|]/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 50);
    }
    return [];
  }

  return value
    .map((item) => asTrimmedString(item))
    .filter(Boolean)
    .slice(0, 50);
}

function formatExperience(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }
      if (!item || typeof item !== "object") {
        return "";
      }
      const record = item as Record<string, unknown>;
      const title = asTrimmedString(record.title ?? record.position);
      const company = asTrimmedString(record.company ?? record.organization);
      const start = asTrimmedString(record.startDate ?? record.start);
      const end = asTrimmedString(record.endDate ?? record.end ?? "Present");
      const description = asTrimmedString(record.description);
      const header = [title, company].filter(Boolean).join(" at ");
      const dates = [start, end].filter(Boolean).join(" - ");
      return [header, dates, description].filter(Boolean).join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

function formatEducation(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }
      if (!item || typeof item !== "object") {
        return "";
      }
      const record = item as Record<string, unknown>;
      const school = asTrimmedString(record.school ?? record.institution);
      const degree = asTrimmedString(record.degree);
      const field = asTrimmedString(record.field ?? record.fieldOfStudy);
      const start = asTrimmedString(record.startDate ?? record.start);
      const end = asTrimmedString(record.endDate ?? record.end);
      const line = [degree, field, school].filter(Boolean).join(", ");
      const dates = [start, end].filter(Boolean).join(" - ");
      return [line, dates].filter(Boolean).join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

export function normalizeResumeAnalysis(raw: unknown): unknown {
  const record =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    fullName: asTrimmedString(record.fullName ?? record.name),
    email: asTrimmedString(record.email),
    phone: asTrimmedString(record.phone ?? record.phoneNumber),
    currentPosition: asNullableString(
      record.currentPosition ?? record.title ?? record.headline,
    ),
    skills: asStringArray(record.skills),
    experience: formatExperience(record.experience ?? record.workExperience),
    education: formatEducation(record.education),
    linkedin: asNullableString(record.linkedin),
    portfolio: asNullableString(record.portfolio),
    website: asNullableString(record.website),
  };
}

export const resumeAnalysisZodSchema: z.ZodType<ResumeAnalysis> =
  ResumeAnalysisSchema;

export function buildResumeAnalysisPrompt(extractedText: string) {
  const clipped = extractedText.slice(0, 20_000);
  return [
    "Extract structured candidate information from the resume text below.",
    "Return JSON matching the schema. Use empty strings or null when unknown.",
    "For experience and education, return readable plain text summaries.",
    "",
    "Resume text:",
    clipped,
  ].join("\n");
}

export const resumeAnalysisSystemPrompt =
  "You are a recruiting assistant that extracts structured candidate data from resume text. Respond with JSON only.";

export const resumeAnalysisSchemaHint = RESUME_ANALYSIS_HINT;
