import { useCallback, useState } from "react";
import {
  ForgotPasswordErrorCode,
  ForgotPasswordSchema,
  type ForgotPasswordInput,
} from "@poyino/contracts";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  ApiRequestError,
  requestPasswordReset,
} from "../services/authentication.service";

type FieldName = keyof ForgotPasswordInput;
type FieldErrors = Partial<Record<FieldName, string>>;

const emptyValues: ForgotPasswordInput = {
  email: "",
};

export function useForgotPasswordForm() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { push } = useToast();
  const [values, setValues] = useState<ForgotPasswordInput>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = useCallback((field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const validateField = useCallback(
    (field: FieldName, nextValue?: string) => {
      const candidateValues =
        nextValue === undefined ? values : { ...values, [field]: nextValue };
      const result = ForgotPasswordSchema.safeParse(candidateValues);
      if (result.success) {
        setErrors((current) => {
          const next = { ...current };
          delete next[field];
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
        return next;
      });
    },
    [t, values],
  );

  const validateAll = useCallback(() => {
    const result = ForgotPasswordSchema.safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }

    const nextErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (
        typeof field === "string" &&
        !(field in nextErrors) &&
        isFieldName(field)
      ) {
        nextErrors[field] = mapValidationCode(issue.message, t);
      }
    }
    setErrors(nextErrors);
    return false;
  }, [t, values]);

  const submit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await requestPasswordReset(values);
      navigate("/auth/login", {
        replace: true,
        state: { forgotPasswordSuccess: true },
      });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === ForgotPasswordErrorCode.FEATURE_DISABLED) {
          push(t.forgotPassword.betaUnavailableBody, "error");
        } else if (error.code === ForgotPasswordErrorCode.TOO_MANY_REQUESTS) {
          push(t.forgotPassword.errors.tooManyRequests, "error");
        } else if (error.details) {
          const nextErrors: FieldErrors = {};
          for (const [field, codes] of Object.entries(error.details)) {
            if (isFieldName(field) && codes?.[0]) {
              nextErrors[field] = mapValidationCode(codes[0], t);
            }
          }
          setErrors((current) => ({ ...current, ...nextErrors }));
        } else {
          push(error.message || t.forgotPassword.errors.unexpected, "error");
        }
      } else {
        push(t.forgotPassword.errors.unexpected, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, navigate, push, t, validateAll, values]);

  return {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    validateField,
    submit,
  };
}

function isFieldName(value: string): value is FieldName {
  return value === "email";
}

function mapValidationCode(
  code: string,
  t: ReturnType<typeof useI18n>["t"],
): string {
  switch (code) {
    case "EMAIL_REQUIRED":
    case "EMAIL_INVALID":
      return t.forgotPassword.errors.emailInvalid;
    default:
      return t.forgotPassword.errors.unexpected;
  }
}
