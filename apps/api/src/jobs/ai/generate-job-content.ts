import { z } from "zod";

const EmploymentTypeValues = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
] as const;

const WorkplaceTypeValues = ["ON_SITE", "HYBRID", "REMOTE"] as const;

const CurrencyValues = ["IRR", "USD", "EUR", "GBP", "AED", "TRY"] as const;

type EmploymentType = (typeof EmploymentTypeValues)[number];
type WorkplaceType = (typeof WorkplaceTypeValues)[number];
type Currency = (typeof CurrencyValues)[number];

const EMPLOYMENT_ALIASES: Record<string, EmploymentType> = {
  FULL_TIME: "FULL_TIME",
  FULLTIME: "FULL_TIME",
  "FULL-TIME": "FULL_TIME",
  FULL: "FULL_TIME",
  PART_TIME: "PART_TIME",
  PARTTIME: "PART_TIME",
  "PART-TIME": "PART_TIME",
  CONTRACT: "CONTRACT",
  CONTRACTOR: "CONTRACT",
  INTERNSHIP: "INTERNSHIP",
  INTERN: "INTERNSHIP",
  TEMPORARY: "TEMPORARY",
  TEMP: "TEMPORARY",
};

const WORKPLACE_ALIASES: Record<string, WorkplaceType> = {
  ON_SITE: "ON_SITE",
  ONSITE: "ON_SITE",
  "ON-SITE": "ON_SITE",
  OFFICE: "ON_SITE",
  HYBRID: "HYBRID",
  REMOTE: "REMOTE",
  WFH: "REMOTE",
};

const CURRENCY_ALIASES: Record<string, Currency> = {
  IRR: "IRR",
  RIAL: "IRR",
  RIALS: "IRR",
  TOMAN: "IRR",
  TOMANS: "IRR",
  IRT: "IRR",
  USD: "USD",
  DOLLAR: "USD",
  DOLLARS: "USD",
  EUR: "EUR",
  EURO: "EUR",
  EUROS: "EUR",
  GBP: "GBP",
  POUND: "GBP",
  AED: "AED",
  DIRHAM: "AED",
  TRY: "TRY",
  TL: "TRY",
  LIRA: "TRY",
};

function asTrimmedString(value: unknown): string | null {
  if (value == null) {
    return null;
  }
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function normalizeEnumKey(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function normalizeEmploymentType(value: unknown): EmploymentType {
  const key = normalizeEnumKey(value);
  return EMPLOYMENT_ALIASES[key] ?? "FULL_TIME";
}

function normalizeWorkplaceType(value: unknown): WorkplaceType {
  const key = normalizeEnumKey(value);
  return WORKPLACE_ALIASES[key] ?? "HYBRID";
}

function normalizeCurrency(value: unknown): Currency {
  const key = normalizeEnumKey(value).replace(/[^A-Z]/g, "");
  return CURRENCY_ALIASES[key] ?? "IRR";
}

function normalizeSalary(value: unknown): number | null {
  if (value == null || value === "") {
    return null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }
  const cleaned = String(value).replace(/[^\d.]/g, "");
  if (!cleaned) {
    return null;
  }
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : null;
}

function normalizeBoolean(value: unknown, fallback = true): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  const text = String(value ?? "")
    .trim()
    .toLowerCase();
  if (["true", "1", "yes", "visible", "show"].includes(text)) {
    return true;
  }
  if (["false", "0", "no", "hidden", "hide"].includes(text)) {
    return false;
  }
  return fallback;
}

function normalizeSkills(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0)
      .slice(0, 20)
      .map((item) => item.slice(0, 80));
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[,،|/]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .slice(0, 20)
      .map((item) => item.slice(0, 80));
  }
  return [];
}

function normalizeHtml(value: unknown, fallback: string): string {
  const text = asTrimmedString(value);
  return text ?? fallback;
}

function ensureMinLength(value: string, min: number, pad: string): string {
  if (value.length >= min) {
    return value;
  }
  return `${value}${pad}`.slice(0, Math.max(min, value.length));
}

