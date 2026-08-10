import { registerSW } from "virtual:pwa-register";
import { trackPwaEvent } from "./pwa-analytics";

export type PwaUpdateHandler = (reloadPage: () => void) => void;

let updateAvailable = false;
let applyUpdate: (() => void) | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Registers the service worker after the app loads.
 * Uses prompt mode so the UI can ask before activating a new version.
 */
export function registerPwa(onNeedRefresh?: PwaUpdateHandler) {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  const updateSW = registerSW({
    immediate: true,
    onRegisteredSW(swUrl) {
      trackPwaEvent("sw_registered", { swUrl });
    },
    onNeedRefresh() {
      updateAvailable = true;
      applyUpdate = () => {
        trackPwaEvent("sw_updated");
        void updateSW(true);
      };
      trackPwaEvent("sw_update_available");
      notify();
      onNeedRefresh?.(applyUpdate);
    },
    onOfflineReady() {
      trackPwaEvent("installed", { mode: "offline-ready" });
    },
    onRegisterError(error) {
      console.error("[pwa] service worker registration failed", error);
    },
  });

  const syncConnectivity = () => {
    trackPwaEvent(navigator.onLine ? "online" : "offline");
  };

  window.addEventListener("online", syncConnectivity);
  window.addEventListener("offline", syncConnectivity);

  if (window.matchMedia("(display-mode: standalone)").matches) {
    trackPwaEvent("installed", { mode: "standalone" });
  }
}

export function subscribeToPwaUpdate(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPwaUpdateState() {
  return {
    updateAvailable,
    applyUpdate,
  };
}
