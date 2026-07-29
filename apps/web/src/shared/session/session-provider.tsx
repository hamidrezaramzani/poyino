import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { ApiRequestError } from "../api/api-client";
import { fetchSessionMe, type SessionUser } from "./session.service";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type SessionContextValue = {
  status: SessionStatus;
  user: SessionUser | null;
  refresh: () => Promise<void>;
  clearSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [user, setUser] = useState<SessionUser | null>(null);

  const clearSession = useCallback(() => {
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchSessionMe();
      setUser(result.user);
      setStatus("authenticated");
    } catch (error) {
      setUser(null);
      if (error instanceof ApiRequestError && error.status === 401) {
        setStatus("unauthenticated");
        return;
      }
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return createElement(
    SessionContext.Provider,
    { value: { status, user, refresh, clearSession } },
    children,
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
