import { useCallback, useEffect, useState } from "react";
import { useAppConfig } from "../../../shared/config/app-config-provider";

const STORAGE_PREFIX = "poyino.beta-notice.dismissed";

function storageKey(version: string) {
  return `${STORAGE_PREFIX}.${version}`;
}

export function useBetaNoticeDismissal() {
  const { config, isBeta, status } = useAppConfig();
  const version = config?.betaNoticeVersion ?? "1";
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(window.localStorage.getItem(storageKey(version)) === "1");
  }, [version]);

  const dismiss = useCallback(() => {
    window.localStorage.setItem(storageKey(version), "1");
    setDismissed(true);
  }, [version]);

  return {
    ready: status === "ready",
    visible: isBeta && !dismissed,
    dismiss,
    version,
  };
}
