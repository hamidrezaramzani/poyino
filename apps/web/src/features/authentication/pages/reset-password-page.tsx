import { useAppConfig } from "../../../shared/config/app-config-provider";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { BetaAuthUnavailableNotice } from "../components/beta-auth-unavailable-notice";
import { ResetPasswordForm } from "../components/reset-password-form";

export function ResetPasswordPage() {
  const { t } = useI18n();
  const { status, passwordResetEnabled } = useAppConfig();

  if (status === "loading") {
    return null;
  }

  if (!passwordResetEnabled) {
    return (
      <BetaAuthUnavailableNotice
        title={t.resetPassword.betaUnavailableTitle}
        body={t.resetPassword.betaUnavailableBody}
        hint={t.resetPassword.betaUnavailableHint}
      />
    );
  }

  return <ResetPasswordForm />;
}
