import { Injectable } from "@nestjs/common";
import pino, { type Logger } from "pino";

@Injectable()
export class AiLogger {
  private readonly logger: Logger = pino({
    name: "ai",
    level: process.env.AI_LOG_LEVEL ?? "info",
  });

  requestStart(operation: string, meta?: Record<string, unknown>) {
    this.logger.info(
      {
        event: "ai.request.start",
        operation,
        ...sanitizeMeta(meta),
      },
      "AI request started",
    );
  }

  requestFinish(
    operation: string,
    meta: {
      durationMs: number;
      model?: string;
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
      success: boolean;
      errorCode?: string;
      providerStatus?: number;
      providerCode?: string;
      validationPaths?: string[];
    },
  ) {
    const payload = {
      event: "ai.request.finish",
      operation,
      ...sanitizeMeta(meta),
    };

    if (meta.success) {
      this.logger.info(payload, "AI request finished");
      return;
    }

    this.logger.error(payload, "AI request failed");
  }
}

const FORBIDDEN_META_KEYS = new Set([
  "apikey",
  "api_key",
  "authorization",
  "prompt",
  "system",
  "messages",
  "content",
  "input",
  "output",
  "text",
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
