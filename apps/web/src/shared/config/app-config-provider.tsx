import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { AppConfig } from "@poyino/contracts";
import { isBetaStage } from "@poyino/contracts";
import { fetchAppConfig } from "./app-config.service";

type AppConfigContextValue = {
  config: AppConfig | null;
  status: "loading" | "ready";
  isBeta: boolean;
};

const AppConfigContext = createContext<AppConfigContextValue>({
  config: null,
  status: "loading",
  isBeta: false,
});

export function AppConfigProvider({ children }: PropsWithChildren) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    let cancelled = false;
    void fetchAppConfig().then((value) => {
      if (cancelled) return;
      setConfig(value);
      setStatus("ready");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppConfigContext.Provider
      value={{
        config,
        status,
        isBeta: isBetaStage(config?.stage),
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  return useContext(AppConfigContext);
}
