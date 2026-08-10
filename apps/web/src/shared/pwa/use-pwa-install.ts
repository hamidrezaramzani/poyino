import { useEffect, useState } from "react";
import { trackPwaEvent } from "./pwa-analytics";

type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "poyino.pwa.install.dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && Boolean((navigator as { standalone?: boolean }).standalone))
  );
}

/** Captures the browser install prompt and exposes accept/dismiss helpers. */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsInstalled(isStandalone());
    setIsDismissed(localStorage.getItem(DISMISS_KEY) === "1");

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      trackPwaEvent("install_prompt_shown", {
        platforms: promptEvent.platforms.join(","),
      });
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      trackPwaEvent("installed", { mode: "appinstalled" });
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const canInstall = Boolean(deferredPrompt) && !isInstalled && !isDismissed;

  async function install() {
    if (!deferredPrompt) return false;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    if (choice.outcome === "accepted") {
      trackPwaEvent("install_accepted", { platform: choice.platform });
      return true;
    }

    trackPwaEvent("install_dismissed", { platform: choice.platform });
    return false;
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setIsDismissed(true);
    trackPwaEvent("install_dismissed", { source: "ui" });
  }

  return {
    canInstall,
    isInstalled,
    install,
    dismiss,
  };
}
