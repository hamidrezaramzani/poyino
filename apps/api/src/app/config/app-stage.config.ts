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

  return {
    stage,
    betaNoticeVersion:
      source.BETA_NOTICE_VERSION?.trim() || appStageDefaults.betaNoticeVersion,
    productVersion:
      source.PRODUCT_VERSION?.trim() || appStageDefaults.productVersion,
  };
}
