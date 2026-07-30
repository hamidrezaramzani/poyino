import {
  CreateJobSchema,
  GenerateJobContentSchema,
  JobErrorCode,
  type JobTemplateSummary,
} from "@poyino/contracts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  areValuesEqual,
  useUnsavedChangesGuard,
} from "../../settings/hooks/use-unsaved-changes-guard";
import {
  applyTemplateToFormValues,
  emptyCreateJobValues,
  type CreateJobFormValues,
} from "../constants";
import {
  ApiRequestError,
  createJob,
  fetchJobTemplates,
  generateJobContent,
} from "../services/jobs.service";

type FieldName = keyof CreateJobFormValues;
type FieldErrors = Partial<Record<FieldName, string>>;

export function useCreateJobForm() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { push } = useToast();
  const [values, setValues] = useState<CreateJobFormValues>(emptyCreateJobValues);
  const [initialValues] = useState<CreateJobFormValues>(emptyCreateJobValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [templates, setTemplates] = useState<JobTemplateSummary[]>([]);
  const [templatesStatus, setTemplatesStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [didSucceed, setDidSucceed] = useState(false);

  const isDirty = useMemo(
    () => !areValuesEqual(values, initialValues),
    [initialValues, values],
  );
  const unsaved = useUnsavedChangesGuard(
    isDirty && !isSubmitting && !didSucceed,
  );

  const loadTemplates = useCallback(async () => {
    setTemplatesStatus("loading");
    try {
      const response = await fetchJobTemplates();
      setTemplates(response.templates);
      setTemplatesStatus("success");
    } catch {
      setTemplates([]);
      setTemplatesStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  const setFieldValue = useCallback(
    <K extends FieldName>(field: K, value: CreateJobFormValues[K]) => {
      setValues((current) => ({
        ...current,
        [field]: value,
      }));
    },
    [],
  );

  const validateField = useCallback(
    <K extends FieldName>(field: K, nextValue?: CreateJobFormValues[K]) => {
      const candidateValues =
        nextValue === undefined ? values : { ...values, [field]: nextValue };
      const result = CreateJobSchema.safeParse(
        toCreateJobPayload(candidateValues),
      );

      if (result.success) {
        setErrors((current) => {
          const next = { ...current };
          delete next[field];
          if (field === "salaryMin" || field === "salaryMax") {
            delete next.salaryMin;
            delete next.salaryMax;
          }
          return next;
        });
        return;
      }

      const issue = result.error.issues.find((item) => item.path[0] === field);
      setErrors((current) => {
        const next = { ...current };
        if (issue) {
          next[field] = mapValidationCode(issue.message, t);
        } else {
          delete next[field];
        }

        if (field === "salaryMin" || field === "salaryMax") {
          const rangeIssue = result.error.issues.find(
            (item) => item.path[0] === "salaryMax",
          );
          if (rangeIssue) {
            next.salaryMax = mapValidationCode(rangeIssue.message, t);
          } else if (field === "salaryMax" || !issue) {
            delete next.salaryMax;
          }
        }

        return next;
      });
    },
    [t, values],
  );

  const applyTemplate = useCallback(
    (templateId: string) => {
      if (!templateId) {
        setFieldValue("templateId", "");
        return;
      }

      const template = templates.find((item) => item.id === templateId);
      if (!template) {
        return;
      }

      setValues((current) => ({
        ...current,
        ...applyTemplateToFormValues(template),
        aiPrompt: current.aiPrompt,
        expirationDate: current.expirationDate,
      }));
      setErrors({});
    },
    [setFieldValue, templates],
  );

  const validateAll = useCallback(() => {
    const payload = toCreateJobPayload(values);
    const result = CreateJobSchema.safeParse(payload);
    if (result.success) {
      setErrors({});
      return result.data;
    }

    const nextErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in nextErrors)) {
        nextErrors[field as FieldName] = mapValidationCode(issue.message, t);
      }
    }
    setErrors(nextErrors);
    return null;
  }, [t, values]);

  const generate = useCallback(async () => {
    if (isGenerating || isSubmitting) {
      return;
    }

    const parsed = GenerateJobContentSchema.safeParse({
      prompt: values.aiPrompt,
    });
    if (!parsed.success) {
      const code = parsed.error.issues[0]?.message ?? "PROMPT_TOO_SHORT";
      setErrors((current) => ({
        ...current,
        aiPrompt: mapValidationCode(code, t),
      }));
      return;
    }

    setIsGenerating(true);
    setErrors((current) => ({ ...current, aiPrompt: undefined }));
    try {
      const response = await generateJobContent(parsed.data);
      setValues((current) => ({
        ...current,
        title: response.content.title,
        description: response.content.description,
        responsibilities: response.content.responsibilities,
        requirements: response.content.requirements,
        benefits: response.content.benefits,
      }));
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === JobErrorCode.TOO_MANY_REQUESTS) {
          push(t.jobs.create.errors.tooManyRequests, "error");
        } else if (error.details?.prompt?.[0]) {
          setErrors((current) => ({
            ...current,
            aiPrompt: mapValidationCode(error.details!.prompt![0]!, t),
          }));
        } else {
          push(error.message || t.jobs.create.errors.unexpected, "error");
        }
      } else {
        push(t.jobs.create.errors.unexpected, "error");
      }
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, isSubmitting, push, t, values.aiPrompt]);

  const submit = useCallback(async () => {
    if (isSubmitting || isGenerating) {
      return;
    }

    const parsed = validateAll();
    if (!parsed) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createJob(parsed);
      setDidSucceed(true);
      push(t.jobs.create.successToast, "success");
      navigate(`/jobs/${response.id}`, { replace: true });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === JobErrorCode.TOO_MANY_REQUESTS) {
          push(t.jobs.create.errors.tooManyRequests, "error");
        } else if (error.details) {
          const nextErrors: FieldErrors = {};
          for (const [field, codes] of Object.entries(error.details)) {
            if (codes?.[0]) {
              nextErrors[field as FieldName] = mapValidationCode(codes[0], t);
            }
          }
          setErrors((current) => ({ ...current, ...nextErrors }));
        } else {
          push(error.message || t.jobs.create.errors.unexpected, "error");
        }
      } else {
        push(t.jobs.create.errors.unexpected, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isGenerating, isSubmitting, navigate, push, t, validateAll]);

  const cancel = useCallback(() => {
    if (isDirty) {
      // Trigger the same confirmation UX via navigation blocker when leaving.
      navigate("/jobs");
      return;
    }
    navigate("/jobs");
  }, [isDirty, navigate]);

  return {
    values,
    errors,
    templates,
    templatesStatus,
    isSubmitting,
    isGenerating,
    isDirty,
    unsaved,
    setFieldValue,
    validateField,
    applyTemplate,
    generate,
    submit,
    cancel,
  };
}

function toCreateJobPayload(values: CreateJobFormValues) {
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

function mapValidationCode(
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