/** Normalize messy model JSON into a stable shape before Zod validation. */
export function normalizeGeneratedJobContent(raw: unknown): unknown {
  const input =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  let salaryMin = normalizeSalary(input.salaryMin);
  let salaryMax = normalizeSalary(input.salaryMax);
  if (salaryMin != null && salaryMax != null && salaryMax < salaryMin) {
    [salaryMin, salaryMax] = [salaryMax, salaryMin];
  }

  const title =
    asTrimmedString(input.title)?.slice(0, 100) || "Untitled Role";
  const description = ensureMinLength(
    normalizeHtml(input.description, `<p>${title}</p>`),
    50,
    " Role details will be refined by the hiring team.",
  );

  const positionsRaw = Number(input.positions);
  const positions =
    Number.isFinite(positionsRaw) && positionsRaw >= 1
      ? Math.min(999, Math.round(positionsRaw))
      : 1;

  return {
    title: title.length >= 3 ? title : `${title} Role`.slice(0, 100),
    department: asTrimmedString(input.department)?.slice(0, 80) ?? null,
    employmentType: normalizeEmploymentType(input.employmentType),
    workplaceType: normalizeWorkplaceType(input.workplaceType),
    location: asTrimmedString(input.location)?.slice(0, 120) ?? null,
    salaryMin,
    salaryMax,
    currency: normalizeCurrency(input.currency),
    salaryVisible: normalizeBoolean(input.salaryVisible, true),
    description,
    responsibilities: normalizeHtml(
      input.responsibilities,
      "<ul><li>Deliver assigned responsibilities.</li></ul>",
    ),
    requirements: normalizeHtml(
      input.requirements,
      "<ul><li>Relevant experience required.</li></ul>",
    ),
    benefits: normalizeHtml(
      input.benefits,
      "<ul><li>Competitive benefits package.</li></ul>",
    ),
    skills: normalizeSkills(input.skills),
    positions,
  };
}

export const GeneratedJobContentSchema = z.object({
  title: z.string().min(3).max(100),
  department: z.string().max(80).nullable(),
  employmentType: z.enum(EmploymentTypeValues),
  workplaceType: z.enum(WorkplaceTypeValues),
  location: z.string().max(120).nullable(),
  salaryMin: z.number().int().nonnegative().nullable(),
  salaryMax: z.number().int().nonnegative().nullable(),
  currency: z.enum(CurrencyValues),
  salaryVisible: z.boolean(),
  description: z.string().min(50),
  responsibilities: z.string().min(1),
  requirements: z.string().min(1),
  benefits: z.string().min(1),
  skills: z.array(z.string().min(1).max(80)).max(20),
  positions: z.number().int().min(1).max(999),
});

export type GeneratedJobContent = z.infer<typeof GeneratedJobContentSchema>;

export const JOB_CONTENT_SCHEMA_HINT = [
  "{",
  '"title":"string",',
  '"department":"string|null",',
  '"employmentType":"FULL_TIME|PART_TIME|CONTRACT|INTERNSHIP|TEMPORARY",',
  '"workplaceType":"ON_SITE|HYBRID|REMOTE",',
  '"location":"string|null",',
  '"salaryMin":number|null,',
  '"salaryMax":number|null,',
  '"currency":"IRR|USD|EUR|GBP|AED|TRY",',
  '"salaryVisible":true,',
  '"description":"html",',
  '"responsibilities":"html",',
  '"requirements":"html",',
  '"benefits":"html",',
  '"skills":["React","TypeScript"],',
  '"positions":1',
  "}",
].join("");

export const JOB_CONTENT_SYSTEM_PROMPT = [
  "Return one complete JSON object for a job posting.",
  "Always include every key in the shape.",
  "Enums must be exact uppercase values.",
  "Use short HTML only (<p>, <ul>, <li>).",
  "3 bullets max per list. description 1 short paragraph.",
  "Estimate salaryMin/salaryMax as integers when unknown (IRR for Persian briefs).",
  "skills must be a JSON array of strings.",
  "Match brief language. No markdown fences.",
].join(" ");

export function buildJobContentUserPrompt(brief: string) {
  return brief.trim();
}
