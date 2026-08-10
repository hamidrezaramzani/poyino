import type { AppConfig, AppStage } from "@poyino/contracts";
import { AppStageSchema } from "@poyino/contracts";
import { appStageDefaults } from "@poyino/config";

export function loadAppConfig(
  source: NodeJS.ProcessEnv = process.env,
): AppConfig {
  const parsedStage = AppStageSchema.safeParse(
    (source.APP_STAGE ?? appStageDefaults.stage).toLowerCase(),
  );
  const stage: AppStage = parsedStage.success
    ? parsedStage.data
    : appStageDefaults.stage;

  const stageDefaultEnabled = stage === "production";

  return {
    stage,
    betaNoticeVersion:
      source.BETA_NOTICE_VERSION?.trim() || appStageDefaults.betaNoticeVersion,
    productVersion:
      source.PRODUCT_VERSION?.trim() || appStageDefaults.productVersion,
    emailVerificationEnabled: parseEnvBoolean(
      source.EMAIL_VERIFICATION_ENABLED,
      stageDefaultEnabled,
    ),
    passwordResetEnabled: parseEnvBoolean(
      source.PASSWORD_RESET_ENABLED,
      stageDefaultEnabled,
    ),
  };
}

function parseEnvBoolean(
  value: string | undefined,
  fallback: boolean,
): boolean {
  if (value === undefined || value.trim() === "") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1") {
    return true;
  }
  if (normalized === "false" || normalized === "0") {
    return false;
  }

  return fallback;
}
