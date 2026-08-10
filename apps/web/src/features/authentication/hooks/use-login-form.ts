import { useCallback, useEffect, useState } from "react";
import { LoginErrorCode, LoginSchema, type LoginInput } from "@poyino/contracts";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppConfig } from "../../../shared/config/app-config-provider";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import { useSession } from "../../../shared/session/session-provider";
import {
  ApiRequestError,
  loginUser,
} from "../services/authentication.service";

type FieldName = keyof LoginInput;
type FieldErrors = Partial<Record<FieldName, string>>;

const emptyValues: LoginInput = {
  email: "",
  password: "",
};

export function useLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const { emailVerificationEnabled } = useAppConfig();
  const { refresh } = useSession();
  const { push } = useToast();
  const [values, setValues] = useState<LoginInput>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registrationSuccess = Boolean(
    (location.state as { registrationSuccess?: boolean } | null)
      ?.registrationSuccess,
  );
  const forgotPasswordSuccess = Boolean(
    (location.state as { forgotPasswordSuccess?: boolean } | null)
      ?.forgotPasswordSuccess,
  );
  const resetPasswordSuccess = Boolean(
    (location.state as { resetPasswordSuccess?: boolean } | null)
      ?.resetPasswordSuccess,
  );

  useEffect(() => {
    if (registrationSuccess) {
      push(
        emailVerificationEnabled
          ? t.register.successToast
          : t.register.successToastImmediate,
        "success",
      );
      navigate(location.pathname, { replace: true, state: null });
      return;
    }

    if (forgotPasswordSuccess) {
      push(t.forgotPassword.successToast, "success");
      navigate(location.pathname, { replace: true, state: null });
      return;
    }

    if (resetPasswordSuccess) {
      push(t.resetPassword.successToast, "success");
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [
    emailVerificationEnabled,
    forgotPasswordSuccess,
    location.pathname,
    navigate,
    push,
    registrationSuccess,
    resetPasswordSuccess,
    t.forgotPassword.successToast,
    t.register.successToast,
    t.register.successToastImmediate,
    t.resetPassword.successToast,
  ]);

  const setFieldValue = useCallback((field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const validateField = useCallback(
    (field: FieldName, nextValue?: string) => {
      const candidateValues =
        nextValue === undefined ? values : { ...values, [field]: nextValue };
      const result = LoginSchema.safeParse(candidateValues);
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
    const result = LoginSchema.safeParse(values);
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
      await loginUser(values);
      await refresh();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === LoginErrorCode.INVALID_CREDENTIALS) {
          push(t.login.errors.invalidCredentials, "error");
        } else if (error.code === LoginErrorCode.EMAIL_NOT_VERIFIED) {
          push(t.login.errors.emailNotVerified, "error");
        } else if (error.code === LoginErrorCode.TOO_MANY_REQUESTS) {
          push(t.login.errors.tooManyRequests, "error");
        } else if (error.details) {
          const nextErrors: FieldErrors = {};
          for (const [field, codes] of Object.entries(error.details)) {
            if (isFieldName(field) && codes?.[0]) {
              nextErrors[field] = mapValidationCode(codes[0], t);
            }
          }
          setErrors((current) => ({ ...current, ...nextErrors }));
        } else {
          push(error.message || t.login.errors.unexpected, "error");
        }
      } else {
        push(t.login.errors.unexpected, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, navigate, push, refresh, t, validateAll, values]);

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
  return value === "email" || value === "password";
}

function mapValidationCode(
  code: string,
  t: ReturnType<typeof useI18n>["t"],
): string {
  switch (code) {
    case "EMAIL_REQUIRED":
    case "EMAIL_INVALID":
      return t.login.errors.emailInvalid;
    case "PASSWORD_REQUIRED":
    case "PASSWORD_TOO_SHORT":
      return t.login.errors.passwordTooShort;
    default:
      return t.login.errors.unexpected;
  }
}
