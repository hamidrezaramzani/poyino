import { AI_CONFIG, AI_DEFAULTS } from "../constants/ai.constants";
import type { AiConfig } from "../dto/ai.dto";
import { AiException, AiErrorCode } from "../exceptions/ai.exceptions";

type EnvRecord = Record<string, unknown>;

function readRequiredString(env: EnvRecord, key: string): string {
  const value = env[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AiException(
      AiErrorCode.CONFIGURATION_ERROR,
      `Missing required environment variable: ${key}`,
    );
  }
  return value.trim();
}

function readOptionalPositiveInt(
  env: EnvRecord,
  key: string,
  fallback: number,
): number {
  const raw = env[key];
  if (raw === undefined || raw === null || raw === "") {
    return fallback;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new AiException(
      AiErrorCode.CONFIGURATION_ERROR,
      `Invalid environment variable ${key}: expected a positive number.`,
    );
  }

  return Math.floor(parsed);
}

export function loadAiConfig(env: EnvRecord = process.env): AiConfig {
  return {
    baseUrl: readRequiredString(env, AI_CONFIG.BASE_URL).replace(/\/$/, ""),
    apiKey: readRequiredString(env, AI_CONFIG.API_KEY),
    model: readRequiredString(env, AI_CONFIG.MODEL),
    timeoutMs: readOptionalPositiveInt(
      env,
      AI_CONFIG.TIMEOUT_MS,
      AI_DEFAULTS.TIMEOUT_MS,
    ),
  };
}

export function validateAiEnv(env: EnvRecord): EnvRecord {
  loadAiConfig(env);
  return env;
}
