import { Card } from "@poyino/ui";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";

export function VerifyEmailPage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <Card title={t.verifyEmail.title} description={t.verifyEmail.description}>
      <p style={{ marginTop: 0, color: "#64748b" }}>
        {token ? t.verifyEmail.tokenReceived : t.verifyEmail.missingToken}
      </p>
      <p style={{ marginBottom: 0 }}>
        <Link to="/auth/login">{t.verifyEmail.loginLink}</Link>
      </p>
    </Card>
  );
}
