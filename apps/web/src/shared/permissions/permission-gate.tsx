import { Navigate } from "react-router-dom";
import type { Permission } from "@poyino/contracts";
import { useI18n } from "../i18n/i18n-provider";
import { useSession } from "../session/session-provider";
import { can } from "./can";

type PermissionGateProps = {
  permission: Permission | Permission[];
  children: React.ReactNode;
  fallback?: "hide" | "redirect" | "message";
  redirectTo?: string;
};

export function PermissionGate({
  permission,
  children,
  fallback = "hide",
  redirectTo = "/dashboard",
}: PermissionGateProps) {
  const { user, status } = useSession();
  const { t } = useI18n();

  if (status === "loading") {
    return null;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];
  const allowed = permissions.some((item) => can(user?.role, item));

  if (allowed) {
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
