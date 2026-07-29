import {
  Card,
  Form,
  FormField,
  LoadingButton,
  PasswordInput,
  ToastViewport,
} from "@poyino/ui";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useResetPasswordForm } from "../hooks/use-reset-password-form";

export function ResetPasswordForm() {
  const { t } = useI18n();
  const {
    values,
    errors,
    isSubmitting,
    tokenStatus,
    toasts,
    setFieldValue,
    validateField,
    submit,
  } = useResetPasswordForm();

  if (tokenStatus === "checking") {
    return (
      <Card
        title={t.resetPassword.title}
        description={t.resetPassword.description}
      >
        <p style={{ marginTop: 0, marginBottom: 0, color: "#64748b" }}>
          {t.resetPassword.validatingToken}
        </p>
      </Card>
    );
  }

  if (tokenStatus !== "valid") {
    const message =
      tokenStatus === "expired"
        ? t.resetPassword.errors.expiredToken
        : tokenStatus === "missing"
          ? t.resetPassword.errors.missingToken
          : t.resetPassword.errors.invalidToken;

    return (
      <Card
        title={t.resetPassword.title}
        description={t.resetPassword.description}
      >
        <p style={{ marginTop: 0, color: "#64748b" }}>{message}</p>
        <p style={{ marginBottom: 0 }}>
          <Link to="/auth/forgot-password">
            {t.resetPassword.forgotPasswordLink}
          </Link>
          {" · "}
          <Link to="/auth/login">{t.resetPassword.loginLink}</Link>
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card
        title={t.resetPassword.title}
        description={t.resetPassword.description}
      >
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <FormField
            label={t.resetPassword.passwordLabel}
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
              showLabel={t.resetPassword.showPassword}
              hideLabel={t.resetPassword.hidePassword}
              aria-describedby={errors.password ? "password-error" : undefined}
              onChange={(event) => setFieldValue("password", event.target.value)}
              onBlur={(event) => validateField("password", event.target.value)}
            />
          </FormField>

          <FormField
            label={t.resetPassword.confirmPasswordLabel}
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
              showLabel={t.resetPassword.showPassword}
              hideLabel={t.resetPassword.hidePassword}
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
            loadingLabel={t.resetPassword.submitting}
          >
            {t.resetPassword.submit}
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
          <Link to="/auth/login">{t.resetPassword.loginLink}</Link>
        </p>
      </Card>

      <ToastViewport toasts={toasts} />
    </>
  );
}
