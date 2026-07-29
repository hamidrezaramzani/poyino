import {
  Card,
  Form,
  FormField,
  Input,
  LoadingButton,
  PasswordInput,
} from "@poyino/ui";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useLoginForm } from "../hooks/use-login-form";

export function LoginForm() {
  const { t } = useI18n();
  const {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    validateField,
    submit,
  } = useLoginForm();

  return (
    <Card title={t.login.title} description={t.login.description}>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <FormField
          label={t.login.emailLabel}
          htmlFor="email"
          error={errors.email}
          required
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t.login.emailPlaceholder}
            value={values.email}
            disabled={isSubmitting}
            error={errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            onChange={(event) => setFieldValue("email", event.target.value)}
            onBlur={(event) => validateField("email", event.target.value)}
          />
        </FormField>

        <FormField
          label={t.login.passwordLabel}
          htmlFor="password"
          error={errors.password}
          required
        >
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            value={values.password}
            disabled={isSubmitting}
            error={errors.password}
            showLabel={t.login.showPassword}
            hideLabel={t.login.hidePassword}
            aria-describedby={errors.password ? "password-error" : undefined}
            onChange={(event) => setFieldValue("password", event.target.value)}
            onBlur={(event) => validateField("password", event.target.value)}
          />
        </FormField>

        <p
          style={{
            marginTop: 0,
            marginBottom: "0.25rem",
            textAlign: "start",
          }}
        >
          <Link to="/auth/forgot-password">{t.login.forgotPasswordLink}</Link>
        </p>

        <LoadingButton
          type="submit"
          fullWidth
          loading={isSubmitting}
          loadingLabel={t.login.submitting}
        >
          {t.login.submit}
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
        {t.login.noAccount}{" "}
        <Link to="/auth/register">{t.login.registerLink}</Link>
      </p>
    </Card>
  );
}
