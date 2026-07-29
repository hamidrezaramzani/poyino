import { useEffect } from "react";
import { Card, ToastViewport } from "@poyino/ui";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "../../../shared/hooks/use-toast";
import { useI18n } from "../../../shared/i18n/i18n-provider";

export function LoginPage() {
  const { t } = useI18n();
  const location = useLocation();
  const { toasts, push } = useToast();
  const registrationSuccess = Boolean(
    (location.state as { registrationSuccess?: boolean } | null)
      ?.registrationSuccess,
  );

  useEffect(() => {
    if (registrationSuccess) {
      push(t.register.successToast, "success");
    }
  }, [push, registrationSuccess, t.register.successToast]);

  return (
    <>
      <Card title={t.login.title} description={t.login.description}>
        <p style={{ marginTop: 0, color: "#64748b" }}>{t.login.pendingNote}</p>
        <p style={{ marginBottom: 0 }}>
          <Link to="/auth/register">{t.login.registerLink}</Link>
        </p>
      </Card>
      <ToastViewport toasts={toasts} />
    </>
  );
}
