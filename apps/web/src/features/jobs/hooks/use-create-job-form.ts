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
  mapJobValidationCode,
  toJobPayload,
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
      const result = CreateJobSchema.safeParse(toJobPayload(candidateValues));

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
          next[field] = mapJobValidationCode(issue.message, t);
        } else {
          delete next[field];
        }

        if (field === "salaryMin" || field === "salaryMax") {
          const rangeIssue = result.error.issues.find(
            (item) => item.path[0] === "salaryMax",
          );
          if (rangeIssue) {
            next.salaryMax = mapJobValidationCode(rangeIssue.message, t);
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
    const payload = toJobPayload(values);
    const result = CreateJobSchema.safeParse(payload);
    if (result.success) {
      setErrors({});
      return result.data;
    }

    const nextErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in nextErrors)) {
        nextErrors[field as FieldName] = mapJobValidationCode(issue.message, t);
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
        aiPrompt: mapJobValidationCode(code, t),
      }));
      return;
    }

    setIsGenerating(true);
    setErrors((current) => ({ ...current, aiPrompt: undefined }));
    try {
      const response = await generateJobContent(parsed.data);
      const content = response.content;
      setValues((current) => ({
        ...current,
        title: content.title,
        department: content.department ?? "",
        employmentType: content.employmentType,
        workplaceType: content.workplaceType,
        location: content.location ?? "",
        salaryMin:
          content.salaryMin != null ? String(content.salaryMin) : current.salaryMin,
        salaryMax:
          content.salaryMax != null ? String(content.salaryMax) : current.salaryMax,
        currency: content.currency || current.currency,
        salaryVisible: content.salaryVisible ? "visible" : "hidden",
        description: content.description,
        responsibilities: content.responsibilities,
        requirements: content.requirements,
        benefits: content.benefits,
        skills: content.skills?.length ? content.skills : current.skills,
        positions:
          content.positions != null
            ? String(content.positions)
            : current.positions,
      }));
      setErrors((current) => {
        const next = { ...current };
        for (const field of [
          "aiPrompt",
          "title",
          "department",
          "employmentType",
          "workplaceType",
          "location",
          "salaryMin",
          "salaryMax",
          "currency",
          "salaryVisible",
          "description",
          "responsibilities",
          "requirements",
          "benefits",
          "skills",
          "positions",
        ] as const) {
          delete next[field];
        }
        return next;
      });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === JobErrorCode.TOO_MANY_REQUESTS) {
          push(t.jobs.create.errors.tooManyRequests, "error");
        } else if (error.details?.prompt?.[0]) {
          setErrors((current) => ({
            ...current,
            aiPrompt: mapJobValidationCode(error.details!.prompt![0]!, t),
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
              nextErrors[field as FieldName] = mapJobValidationCode(codes[0], t);
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
    navigate("/jobs");
  }, [navigate]);

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
