import type {
  EmploymentType,
  JobTemplateSummary,
  WorkplaceType,
} from "@poyino/contracts";

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

export type CreateJobFormValues = {
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
  templateId: string;
  aiPrompt: string;
};

export const emptyCreateJobValues: CreateJobFormValues = {
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
  templateId: "",
  aiPrompt: "",
};

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
