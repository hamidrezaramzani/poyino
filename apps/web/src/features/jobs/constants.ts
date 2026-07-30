import type {
  EmploymentType,
  JobDetails,
  JobTemplateSummary,
  WorkplaceType,
} from "@poyino/contracts";
import type { useI18n } from "../../shared/i18n/i18n-provider";

export const EMPLOYMENT_TYPE_OPTIONS: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
];

export const WORKPLACE_TYPE_OPTIONS: WorkplaceType[] = [
  "ON_SITE",
  "HYBRID",
  "REMOTE",
];

export const CURRENCY_OPTIONS = [
  "IRR",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "TRY",
] as const;

export type JobFormValues = {
  title: string;
  department: string;
  employmentType: EmploymentType | "";
  workplaceType: WorkplaceType | "";
  location: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  salaryVisible: "visible" | "hidden";
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  skills: string[];
  positions: string;
  expirationDate: string;
};

export type CreateJobFormValues = JobFormValues & {
  templateId: string;
  aiPrompt: string;
};

export const emptyJobFormValues: JobFormValues = {
  title: "",
  department: "",
  employmentType: "",
  workplaceType: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  currency: "IRR",
  salaryVisible: "visible",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  skills: [],
  positions: "1",
  expirationDate: "",
};

export const emptyCreateJobValues: CreateJobFormValues = {
  ...emptyJobFormValues,
  templateId: "",
  aiPrompt: "",
};

export function jobDetailsToFormValues(job: JobDetails): JobFormValues {
  return {
    title: job.title,
    department: job.department ?? "",
    employmentType: job.employmentType,
    workplaceType: job.workplaceType,
    location: job.location ?? "",
    salaryMin: job.salaryMin != null ? String(job.salaryMin) : "",
    salaryMax: job.salaryMax != null ? String(job.salaryMax) : "",
    currency: job.currency,
    salaryVisible: job.salaryVisible ? "visible" : "hidden",
    description: job.description,
    responsibilities: job.responsibilities ?? "",
    requirements: job.requirements ?? "",
    benefits: job.benefits ?? "",
    skills: [...job.skills],
    positions: String(job.positions),
    expirationDate: job.expirationDate ?? "",
  };
}

export function applyTemplateToFormValues(
  template: JobTemplateSummary,
): Pick<
  CreateJobFormValues,
  | "title"
  | "department"
  | "employmentType"
  | "workplaceType"
  | "location"
  | "salaryMin"
  | "salaryMax"
  | "currency"
  | "salaryVisible"
  | "description"
  | "responsibilities"
  | "requirements"
  | "benefits"
  | "skills"
  | "positions"
  | "templateId"
> {
  return {
    title: template.title,
    department: template.department ?? "",
    employmentType: template.employmentType,
    workplaceType: template.workplaceType,
    location: template.location ?? "",
    salaryMin: template.salaryMin != null ? String(template.salaryMin) : "",
    salaryMax: template.salaryMax != null ? String(template.salaryMax) : "",
    currency: template.currency,
    salaryVisible: template.salaryVisible ? "visible" : "hidden",
    description: template.description,
    responsibilities: template.responsibilities ?? "",
    requirements: template.requirements ?? "",
    benefits: template.benefits ?? "",
    skills: [...template.skills],
    positions: String(template.positions),
    templateId: template.id,
  };
}

export function toJobPayload(values: JobFormValues) {
  return {
    title: values.title,
    department: values.department,
    employmentType: values.employmentType || undefined,
    workplaceType: values.workplaceType || undefined,
    location: values.location,
    salaryMin: parseOptionalNumber(values.salaryMin),
    salaryMax: parseOptionalNumber(values.salaryMax),
    currency: values.currency || "IRR",
    salaryVisible: values.salaryVisible === "visible",
    description: values.description,
    responsibilities: values.responsibilities,
    requirements: values.requirements,
    benefits: values.benefits,
    skills: values.skills,
    positions: Number(values.positions),
    expirationDate: values.expirationDate || null,
  };
}

function parseOptionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function mapJobValidationCode(
  code: string,
  t: ReturnType<typeof useI18n>["t"],
): string {
  switch (code) {
    case "TITLE_REQUIRED":
      return t.jobs.create.errors.titleRequired;
    case "TITLE_TOO_SHORT":
      return t.jobs.create.errors.titleTooShort;
    case "TITLE_TOO_LONG":
      return t.jobs.create.errors.titleTooLong;
    case "DEPARTMENT_TOO_LONG":
      return t.jobs.create.errors.departmentTooLong;
    case "LOCATION_TOO_LONG":
      return t.jobs.create.errors.locationTooLong;
    case "SALARY_MIN_INVALID":
      return t.jobs.create.errors.salaryMinInvalid;
    case "SALARY_MAX_INVALID":
      return t.jobs.create.errors.salaryMaxInvalid;
    case "SALARY_RANGE_INVALID":
      return t.jobs.create.errors.salaryRangeInvalid;
    case "CURRENCY_INVALID":
      return t.jobs.create.errors.currencyInvalid;
    case "SALARY_VISIBILITY_REQUIRED":
      return t.jobs.create.errors.salaryVisibilityRequired;
    case "DESCRIPTION_REQUIRED":
      return t.jobs.create.errors.descriptionRequired;
    case "DESCRIPTION_TOO_SHORT":
      return t.jobs.create.errors.descriptionTooShort;
    case "SKILL_TOO_LONG":
      return t.jobs.create.errors.skillTooLong;
    case "SKILLS_TOO_MANY":
      return t.jobs.create.errors.skillsTooMany;
    case "POSITIONS_INVALID":
      return t.jobs.create.errors.positionsInvalid;
    case "POSITIONS_TOO_LOW":
      return t.jobs.create.errors.positionsTooLow;
    case "POSITIONS_TOO_HIGH":
      return t.jobs.create.errors.positionsTooHigh;
    case "EXPIRATION_DATE_INVALID":
      return t.jobs.create.errors.expirationDateInvalid;
    case "EXPIRATION_DATE_IN_PAST":
      return t.jobs.create.errors.expirationDateInPast;
    case "PROMPT_TOO_SHORT":
      return t.jobs.create.errors.promptTooShort;
    case "PROMPT_TOO_LONG":
      return t.jobs.create.errors.promptTooLong;
    case "EMPLOYMENT_TYPE_REQUIRED":
      return t.jobs.create.errors.employmentTypeRequired;
    case "WORKPLACE_TYPE_REQUIRED":
      return t.jobs.create.errors.workplaceTypeRequired;
    default:
      return t.jobs.create.errors.unexpected;
  }
}
