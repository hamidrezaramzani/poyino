import { ChangePasswordSchema, SettingsErrorCode } from "@poyino/contracts";
import { useCallback, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  ApiRequestError,
  changePassword,
} from "../services/settings.service";

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type FieldName = keyof FormValues;
type FieldErrors = Partial<Record<FieldName, string>>;

const emptyValues: FormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function useChangePasswordForm() {
  const { t } = useI18n();
  const { push } = useToast();
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = useCallback((field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const validateAll = useCallback(() => {
    const result = ChangePasswordSchema.safeParse(values);
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
      await changePassword(parsed);
      setValues(emptyValues);
      setErrors({});
      push(t.settings.changePassword.successToast, "success");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === SettingsErrorCode.CURRENT_PASSWORD_INCORRECT) {
          setErrors((current) => ({
            ...current,
            currentPassword: t.settings.changePassword.errors.currentIncorrect,
          }));
        } else if (error.code === SettingsErrorCode.SAME_PASSWORD) {
          setErrors((current) => ({
            ...current,
            newPassword: t.settings.changePassword.errors.samePassword,
          }));
        } else if (error.code === SettingsErrorCode.TOO_MANY_REQUESTS) {
          push(t.settings.changePassword.errors.tooManyRequests, "error");
        } else {
          push(error.message || t.settings.errors.unexpected, "error");
        }
      } else {
        push(t.settings.errors.unexpected, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, push, t, validateAll]);

  return {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    submit,
  };
}

function mapValidationCode(
  code: string,
  t: ReturnType<typeof useI18n>["t"],
): string {
  switch (code) {
    case "CURRENT_PASSWORD_REQUIRED":
      return t.settings.changePassword.errors.currentRequired;
    case "PASSWORD_REQUIRED":
    case "PASSWORD_TOO_SHORT":
      return t.settings.changePassword.errors.passwordTooShort;
    case "CONFIRM_PASSWORD_REQUIRED":
    case "PASSWORDS_DO_NOT_MATCH":
      return t.settings.changePassword.errors.passwordsDoNotMatch;
    case "SAME_PASSWORD":
      return t.settings.changePassword.errors.samePassword;
    default:
      return t.settings.errors.unexpected;
  }
}
