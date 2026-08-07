import { Navigate } from "react-router-dom";
import { useI18n } from "../i18n/i18n-provider";
import { useSession } from "../session/session-provider";
import { useIsPlatformAdmin } from "./use-platform-admin";

type PlatformAdminGateProps = {
  children: React.ReactNode;
  fallback?: "hide" | "redirect" | "message";
  redirectTo?: string;
};

export function PlatformAdminGate({
  children,
  fallback = "hide",
  redirectTo = "/dashboard",
}: PlatformAdminGateProps) {
  const { status } = useSession();
  const { t } = useI18n();
  const isAdmin = useIsPlatformAdmin();

  if (status === "loading") {
    return null;
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  if (fallback === "redirect") {
    return <Navigate to={redirectTo} replace />;
  }

  if (fallback === "message") {
    return (
      <div className="permission-denied" role="alert">
        <h2>{t.permissions.deniedTitle}</h2>
        <p>{t.permissions.deniedDescription}</p>
      </div>
    );
  }

  return null;
}
