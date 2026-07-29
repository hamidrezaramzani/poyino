import { Card } from "@poyino/ui";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";

export function ForgotPasswordPage() {
  const { t } = useI18n();

  return (
    <Card
      title={t.forgotPassword.title}
      description={t.forgotPassword.description}
    >
      <p style={{ marginTop: 0, color: "#64748b" }}>
        {t.forgotPassword.pendingNote}
      </p>
      <p style={{ marginBottom: 0 }}>
        <Link to="/auth/login">{t.forgotPassword.loginLink}</Link>
      </p>
    </Card>
  );
}
