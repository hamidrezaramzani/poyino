import { useCallback, useState } from "react";
import { RegisterSchema, type RegisterInput } from "@poyino/contracts";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  ApiRequestError,
  registerOrganization,
} from "../services/authentication.service";

type FieldName = keyof RegisterInput;
type FieldErrors = Partial<Record<FieldName, string>>;

const emptyValues: RegisterInput = {
  organizationName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function useRegisterForm() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { push } = useToast();
  const [values, setValues] = useState<RegisterInput>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = useCallback((field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const validateField = useCallback(
    (field: FieldName, nextValue?: string) => {
      const candidateValues =
        nextValue === undefined ? values : { ...values, [field]: nextValue };
      const result = RegisterSchema.safeParse(candidateValues);
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
    const result = RegisterSchema.safeParse(values);
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
      await registerOrganization(values);
      navigate("/auth/login", {
        replace: true,
        state: { registrationSuccess: true },
      });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === "EMAIL_ALREADY_EXISTS") {
          setErrors((current) => ({
            ...current,
            email: t.register.errors.emailExists,
          }));
        } else if (error.details) {
          const nextErrors: FieldErrors = {};
          for (const [field, codes] of Object.entries(error.details)) {
            if (isFieldName(field) && codes?.[0]) {
              nextErrors[field] = mapValidationCode(codes[0], t);
            }
          }
          setErrors((current) => ({ ...current, ...nextErrors }));
        } else {
          push(t.register.errors.unexpected, "error");
        }
      } else {
        push(t.register.errors.unexpected, "error");
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
  return (
    value === "organizationName" ||
    value === "email" ||
    value === "password" ||
    value === "confirmPassword"
  );
}

function mapValidationCode(
  code: string,
  t: ReturnType<typeof useI18n>["t"],
): string {
  switch (code) {
    case "ORGANIZATION_NAME_REQUIRED":
      return t.register.errors.organizationNameRequired;
    case "ORGANIZATION_NAME_TOO_SHORT":
      return t.register.errors.organizationNameTooShort;
    case "ORGANIZATION_NAME_TOO_LONG":
      return t.register.errors.organizationNameTooLong;
    case "EMAIL_REQUIRED":
    case "EMAIL_INVALID":
      return t.register.errors.emailInvalid;
    case "PASSWORD_REQUIRED":
    case "PASSWORD_TOO_SHORT":
      return t.register.errors.passwordTooShort;
    case "CONFIRM_PASSWORD_REQUIRED":
    case "PASSWORDS_DO_NOT_MATCH":
      return t.register.errors.passwordsDoNotMatch;
    default:
      return t.register.errors.unexpected;
  }
}
