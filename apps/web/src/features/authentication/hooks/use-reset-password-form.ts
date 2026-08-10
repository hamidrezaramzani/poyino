import { useCallback, useEffect, useState } from "react";
import {
  ResetPasswordErrorCode,
  ResetPasswordSchema,
  type ResetPasswordInput,
} from "@poyino/contracts";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  ApiRequestError,
  resetPassword,
  validateResetToken,
} from "../services/authentication.service";

type FieldName = "password" | "confirmPassword";
type FieldErrors = Partial<Record<FieldName, string>>;
type TokenStatus = "checking" | "valid" | "invalid" | "expired" | "missing";

const emptyValues = {
  password: "",
  confirmPassword: "",
};

export function useResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const { t } = useI18n();
  const { push } = useToast();
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>(
    token ? "checking" : "missing",
  );

  useEffect(() => {
    if (!token) {
      setTokenStatus("missing");
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        await validateResetToken(token);
        if (!cancelled) {
          setTokenStatus("valid");
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (
          error instanceof ApiRequestError &&
          error.code === ResetPasswordErrorCode.EXPIRED_TOKEN
        ) {
          setTokenStatus("expired");
          return;
        }

        setTokenStatus("invalid");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const setFieldValue = useCallback((field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const buildPayload = useCallback(
    (nextValues = values): ResetPasswordInput => ({
      token,
      password: nextValues.password,
      confirmPassword: nextValues.confirmPassword,
    }),
    [token, values],
  );

  const validateField = useCallback(
    (field: FieldName, nextValue?: string) => {
      const candidateValues =
        nextValue === undefined ? values : { ...values, [field]: nextValue };
      const result = ResetPasswordSchema.safeParse(buildPayload(candidateValues));
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
    [buildPayload, t, values],
  );

  const validateAll = useCallback(() => {
    const result = ResetPasswordSchema.safeParse(buildPayload());
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
  }, [buildPayload, t]);

  const submit = useCallback(async () => {
    if (isSubmitting || tokenStatus !== "valid") {
      return;
    }

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(buildPayload());
      navigate("/auth/login", {
        replace: true,
        state: { resetPasswordSuccess: true },
      });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === ResetPasswordErrorCode.FEATURE_DISABLED) {
          push(t.resetPassword.betaUnavailableBody, "error");
        } else if (error.code === ResetPasswordErrorCode.INVALID_TOKEN) {
          setTokenStatus("invalid");
        } else if (error.code === ResetPasswordErrorCode.EXPIRED_TOKEN) {
          setTokenStatus("expired");
        } else if (error.code === ResetPasswordErrorCode.TOO_MANY_REQUESTS) {
          push(t.resetPassword.errors.tooManyRequests, "error");
        } else if (error.details) {
          const nextErrors: FieldErrors = {};
          for (const [field, codes] of Object.entries(error.details)) {
            if (isFieldName(field) && codes?.[0]) {
              nextErrors[field] = mapValidationCode(codes[0], t);
            }
          }
          setErrors((current) => ({ ...current, ...nextErrors }));
        } else {
          push(error.message || t.resetPassword.errors.unexpected, "error");
        }
      } else {
        push(t.resetPassword.errors.unexpected, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    buildPayload,
    isSubmitting,
    navigate,
    push,
    t,
    tokenStatus,
    validateAll,
  ]);

  return {
    values,
    errors,
    isSubmitting,
    tokenStatus,
    setFieldValue,
    validateField,
    submit,
  };
}

function isFieldName(value: string): value is FieldName {
  return value === "password" || value === "confirmPassword";
}

function mapValidationCode(
  code: string,
  t: ReturnType<typeof useI18n>["t"],
): string {
  switch (code) {
    case "PASSWORD_REQUIRED":
    case "PASSWORD_TOO_SHORT":
      return t.resetPassword.errors.passwordTooShort;
    case "CONFIRM_PASSWORD_REQUIRED":
    case "PASSWORDS_DO_NOT_MATCH":
      return t.resetPassword.errors.passwordsDoNotMatch;
    default:
      return t.resetPassword.errors.unexpected;
  }
}
