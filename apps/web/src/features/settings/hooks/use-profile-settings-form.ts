import {
  ProfileSettingsSchema,
  SettingsErrorCode,
  type ProfileSettingsData,
} from "@poyino/contracts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useOrganizationBranding } from "../../../shared/branding/organization-branding-provider";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import { useSession } from "../../../shared/session/session-provider";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "../constants";
import {
  ApiRequestError,
  fetchProfileSettings,
  resolveAuthenticatedImageUrl,
  updateProfileSettings,
  uploadSettingsFile,
} from "../services/settings.service";
import {
  areValuesEqual,
  useUnsavedChangesGuard,
} from "./use-unsaved-changes-guard";

type FormValues = {
  organizationName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  logoId: string | null;
};

type FieldName = keyof FormValues;
type FieldErrors = Partial<Record<FieldName | "logoId", string>>;

const emptyValues: FormValues = {
  organizationName: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  logoId: null,
};

function toFormValues(data: ProfileSettingsData): FormValues {
  return {
    organizationName: data.organizationName,
    email: data.email,
    phone: data.phone ?? "",
    website: data.website ?? "",
    address: data.address ?? "",
    logoId: data.logoId,
  };
}

export function useProfileSettingsForm() {
  const { t } = useI18n();
  const { refresh } = useSession();
  const { refresh: refreshBranding } = useOrganizationBranding();
  const { push } = useToast();
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [initialValues, setInitialValues] = useState<FormValues>(emptyValues);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loadStatus, setLoadStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isDirty = useMemo(
    () => !areValuesEqual(values, initialValues),
    [initialValues, values],
  );
  const unsaved = useUnsavedChangesGuard(isDirty && !isSubmitting);

  const load = useCallback(async () => {
    setLoadStatus("loading");
    try {
      const response = await fetchProfileSettings();
      if (!response.settings) {
        throw new Error("Missing settings");
      }
      const next = toFormValues(response.settings);
      setValues(next);
      setInitialValues(next);
      const preview = await resolveAuthenticatedImageUrl(response.settings.logoUrl);
      setLogoPreviewUrl(preview);
      setErrors({});
      setLoadStatus("success");
    } catch {
      setLoadStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setFieldValue = useCallback((field: FieldName, value: string | null) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const uploadLogo = useCallback(
    async (file: File) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setErrors((current) => ({
          ...current,
          logoId: t.settings.errors.fileInvalidType,
        }));
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setErrors((current) => ({
          ...current,
          logoId: t.settings.errors.fileTooLarge,
        }));
        return;
      }

      setIsUploading(true);
      try {
        const response = await uploadSettingsFile(file);
        setValues((current) => ({ ...current, logoId: response.file.id }));
        setLogoPreviewUrl(URL.createObjectURL(file));
        setErrors((current) => {
          const next = { ...current };
          delete next.logoId;
          return next;
        });
      } catch (error) {
        push(
          error instanceof ApiRequestError
            ? error.message || t.settings.errors.unexpected
            : t.settings.errors.unexpected,
          "error",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [push, t],
  );

  const removeLogo = useCallback(() => {
    setValues((current) => ({ ...current, logoId: null }));
    setLogoPreviewUrl(null);
  }, []);

  const validateAll = useCallback(() => {
    const result = ProfileSettingsSchema.safeParse(values);
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
    void resolveAuthenticatedImageUrl(
      initialValues.logoId
        ? `/settings/files/${initialValues.logoId}`
        : null,
    ).then(setLogoPreviewUrl);
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
      const response = await updateProfileSettings({
        organizationName: parsed.organizationName,
        email: parsed.email,
        phone: parsed.phone ?? "",
        website: parsed.website ?? "",
        address: parsed.address ?? "",
        logoId: parsed.logoId ?? null,
      });

      if (response.settings) {
        const next = toFormValues(response.settings);
        setValues(next);
        setInitialValues(next);
        const preview = await resolveAuthenticatedImageUrl(
          response.settings.logoUrl,
        );
        setLogoPreviewUrl(preview);
      }

      await refresh();
      await refreshBranding();
      push(t.settings.profile.successToast, "success");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === SettingsErrorCode.EMAIL_EXISTS) {
          setErrors((current) => ({
            ...current,
            email: t.settings.errors.emailExists,
          }));
        } else {
          push(error.message || t.settings.errors.unexpected, "error");
        }
      } else {
        push(t.settings.errors.unexpected, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, push, refresh, refreshBranding, t, validateAll]);

  return {
    values,
    errors,
    logoPreviewUrl,
    loadStatus,
    isSubmitting,
    isUploading,
    isDirty,
    unsaved,
    setFieldValue,
    uploadLogo,
    removeLogo,
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
    case "EMAIL_REQUIRED":
    case "EMAIL_INVALID":
      return t.settings.errors.emailInvalid;
    case "PHONE_TOO_LONG":
      return t.settings.errors.phoneTooLong;
    case "WEBSITE_INVALID":
      return t.settings.errors.websiteInvalid;
    case "ADDRESS_TOO_LONG":
      return t.settings.errors.addressTooLong;
    default:
      return t.settings.errors.unexpected;
  }
}
