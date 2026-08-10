import { z } from "zod";

export const AppStageSchema = z.enum(["beta", "production"]);

export type AppStage = z.infer<typeof AppStageSchema>;

export const AppStage = AppStageSchema.enum;

export function isBetaStage(stage: AppStage | null | undefined) {
  return stage === "beta";
}

export const AppConfigSchema = z.object({
  stage: AppStageSchema,
  /** Bumped when dismissed beta notices should reappear. */
  betaNoticeVersion: z.string().min(1).max(64),
  productVersion: z.string().min(1).max(64),
  /**
   * When false, registration marks accounts verified immediately and
   * login does not require email verification. Email send path is skipped.
   */
  emailVerificationEnabled: z.boolean(),
  /**
   * When false, password recovery/reset endpoints are disabled and the
   * UI should show a Beta unavailability warning instead of the form.
   */
  passwordResetEnabled: z.boolean(),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

export const AppConfigSuccessSchema = z.object({
  success: z.literal(true),
  config: AppConfigSchema,
});

export type AppConfigSuccess = z.infer<typeof AppConfigSuccessSchema>;
