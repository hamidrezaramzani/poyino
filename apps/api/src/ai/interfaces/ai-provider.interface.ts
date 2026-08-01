import type { z } from "zod";

export type AiMessageRole = "system" | "user" | "assistant";

export type AiChatMessage = {
  role: AiMessageRole;
  content: string;
};

export type AiUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

export type AiTextResult = {
  text: string;
  usage?: AiUsage;
  model?: string;
};

export type AiStructuredResult<T> = {
  data: T;
  usage?: AiUsage;
  model?: string;
};

export type GenerateTextOptions = {
  prompt: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
};

export type GenerateStructuredOptions<T> = {
  prompt: string;
  schema: z.ZodType<T>;
  schemaName?: string;
  /** Compact shape description for the model. Prefer this over auto JSON Schema. */
  schemaHint?: string;
  /** Optional normalizer applied after JSON.parse and before Zod validation. */
  normalize?: (raw: unknown) => unknown;
  system?: string;
  temperature?: number;
  maxTokens?: number;
};

export type ChatOptions = {
  temperature?: number;
  maxTokens?: number;
};

export type StreamChunk = {
  delta: string;
  done: boolean;
};

export interface AiProvider {
  generateText(options: GenerateTextOptions): Promise<AiTextResult>;
  generateStructured<T>(
    options: GenerateStructuredOptions<T>,
  ): Promise<AiStructuredResult<T>>;
  chat(
    messages: AiChatMessage[],
    options?: ChatOptions,
  ): Promise<AiTextResult>;
  stream(
    messages: AiChatMessage[],
    options?: ChatOptions,
  ): AsyncIterable<StreamChunk>;
}
