import type { NotificationSettingsData } from "@poyino/contracts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  ApiRequestError,
  fetchNotificationSettings,
  updateNotificationSettings,
} from "../services/settings.service";
import {
  areValuesEqual,
  useUnsavedChangesGuard,
} from "./use-unsaved-changes-guard";

type FormValues = NotificationSettingsData;

const emptyValues: FormValues = {
  newCandidateEmail: true,
  candidateStatusEmail: false,
  interviewReminderEmail: true,
  jobExpirationEmail: true,
  jobPublishedEmail: false,
};

export function useNotificationSettingsForm() {
  const { t } = useI18n();
  const { push } = useToast();
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [initialValues, setInitialValues] = useState<FormValues>(emptyValues);
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
      const response = await fetchNotificationSettings();
      if (!response.settings) {
        throw new Error("Missing settings");
      }
      setValues(response.settings);
      setInitialValues(response.settings);
      setLoadStatus("success");
    } catch {
      setLoadStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setToggle = useCallback((field: keyof FormValues, value: boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const submit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateNotificationSettings(values);
      if (response.settings) {
        setValues(response.settings);
        setInitialValues(response.settings);
      }
      push(t.settings.notifications.successToast, "success");
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
  }, [isSubmitting, push, t, values]);

  return {
    values,
    loadStatus,
    isSubmitting,
    isDirty,
    unsaved,
    setToggle,
    reset,
    submit,
    retry: load,
  };
}
