import { useAppConfig } from "../../../shared/config/app-config-provider";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { BetaAuthUnavailableNotice } from "../components/beta-auth-unavailable-notice";
import { ForgotPasswordForm } from "../components/forgot-password-form";

export function ForgotPasswordPage() {
  const { t } = useI18n();
  const { status, passwordResetEnabled } = useAppConfig();

  if (status === "loading") {
    return null;
  }

  if (!passwordResetEnabled) {
    return (
      <BetaAuthUnavailableNotice
        title={t.forgotPassword.betaUnavailableTitle}
        body={t.forgotPassword.betaUnavailableBody}
        hint={t.forgotPassword.betaUnavailableHint}
      />
    );
  }

  return <ForgotPasswordForm />;
}
