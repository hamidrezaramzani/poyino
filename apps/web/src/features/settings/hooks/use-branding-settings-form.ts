import {
  BrandingSettingsSchema,
  type BrandingSettingsData,
} from "@poyino/contracts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useOrganizationBranding } from "../../../shared/branding/organization-branding-provider";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "../constants";
import {
  ApiRequestError,
  fetchBrandingSettings,
  resolveAuthenticatedImageUrl,
  updateBrandingSettings,
  uploadSettingsFile,
} from "../services/settings.service";
import {
  areValuesEqual,
  useUnsavedChangesGuard,
} from "./use-unsaved-changes-guard";

type FormValues = {
  logoId: string | null;
  darkLogoId: string | null;
  primaryColor: string;
  secondaryColor: string;
};

type FieldErrors = Partial<
  Record<"logoId" | "darkLogoId" | "primaryColor" | "secondaryColor", string>
>;

const emptyValues: FormValues = {
  logoId: null,
  darkLogoId: null,
  primaryColor: "#150578",
  secondaryColor: "#3943B7",
};

function toFormValues(data: BrandingSettingsData): FormValues {
  return {
    logoId: data.logoId,
    darkLogoId: data.darkLogoId,
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor,
  };
}

export function useBrandingSettingsForm() {
  const { t } = useI18n();
  const { push } = useToast();
  const { refresh: refreshBranding } = useOrganizationBranding();
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [initialValues, setInitialValues] = useState<FormValues>(emptyValues);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [darkLogoPreviewUrl, setDarkLogoPreviewUrl] = useState<string | null>(
    null,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loadStatus, setLoadStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<
    "logoId" | "darkLogoId" | null
  >(null);

  const isDirty = useMemo(
    () => !areValuesEqual(values, initialValues),
    [initialValues, values],
  );
  const unsaved = useUnsavedChangesGuard(isDirty && !isSubmitting);

  const load = useCallback(async () => {
    setLoadStatus("loading");
    try {
      const response = await fetchBrandingSettings();
      if (!response.settings) {
        throw new Error("Missing settings");
      }
      const next = toFormValues(response.settings);
      setValues(next);
      setInitialValues(next);
      const [logo, darkLogo] = await Promise.all([
        resolveAuthenticatedImageUrl(response.settings.logoUrl),
        resolveAuthenticatedImageUrl(response.settings.darkLogoUrl),
      ]);
      setLogoPreviewUrl(logo);
      setDarkLogoPreviewUrl(darkLogo);
      setErrors({});
      setLoadStatus("success");
    } catch {
      setLoadStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setColor = useCallback(
    (field: "primaryColor" | "secondaryColor", value: string) => {
      setValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const uploadLogo = useCallback(
    async (field: "logoId" | "darkLogoId", file: File) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setErrors((current) => ({
          ...current,
          [field]: t.settings.errors.fileInvalidType,
        }));
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setErrors((current) => ({
          ...current,
          [field]: t.settings.errors.fileTooLarge,
        }));
        return;
      }

      setUploadingField(field);
      try {
        const response = await uploadSettingsFile(file);
        setValues((current) => ({ ...current, [field]: response.file.id }));
        const preview = URL.createObjectURL(file);
        if (field === "logoId") {
          setLogoPreviewUrl(preview);
        } else {
          setDarkLogoPreviewUrl(preview);
        }
        setErrors((current) => {
          const next = { ...current };
          delete next[field];
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
        setUploadingField(null);
      }
    },
    [push, t],
  );

  const removeLogo = useCallback((field: "logoId" | "darkLogoId") => {
    setValues((current) => ({ ...current, [field]: null }));
    if (field === "logoId") {
      setLogoPreviewUrl(null);
    } else {
      setDarkLogoPreviewUrl(null);
    }
  }, []);

  const validateAll = useCallback(() => {
    const result = BrandingSettingsSchema.safeParse(values);
    if (result.success) {
      setErrors({});
      return result.data;
    }

    const nextErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in nextErrors)) {
        nextErrors[field as keyof FieldErrors] = mapValidationCode(
          issue.message,
          t,
        );
      }
    }
    setErrors(nextErrors);
    return null;
  }, [t, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    void Promise.all([
      resolveAuthenticatedImageUrl(
        initialValues.logoId ? `/settings/files/${initialValues.logoId}` : null,
      ),
      resolveAuthenticatedImageUrl(
        initialValues.darkLogoId
          ? `/settings/files/${initialValues.darkLogoId}`
          : null,
      ),
    ]).then(([logo, darkLogo]) => {
      setLogoPreviewUrl(logo);
      setDarkLogoPreviewUrl(darkLogo);
    });
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
      const response = await updateBrandingSettings({
        logoId: parsed.logoId ?? null,
        darkLogoId: parsed.darkLogoId ?? null,
        primaryColor: parsed.primaryColor,
        secondaryColor: parsed.secondaryColor,
      });

      if (response.settings) {
        const next = toFormValues(response.settings);
        setValues(next);
        setInitialValues(next);
        document.documentElement.style.setProperty(
          "--ui-primary",
          next.primaryColor,
        );
        document.documentElement.style.setProperty(
          "--ui-accent",
          next.secondaryColor,
        );
      }

      await refreshBranding();
      push(t.settings.branding.successToast, "success");
    } catch (error) {
      push(
        error instanceof ApiRequestError
          ? error.message || t.settings.errors.unexpected
          : t.settings.errors.unexpected,
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, push, refreshBranding, t, validateAll]);

  return {
    values,
    errors,
    logoPreviewUrl,
    darkLogoPreviewUrl,
    loadStatus,
    isSubmitting,
    uploadingField,
    isDirty,
    unsaved,
    setColor,
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
    case "PRIMARY_COLOR_INVALID":
      return t.settings.errors.primaryColorInvalid;
    case "SECONDARY_COLOR_INVALID":
      return t.settings.errors.secondaryColorInvalid;
    default:
      return t.settings.errors.unexpected;
  }
}
