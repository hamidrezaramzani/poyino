import { Navigate } from "react-router-dom";
import { Spinner } from "@poyino/ui";
import type { PropsWithChildren } from "react";
import { useSession } from "../session/session-provider";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="dashboard-auth-loading">
        <Spinner size={32} label="Loading session" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
