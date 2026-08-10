const STORAGE_KEY = "poyino.pwa.analytics";
const MAX_EVENTS = 100;

export type PwaAnalyticsEventName =
  | "sw_registered"
  | "sw_update_available"
  | "sw_updated"
  | "install_prompt_shown"
  | "install_accepted"
  | "install_dismissed"
  | "installed"
  | "offline"
  | "online";

export type PwaAnalyticsEvent = {
  name: PwaAnalyticsEventName;
  at: string;
  meta?: Record<string, string | number | boolean | null>;
};

function readEvents(): PwaAnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PwaAnalyticsEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvents(events: PwaAnalyticsEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

/** Lightweight local analytics for PWA lifecycle events. */
export function trackPwaEvent(
  name: PwaAnalyticsEventName,
  meta?: PwaAnalyticsEvent["meta"],
) {
  const event: PwaAnalyticsEvent = {
    name,
    at: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  };

  const events = readEvents();
  events.push(event);
  writeEvents(events);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("poyino:pwa-analytics", { detail: event }));
  }

  if (import.meta.env.DEV) {
    console.info("[pwa]", name, meta ?? {});
  }
}

export function getPwaAnalyticsEvents(): PwaAnalyticsEvent[] {
  return readEvents();
}
