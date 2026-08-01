import { Inject, Injectable } from "@nestjs/common";
import { AI_PROVIDER } from "./constants/ai.constants";
import { AiException } from "./exceptions/ai.exceptions";
import type {
  AiChatMessage,
  AiProvider,
  AiStructuredResult,
  AiTextResult,
  ChatOptions,
  GenerateStructuredOptions,
  GenerateTextOptions,
  StreamChunk,
} from "./interfaces/ai-provider.interface";
import { AiLogger } from "./logging/ai.logger";

@Injectable()
export class AiService {
  constructor(
    @Inject(AI_PROVIDER) private readonly provider: AiProvider,
    @Inject(AiLogger) private readonly aiLogger: AiLogger,
  ) {}

  async generateText(options: GenerateTextOptions): Promise<AiTextResult> {
    return this.run("generateText", () => this.provider.generateText(options));
  }

  async generateStructured<T>(
    options: GenerateStructuredOptions<T>,
  ): Promise<AiStructuredResult<T>> {
    return this.run("generateStructured", () =>
      this.provider.generateStructured(options),
    );
  }

  async chat(
    messages: AiChatMessage[],
    options?: ChatOptions,
  ): Promise<AiTextResult> {
    return this.run("chat", () => this.provider.chat(messages, options));
  }

  async *stream(
    messages: AiChatMessage[],
    options?: ChatOptions,
  ): AsyncIterable<StreamChunk> {
    this.aiLogger.requestStart("stream");
    const startedAt = Date.now();

    try {
      for await (const chunk of this.provider.stream(messages, options)) {
        yield chunk;
      }

      this.aiLogger.requestFinish("stream", {
        durationMs: Date.now() - startedAt,
        success: true,
      });
    } catch (error) {
      this.aiLogger.requestFinish("stream", {
        durationMs: Date.now() - startedAt,
        success: false,
        errorCode: error instanceof AiException ? error.code : "UNKNOWN",
        providerStatus:
          error instanceof AiException ? error.providerStatus : undefined,
        providerCode:
          error instanceof AiException ? error.providerCode : undefined,
        validationPaths:
          error instanceof AiException ? error.validationPaths : undefined,
      });
      throw error;
    }
  }

  private async run<
    T extends { usage?: AiTextResult["usage"]; model?: string },
  >(operation: string, execute: () => Promise<T>): Promise<T> {
    this.aiLogger.requestStart(operation);
    const startedAt = Date.now();

    try {
      const result = await execute();
      this.aiLogger.requestFinish(operation, {
        durationMs: Date.now() - startedAt,
        success: true,
        model: result.model,
        promptTokens: result.usage?.promptTokens,
        completionTokens: result.usage?.completionTokens,
        totalTokens: result.usage?.totalTokens,
      });
      return result;
    } catch (error) {
      this.aiLogger.requestFinish(operation, {
        durationMs: Date.now() - startedAt,
        success: false,
        errorCode: error instanceof AiException ? error.code : "UNKNOWN",
        providerStatus:
          error instanceof AiException ? error.providerStatus : undefined,
        providerCode:
          error instanceof AiException ? error.providerCode : undefined,
        validationPaths:
          error instanceof AiException ? error.validationPaths : undefined,
      });
      throw error;
    }
  }
}
