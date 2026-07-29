import {
  Card,
  Form,
  FormField,
  Input,
  LoadingButton,
} from "@poyino/ui";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useForgotPasswordForm } from "../hooks/use-forgot-password-form";

export function ForgotPasswordForm() {
  const { t } = useI18n();
  const {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    validateField,
    submit,
  } = useForgotPasswordForm();

  return (
    <Card
      title={t.forgotPassword.title}
      description={t.forgotPassword.description}
    >
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <FormField
            label={t.forgotPassword.emailLabel}
            htmlFor="email"
            error={errors.email}
            required
          >
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t.forgotPassword.emailPlaceholder}
              value={values.email}
              disabled={isSubmitting}
              error={errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              onChange={(event) => setFieldValue("email", event.target.value)}
              onBlur={(event) => validateField("email", event.target.value)}
            />
          </FormField>

          <LoadingButton
            type="submit"
            fullWidth
            loading={isSubmitting}
            loadingLabel={t.forgotPassword.submitting}
          >
            {t.forgotPassword.submit}
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
          <Link to="/auth/login">{t.forgotPassword.loginLink}</Link>
        </p>
    </Card>
  );
}
