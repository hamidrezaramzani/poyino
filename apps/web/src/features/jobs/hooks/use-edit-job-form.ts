import {
  JobErrorCode,
  UpdateJobSchema,
  type DepartmentSummary,
} from "@poyino/contracts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import { listDepartments } from "../../organization/services/organization.service";
import {
  areValuesEqual,
  useUnsavedChangesGuard,
} from "../../settings/hooks/use-unsaved-changes-guard";
import {
  emptyJobFormValues,
  jobDetailsToFormValues,
  mapJobValidationCode,
  toJobPayload,
  type JobFormValues,
} from "../constants";
import {
  ApiRequestError,
  fetchJob,
  updateJob,
} from "../services/jobs.service";

type FieldName = keyof JobFormValues;
type FieldErrors = Partial<Record<FieldName, string>>;

export function useEditJobForm() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { jobId = "" } = useParams<{ jobId: string }>();
  const { push } = useToast();
  const [values, setValues] = useState<JobFormValues>(emptyJobFormValues);
  const [initialValues, setInitialValues] =
    useState<JobFormValues>(emptyJobFormValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [loadStatus, setLoadStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSucceed, setDidSucceed] = useState(false);

  const isDirty = useMemo(
    () => !areValuesEqual(values, initialValues),
    [initialValues, values],
  );
  const unsaved = useUnsavedChangesGuard(
    isDirty && !isSubmitting && !didSucceed,
  );

  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        value: department.id,
        label: department.name,
      })),
    [departments],
  );

  const load = useCallback(async () => {
    if (!jobId) {
      setNotFound(true);
      setLoadStatus("error");
      return;
    }

    setLoadStatus("loading");
    setNotFound(false);
    try {
      const [response, departmentItems] = await Promise.all([
        fetchJob(jobId),
        listDepartments().catch(() => [] as DepartmentSummary[]),
      ]);
      setDepartments(departmentItems);
      const next = jobDetailsToFormValues(response.job);
      setValues(next);
      setInitialValues(next);
      setErrors({});
      setLoadStatus("success");
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        (error.status === 404 || error.code === JobErrorCode.JOB_NOT_FOUND)
      ) {
        setNotFound(true);
      }
      setLoadStatus("error");
    }
  }, [jobId]);

  useEffect(() => {
    void load();
  }, [load]);

  const setFieldValue = useCallback(
    <K extends FieldName>(field: K, value: JobFormValues[K]) => {
      setValues((current) => ({
        ...current,
        [field]: value,
      }));
    },
    [],
  );

  const validateField = useCallback(
    <K extends FieldName>(field: K, nextValue?: JobFormValues[K]) => {
      const candidateValues =
        nextValue === undefined ? values : { ...values, [field]: nextValue };
      const result = UpdateJobSchema.safeParse(toJobPayload(candidateValues));

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

  const validateAll = useCallback(() => {
    const result = UpdateJobSchema.safeParse(toJobPayload(values));
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

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const submit = useCallback(async () => {
    if (isSubmitting || !jobId) {
      return;
    }

    const parsed = validateAll();
    if (!parsed) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateJob(jobId, parsed);
      setDidSucceed(true);
      push(t.jobs.edit.successToast, "success");
      navigate(`/jobs/${jobId}`, { replace: true });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === JobErrorCode.TOO_MANY_REQUESTS) {
          push(t.jobs.create.errors.tooManyRequests, "error");
        } else if (
          error.status === 404 ||
          error.code === JobErrorCode.JOB_NOT_FOUND
        ) {
          push(t.jobs.details.notFound, "error");
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
  }, [isSubmitting, jobId, navigate, push, t, validateAll]);

  const cancel = useCallback(() => {
    navigate(jobId ? `/jobs/${jobId}` : "/jobs");
  }, [jobId, navigate]);

  return {
    jobId,
    values,
    errors,
    departments,
    departmentOptions,
    loadStatus,
    notFound,
    isSubmitting,
    isDirty,
    unsaved,
    setFieldValue,
    validateField,
    reset,
    submit,
    cancel,
    retry: load,
  };
}
