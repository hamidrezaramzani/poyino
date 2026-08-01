import { ConfigService } from "@nestjs/config";
import {
  STORAGE_DEFAULTS,
  STORAGE_ENV,
} from "../constants/storage.constants";
import type { StorageConfig } from "../dto/storage.dto";
import { StorageConfigurationException } from "../exceptions/storage.exceptions";

type EnvSource = ConfigService | Record<string, unknown>;

function readRaw(source: EnvSource, key: string): unknown {
  if (source instanceof ConfigService) {
    return source.get(key);
  }
  return source[key];
}

function readRequiredString(source: EnvSource, key: string): string {
  const value = readRaw(source, key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new StorageConfigurationException(
      `Missing required environment variable: ${key}`,
    );
  }
  return value.trim();
}

function readOptionalString(source: EnvSource, key: string): string | null {
  const value = readRaw(source, key);
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    throw new StorageConfigurationException(
      `Invalid environment variable ${key}: expected a string.`,
    );
  }
  return value.trim();
}

function readOptionalBoolean(
  source: EnvSource,
  key: string,
  fallback: boolean,
): boolean {
  const value = readRaw(source, key);
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") {
      return true;
    }
    if (normalized === "false" || normalized === "0") {
      return false;
    }
  }
  throw new StorageConfigurationException(
    `Invalid environment variable ${key}: expected a boolean.`,
  );
}

function readOptionalPositiveInt(
  source: EnvSource,
  key: string,
  fallback: number,
): number {
  const raw = readRaw(source, key);
  if (raw === undefined || raw === null || raw === "") {
    return fallback;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new StorageConfigurationException(
      `Invalid environment variable ${key}: expected a positive number.`,
    );
  }

  return Math.floor(parsed);
}

function normalizeEndpoint(endpoint: string): string {
  const trimmed = endpoint.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function loadStorageConfig(source: EnvSource = process.env): StorageConfig {
  const providerRaw =
    readOptionalString(source, STORAGE_ENV.PROVIDER) ??
    STORAGE_DEFAULTS.PROVIDER;

  if (providerRaw !== "s3") {
    throw new StorageConfigurationException(
      `Unsupported STORAGE_PROVIDER "${providerRaw}". Only "s3" is implemented.`,
    );
  }

  const endpoint = normalizeEndpoint(
    readRequiredString(source, STORAGE_ENV.S3_ENDPOINT),
  );
  const publicUrlRaw = readOptionalString(source, STORAGE_ENV.S3_PUBLIC_URL);

  return {
    provider: "s3",
    endpoint,
    region:
      readOptionalString(source, STORAGE_ENV.S3_REGION) ??
      STORAGE_DEFAULTS.REGION,
    bucket: readRequiredString(source, STORAGE_ENV.S3_BUCKET),
    accessKey: readRequiredString(source, STORAGE_ENV.S3_ACCESS_KEY),
    secretKey: readRequiredString(source, STORAGE_ENV.S3_SECRET_KEY),
    publicUrl: publicUrlRaw ? normalizeEndpoint(publicUrlRaw) : endpoint,
    forcePathStyle: readOptionalBoolean(
      source,
      STORAGE_ENV.S3_FORCE_PATH_STYLE,
      STORAGE_DEFAULTS.FORCE_PATH_STYLE,
    ),
    signedUrlTtlSeconds: readOptionalPositiveInt(
      source,
      STORAGE_ENV.S3_SIGNED_URL_TTL_SECONDS,
      STORAGE_DEFAULTS.SIGNED_URL_TTL_SECONDS,
    ),
  };
}
