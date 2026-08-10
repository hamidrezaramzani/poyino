import { Card } from "@poyino/ui";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";

type BetaAuthUnavailableNoticeProps = {
  title: string;
  body: string;
  hint?: string;
};

export function BetaAuthUnavailableNotice({
  title,
  body,
  hint,
}: BetaAuthUnavailableNoticeProps) {
  const { t } = useI18n();

  return (
    <Card title={title} description={t.beta.emailFeatureUnavailableEyebrow}>
      <div className="beta-auth-unavailable" role="status">
        <p className="beta-auth-unavailable-body">{body}</p>
        {hint ? <p className="beta-auth-unavailable-hint">{hint}</p> : null}
        <p className="beta-auth-unavailable-footer">
          <Link to="/auth/login">{t.forgotPassword.loginLink}</Link>
        </p>
      </div>
    </Card>
  );
}
