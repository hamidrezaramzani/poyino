import { Injectable } from "@nestjs/common";
import pino, { type Logger } from "pino";
import { STORAGE_ENV } from "../constants/storage.constants";

@Injectable()
export class StorageLogger {
  private readonly logger: Logger = pino({
    name: "storage",
    level: process.env[STORAGE_ENV.LOG_LEVEL] ?? "info",
  });

  uploadStarted(meta: {
    objectKey: string;
    mimeType: string;
    sizeBytes: number;
    folder?: string;
  }) {
    this.logger.info(
      {
        event: "storage.upload.start",
        ...sanitizeMeta(meta),
      },
      "Storage upload started",
    );
  }

  uploadCompleted(meta: {
    objectKey: string;
    mimeType: string;
    sizeBytes: number;
    durationMs: number;
    etag?: string | null;
  }) {
    this.logger.info(
      {
        event: "storage.upload.complete",
        ...sanitizeMeta(meta),
      },
      "Storage upload completed",
    );
  }

  uploadFailed(meta: {
    objectKey?: string;
    durationMs: number;
    errorCode?: string;
    providerStatus?: number;
    providerCode?: string;
  }) {
    this.logger.error(
      {
        event: "storage.upload.failed",
        ...sanitizeMeta(meta),
      },
      "Storage upload failed",
    );
  }

  operation(event: string, meta?: Record<string, unknown>) {
    this.logger.info(
      {
        event: `storage.${event}`,
        ...sanitizeMeta(meta),
      },
      `Storage ${event}`,
    );
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.logger.warn(sanitizeMeta(meta), message);
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.logger.error(sanitizeMeta(meta), message);
  }
}

const FORBIDDEN_META_KEYS = new Set([
  "accesskey",
  "access_key",
  "secretkey",
  "secret_key",
  "secretaccesskey",
  "secret_access_key",
  "password",
  "authorization",
  "credential",
  "credentials",
  "apikey",
  "api_key",
  "token",
  "body",
  "buffer",
  "content",
  "data",
]);

function sanitizeMeta(
  meta?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!meta) {
    return undefined;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (FORBIDDEN_META_KEYS.has(key.toLowerCase())) {
      continue;
    }
    sanitized[key] = value;
  }
  return sanitized;
}
