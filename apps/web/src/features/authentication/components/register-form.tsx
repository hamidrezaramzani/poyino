import {
  Card,
  Form,
  FormField,
  Input,
  LoadingButton,
  PasswordInput,
  ToastViewport,
} from "@poyino/ui";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useRegisterForm } from "../hooks/use-register-form";

export function RegisterForm() {
  const { t } = useI18n();
  const {
    values,
    errors,
    isSubmitting,
    toasts,
    setFieldValue,
    validateField,
    submit,
  } = useRegisterForm();

  return (
    <>
      <Card title={t.register.title} description={t.register.description}>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <FormField
            label={t.register.organizationNameLabel}
            htmlFor="organizationName"
            error={errors.organizationName}
            required
          >
            <Input
              id="organizationName"
              name="organizationName"
              autoComplete="organization"
              placeholder={t.register.organizationNamePlaceholder}
              value={values.organizationName}
              disabled={isSubmitting}
              error={errors.organizationName}
              aria-describedby={
                errors.organizationName ? "organizationName-error" : undefined
              }
              onChange={(event) =>
                setFieldValue("organizationName", event.target.value)
              }
              onBlur={(event) =>
                validateField("organizationName", event.target.value)
              }
            />
          </FormField>

          <FormField
            label={t.register.emailLabel}
            htmlFor="email"
            error={errors.email}
            required
          >
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t.register.emailPlaceholder}
              value={values.email}
              disabled={isSubmitting}
              error={errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              onChange={(event) => setFieldValue("email", event.target.value)}
              onBlur={(event) => validateField("email", event.target.value)}
            />
          </FormField>

          <FormField
            label={t.register.passwordLabel}
            htmlFor="password"
            error={errors.password}
            required
          >
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              value={values.password}
              disabled={isSubmitting}
              error={errors.password}
              showLabel={t.register.showPassword}
              hideLabel={t.register.hidePassword}
              aria-describedby={errors.password ? "password-error" : undefined}
              onChange={(event) => setFieldValue("password", event.target.value)}
              onBlur={(event) => validateField("password", event.target.value)}
            />
          </FormField>

          <FormField
            label={t.register.confirmPasswordLabel}
            htmlFor="confirmPassword"
            error={errors.confirmPassword}
            required
          >
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              value={values.confirmPassword}
              disabled={isSubmitting}
              error={errors.confirmPassword}
              showLabel={t.register.showPassword}
              hideLabel={t.register.hidePassword}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
              onChange={(event) =>
                setFieldValue("confirmPassword", event.target.value)
              }
              onBlur={(event) =>
                validateField("confirmPassword", event.target.value)
              }
            />
          </FormField>

          <LoadingButton
            type="submit"
            fullWidth
            loading={isSubmitting}
            loadingLabel={t.register.submitting}
          >
            {t.register.submit}
          </LoadingButton>
        </Form>

        <p
          style={{
            marginTop: "1.25rem",
            marginBottom: 0,
            textAlign: "center",
            color: "#64748b",
          }}
        >
          {t.register.haveAccount}{" "}
          <Link to="/auth/login">{t.register.loginLink}</Link>
        </p>
      </Card>

      <ToastViewport toasts={toasts} />
    </>
  );
}
