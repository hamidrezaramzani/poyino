import { Card } from "@poyino/ui";
import { Link, useSearchParams } from "react-router-dom";
import { useAppConfig } from "../../../shared/config/app-config-provider";
import { useI18n } from "../../../shared/i18n/i18n-provider";

export function VerifyEmailPage() {
  const { t } = useI18n();
  const { status, emailVerificationEnabled } = useAppConfig();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (status === "loading") {
    return null;
  }

  if (!emailVerificationEnabled) {
    return (
      <Card
        title={t.verifyEmail.betaUnavailableTitle}
        description={t.beta.emailFeatureUnavailableEyebrow}
      >
        <div className="beta-auth-unavailable" role="status">
          <p className="beta-auth-unavailable-body">
            {t.verifyEmail.betaUnavailableBody}
          </p>
          <p className="beta-auth-unavailable-footer">
            <Link to="/auth/login">{t.verifyEmail.loginLink}</Link>
          </p>
        </div>
      </Card>
    );
  }

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
