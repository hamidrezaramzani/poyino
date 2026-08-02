export const AI_PROVIDER = Symbol("AI_PROVIDER");

export const AI_CONFIG = {
  BASE_URL: "AI_BASE_URL",
  API_KEY: "AI_API_KEY",
  MODEL: "AI_MODEL",
  TIMEOUT_MS: "AI_TIMEOUT_MS",
} as const;

export const AI_DEFAULTS = {
  TIMEOUT_MS: 90_000,
  /** Default completion budget for structured generation. */
  STRUCTURED_MAX_TOKENS: 2_500,
} as const;
