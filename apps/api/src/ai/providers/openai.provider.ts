import {
  Inject,
  Injectable,
  Logger,
  type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { z } from "zod";
import { AI_CONFIG, AI_DEFAULTS } from "../constants/ai.constants";
import type { AiConfig } from "../dto/ai.dto";
import {
  AiInvalidResponseException,
  AiNetworkException,
  AiNotImplementedException,
  AiProviderUnavailableException,
  AiTimeoutException,
} from "../exceptions/ai.exceptions";
import type {
  AiChatMessage,
  AiProvider,
  AiStructuredResult,
  AiTextResult,
  AiUsage,
  ChatOptions,
  GenerateStructuredOptions,
  GenerateTextOptions,
  StreamChunk,
} from "../interfaces/ai-provider.interface";

@Injectable()
export class OpenAiProvider implements AiProvider, OnModuleInit {
  private readonly logger = new Logger(OpenAiProvider.name);
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly baseUrl: string;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    const config = this.readConfig();
    this.model = config.model;
    this.baseUrl = config.baseUrl;

    // Single shared client for the process lifetime (Nest singleton).
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
      timeout: config.timeoutMs,
      maxRetries: 0,
    });
  }

  async onModuleInit() {
    // Warm DNS/TLS once at startup so the first generate call is faster.
    const startedAt = Date.now();
    try {
      await fetch(this.baseUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8_000),
      });
      this.logger.log(
        `AI provider connection warmed (${Date.now() - startedAt}ms) model=${this.model}`,
      );
    } catch (error) {
      this.logger.warn(
        `AI provider warm-up failed (${Date.now() - startedAt}ms); first request may be slower.`,
      );
      if (error instanceof Error) {
        this.logger.debug(error.message);
      }
    }
  }

  async generateText(options: GenerateTextOptions): Promise<AiTextResult> {
    const messages = buildMessages(options.system, options.prompt);
    return this.chat(messages, {
      temperature: options.temperature,
      maxTokens: options.maxTokens,
    });
  }

  async generateStructured<T>(
    options: GenerateStructuredOptions<T>,
  ): Promise<AiStructuredResult<T>> {
    const schemaHint =
      options.schemaHint?.trim() || compactSchemaHint(options.schema);
    const system = [
      options.system?.trim(),
      "Return one JSON object only. No markdown.",
      `Shape: ${schemaHint}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: buildMessages(system, options.prompt),
        ...optionalTemperature(options.temperature),
        ...tokenLimitParams(
          this.model,
          options.maxTokens ?? AI_DEFAULTS.STRUCTURED_MAX_TOKENS,
        ),
        response_format: { type: "json_object" },
      });

      const content = extractMessageText(completion.choices[0]?.message);
      const finishReason = completion.choices[0]?.finish_reason;
      if (!content) {
        throw new AiInvalidResponseException(
          "AI provider returned an empty structured response.",
          undefined,
          {
            providerCode: finishReason ?? undefined,
          },
        );
      }

      return {
        data: parseJsonAgainstSchema(content, options.schema, {
          normalize: options.normalize,
          finishReason,
        }),
        usage: mapUsage(completion.usage),
        model: completion.model,
      };
    } catch (error) {
      if (error instanceof AiInvalidResponseException) {
        throw error;
      }
      throw mapProviderError(error);
    }
  }

  async chat(
    messages: AiChatMessage[],
    options?: ChatOptions,
  ): Promise<AiTextResult> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        ...optionalTemperature(options?.temperature),
        ...(options?.maxTokens !== undefined
          ? tokenLimitParams(this.model, options.maxTokens)
          : {}),
      });

      const text = extractMessageText(completion.choices[0]?.message);
      if (!text) {
        throw new AiInvalidResponseException(
          "AI provider returned an empty text response.",
        );
      }

      return {
        text,
        usage: mapUsage(completion.usage),
        model: completion.model,
      };
    } catch (error) {
      if (error instanceof AiInvalidResponseException) {
        throw error;
      }
      throw mapProviderError(error);
    }
  }

  async *stream(
    _messages: AiChatMessage[],
    _options?: ChatOptions,
  ): AsyncIterable<StreamChunk> {
    throw new AiNotImplementedException(
      "AI streaming is not implemented yet.",
    );
  }

  private readConfig(): AiConfig {
    const baseUrl = this.configService.getOrThrow<string>(AI_CONFIG.BASE_URL);
    const apiKey = this.configService.getOrThrow<string>(AI_CONFIG.API_KEY);
    const model = this.configService.getOrThrow<string>(AI_CONFIG.MODEL);
    const timeoutRaw = this.configService.get<string | number>(
      AI_CONFIG.TIMEOUT_MS,
    );
    const timeoutMs =
      timeoutRaw === undefined || timeoutRaw === ""
        ? AI_DEFAULTS.TIMEOUT_MS
        : Number(timeoutRaw);

    return {
      baseUrl: baseUrl.replace(/\/$/, ""),
      apiKey,
      model,
      timeoutMs,
    };
  }
}

function optionalTemperature(
  temperature: number | undefined,
): { temperature: number } | Record<string, never> {
  return temperature === undefined ? {} : { temperature };
}

function tokenLimitParams(model: string, maxTokens: number) {
  // Newer OpenAI-family models (gpt-5 / o-series) expect max_completion_tokens.
  if (/(?:gpt-5|o[1-9]|o4)/i.test(model)) {
    return { max_completion_tokens: maxTokens };
  }
  return { max_tokens: maxTokens };
}

function buildMessages(
  system: string | undefined,
  prompt: string,
): AiChatMessage[] {
  const messages: AiChatMessage[] = [];
  if (system?.trim()) {
    messages.push({ role: "system", content: system.trim() });
  }
  messages.push({ role: "user", content: prompt });
  return messages;
}

function extractMessageText(message: unknown): string | null {
  if (!message || typeof message !== "object") {
    return null;
  }

  const content = (message as { content?: unknown }).content;
  if (typeof content === "string" && content.trim().length > 0) {
    return content;
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (
          part &&
          typeof part === "object" &&
          "text" in part &&
          typeof (part as { text: unknown }).text === "string"
        ) {
          return (part as { text: string }).text;
        }
        return "";
      })
      .join("")
      .trim();
    return text.length > 0 ? text : null;
  }

  return null;
}

function parseJsonAgainstSchema<T>(
  content: string,
  schema: z.ZodType<T>,
  options?: {
    normalize?: (raw: unknown) => unknown;
    finishReason?: string | null;
  },
): T {
  let jsonText = content.trim();

  const fenced = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    jsonText = fenced[1].trim();
  }

  const firstBrace = jsonText.indexOf("{");
  const lastBrace = jsonText.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    jsonText = jsonText.slice(firstBrace, lastBrace + 1);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(jsonText);
  } catch (error) {
    throw new AiInvalidResponseException(
      options?.finishReason === "length"
        ? "AI provider response was truncated before valid JSON completed."
        : "AI provider returned non-JSON content for structured output.",
      error,
      {
        providerCode: options?.finishReason ?? "json_parse_error",
      },
    );
  }

  const normalized = options?.normalize ? options.normalize(raw) : raw;
  const result = schema.safeParse(normalized);
  if (!result.success) {
    const validationPaths = result.error.issues
      .map((issue) => issue.path.join(".") || "(root)")
      .slice(0, 8);

    throw new AiInvalidResponseException(
      "AI provider response failed schema validation.",
      result.error,
      {
        providerCode: "schema_validation_error",
        validationPaths,
      },
    );
  }

  return result.data;
}

function compactSchemaHint(schema: z.ZodType): string {
  try {
    const jsonSchema = z.toJSONSchema(schema as z.ZodTypeAny) as {
      properties?: Record<string, unknown>;
      required?: string[];
    };
    if (jsonSchema.properties) {
      return JSON.stringify({
        required: jsonSchema.required,
        keys: Object.keys(jsonSchema.properties),
      });
    }
  } catch {
    // fall through
  }
  return '{"type":"object"}';
}

function mapUsage(
  usage:
    | {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      }
    | null
    | undefined,
): AiUsage | undefined {
  if (!usage) {
    return undefined;
  }

  return {
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
  };
}

function mapProviderError(error: unknown): never {
  if (error instanceof OpenAI.APIConnectionTimeoutError) {
    throw new AiTimeoutException("AI provider request timed out.", error);
  }

  if (error instanceof OpenAI.APIConnectionError) {
    throw new AiNetworkException("AI provider network error.", error);
  }

  if (error instanceof OpenAI.APIError) {
    if (error.status === 408 || error.code === "timeout") {
      throw new AiTimeoutException("AI provider request timed out.", error);
    }

    if (
      error.status === 429 ||
      error.status === 500 ||
      error.status === 502 ||
      error.status === 503 ||
      error.status === 504
    ) {
      throw new AiProviderUnavailableException(
        "AI provider is unavailable.",
        error,
      );
    }

    throw new AiInvalidResponseException(
      "AI provider returned an error response.",
      error,
      {
        providerStatus: error.status,
        providerCode: typeof error.code === "string" ? error.code : undefined,
      },
    );
  }

  if (error instanceof Error && /timeout/i.test(error.message)) {
    throw new AiTimeoutException("AI provider request timed out.", error);
  }

  if (
    error instanceof Error &&
    /fetch|network|econn|enotfound/i.test(error.message)
  ) {
    throw new AiNetworkException("AI provider network error.", error);
  }

  throw new AiProviderUnavailableException(
    "AI provider request failed.",
    error,
  );
}
