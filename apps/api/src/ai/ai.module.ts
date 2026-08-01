import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateAiEnv } from "./config/ai.config";
import { AI_PROVIDER } from "./constants/ai.constants";
import { AiService } from "./ai.service";
import { AiLogger } from "./logging/ai.logger";
import { OpenAiProvider } from "./providers/openai.provider";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateAiEnv,
    }),
  ],
  providers: [
    AiLogger,
    OpenAiProvider,
    {
      provide: AI_PROVIDER,
      useExisting: OpenAiProvider,
    },
    AiService,
  ],
  exports: [AiService, AI_PROVIDER],
})
export class AiModule {}
