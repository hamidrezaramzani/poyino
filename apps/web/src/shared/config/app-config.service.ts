import type { AppConfig, AppConfigSuccess, AppStage } from "@poyino/contracts";
import { appStageDefaults } from "@poyino/config";
import { apiRequest } from "../api/api-client";

function fallbackConfig(): AppConfig {
  const stageCandidate = (
    import.meta.env.VITE_APP_STAGE ?? appStageDefaults.stage
  ).toLowerCase();
  const stage: AppStage =
    stageCandidate === "production" ? "production" : "beta";

  return {
    stage,
    betaNoticeVersion: appStageDefaults.betaNoticeVersion,
    productVersion: appStageDefaults.productVersion,
  };
}

let cachedConfig: AppConfig | null = null;
let inflight: Promise<AppConfig> | null = null;

export async function fetchAppConfig(): Promise<AppConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }
  if (inflight) {
    return inflight;
  }

  inflight = apiRequest<AppConfigSuccess>("/config")
    .then((response) => {
      cachedConfig = response.config;
      return response.config;
    })
    .catch(() => {
      const fallback = fallbackConfig();
      cachedConfig = fallback;
      return fallback;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function getCachedAppConfig(): AppConfig | null {
  return cachedConfig;
}
