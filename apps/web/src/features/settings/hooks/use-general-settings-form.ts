import {
  GeneralSettingsSchema,
  SettingsErrorCode,
  type GeneralSettingsData,
} from "@poyino/contracts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import { useSession } from "../../../shared/session/session-provider";
import {
  ApiRequestError,
  fetchGeneralSettings,
  updateGeneralSettings,
} from "../services/settings.service";
import {
  areValuesEqual,
  useUnsavedChangesGuard,
} from "./use-unsaved-changes-guard";

type FormValues = {
  organizationName: string;
  displayName: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  country: string;
  city: string;
  timezone: string;
  language: "fa" | "en";
};

type FieldName = keyof FormValues;
type FieldErrors = Partial<Record<FieldName, string>>;

const emptyValues: FormValues = {
  organizationName: "",
  displayName: "",
  description: "",
  email: "",
  phone: "",
  website: "",
  country: "",
  city: "",
  timezone: "Asia/Tehran",
  language: "fa",
};

function toFormValues(data: GeneralSettingsData): FormValues {
  return {
    organizationName: data.organizationName,
    displayName: data.displayName ?? "",
    description: data.description ?? "",
    email: data.email,
    phone: data.phone ?? "",
    website: data.website ?? "",
    country: data.country ?? "",
    city: data.city ?? "",
    timezone: data.timezone,
    language: data.language,
  };
}

export function useGeneralSettingsForm() {
  const { t, setLocale } = useI18n();
  const { refresh } = useSession();
  const { push } = useToast();
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [initialValues, setInitialValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loadStatus, setLoadStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = useMemo(
    () => !areValuesEqual(values, initialValues),
    [initialValues, values],
  );
  const unsaved = useUnsavedChangesGuard(isDirty && !isSubmitting);

  const load = useCallback(async () => {
    setLoadStatus("loading");
    try {
      const response = await fetchGeneralSettings();
      if (!response.settings) {
        throw new Error("Missing settings");
      }
      const next = toFormValues(response.settings);
      setValues(next);
      setInitialValues(next);
      setErrors({});
      setLoadStatus("success");
    } catch {
      setLoadStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setFieldValue = useCallback((field: FieldName, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: field === "language" ? (value as "fa" | "en") : value,
    }));
  }, []);

  const validateAll = useCallback(() => {
    const result = GeneralSettingsSchema.safeParse(values);
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

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const submit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    const parsed = validateAll();
    if (!parsed) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateGeneralSettings({
        organizationName: parsed.organizationName,
        displayName: parsed.displayName ?? "",
        description: parsed.description ?? "",
        email: parsed.email,
        phone: parsed.phone ?? "",
        website: parsed.website ?? "",
        country: parsed.country ?? "",
        city: parsed.city ?? "",
        timezone: parsed.timezone,
        language: parsed.language,
      });

      if (response.settings) {
        const next = toFormValues(response.settings);
        setValues(next);
        setInitialValues(next);
        setLocale(next.language);
      }

      await refresh();
      push(t.settings.general.successToast, "success");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === SettingsErrorCode.EMAIL_EXISTS) {
          setErrors((current) => ({
            ...current,
            email: t.settings.errors.emailExists,
          }));
        } else if (error.details) {
          const nextErrors: FieldErrors = {};
          for (const [field, codes] of Object.entries(error.details)) {
            if (codes?.[0]) {
              nextErrors[field as FieldName] = mapValidationCode(codes[0], t);
            }
          }
          setErrors((current) => ({ ...current, ...nextErrors }));
        } else {
          push(error.message || t.settings.errors.unexpected, "error");
        }
      } else {
        push(t.settings.errors.unexpected, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, push, refresh, setLocale, t, validateAll]);

  return {
    values,
    errors,
    loadStatus,
    isSubmitting,
    isDirty,
    unsaved,
    setFieldValue,
    reset,
    submit,
    retry: load,
  };
}

function mapValidationCode(
  code: string,
  t: ReturnType<typeof useI18n>["t"],
): string {
  switch (code) {
    case "ORGANIZATION_NAME_REQUIRED":
      return t.settings.errors.organizationNameRequired;
    case "ORGANIZATION_NAME_TOO_SHORT":
      return t.settings.errors.organizationNameTooShort;
    case "ORGANIZATION_NAME_TOO_LONG":
      return t.settings.errors.organizationNameTooLong;
    case "DISPLAY_NAME_TOO_LONG":
      return t.settings.errors.displayNameTooLong;
    case "DESCRIPTION_TOO_LONG":
      return t.settings.errors.descriptionTooLong;
    case "EMAIL_REQUIRED":
    case "EMAIL_INVALID":
      return t.settings.errors.emailInvalid;
    case "PHONE_TOO_LONG":
      return t.settings.errors.phoneTooLong;
    case "WEBSITE_INVALID":
      return t.settings.errors.websiteInvalid;
    case "TIMEZONE_REQUIRED":
    case "TIMEZONE_INVALID":
      return t.settings.errors.timezoneRequired;
    case "LANGUAGE_REQUIRED":
      return t.settings.errors.languageRequired;
    default:
      return t.settings.errors.unexpected;
  }
}
