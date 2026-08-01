# AI Module

Reusable, provider-independent AI infrastructure for Poyino.

This module does **not** implement business features (jobs, resumes, candidates).
Business modules call `AiService` and supply their own prompts and Zod schemas.

## Architecture

```
ai/
  ai.module.ts          # Nest module (global), ConfigModule + provider wiring
  ai.service.ts         # Public facade used by business modules
  config/               # Env validation / config loading
  constants/            # Tokens and defaults
  dto/                  # Shared config types
  exceptions/           # Typed AI errors
  interfaces/           # AiProvider contract
  logging/              # Pino logger (no secrets / prompt / PII)
  providers/
    openai.provider.ts  # OpenAI-compatible client (Liara today)
  prompts/              # Future prompt modules (empty for now)
```

Business code depends only on `AiService`. Swapping providers means changing
the `AI_PROVIDER` binding in `ai.module.ts` — not job/resume modules.

## Responsibilities

- Initialize the OpenAI-compatible client from config
- Expose reusable methods: `generateText`, `generateStructured`, `chat`, `stream`
- Hide provider implementation details
- Validate required env vars on startup (fail fast)
- Convert provider failures into typed `AiException` subclasses
- Log request lifecycle with Pino (start, finish, duration, token usage)

## Configuration

Required environment variables:

```bash
AI_BASE_URL=
AI_API_KEY=
AI_MODEL=openai/gpt-5-mini
```

Liara requires the provider-prefixed model id (e.g. `openai/gpt-5-mini`), not the short name.

The OpenAI-compatible client is created once when the Nest app boots (`OpenAiProvider`
constructor) and warms the TLS/keep-alive connection in `onModuleInit`, so later
requests reuse that connection.

Optional:

```bash
AI_TIMEOUT_MS=60000
AI_LOG_LEVEL=info
```

Read via NestJS `ConfigService`. Application startup fails if required vars are missing.

## Public API

```ts
import { AiService } from "../ai/ai.service";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  summary: z.string(),
});

const result = await this.aiService.generateStructured({
  system: "You extract structured data from text.",
  prompt: userInput,
  schema,
  schemaName: "ExamplePayload",
});

// result.data is typed as { title: string; summary: string }
```

Other methods:

- `generateText({ prompt, system? })` → `{ text, usage? }`
- `chat(messages, options?)` → `{ text, usage? }`
- `stream(messages, options?)` → prepared; currently throws `AiNotImplementedException`

## Error handling

| Exception | When |
|-----------|------|
| `AiNetworkException` | Connection / network failure |
| `AiTimeoutException` | Request timeout |
| `AiInvalidResponseException` | Empty, non-JSON, or schema-invalid output |
| `AiProviderUnavailableException` | 429 / 5xx / other provider outages |
| `AiNotImplementedException` | Capability not ready (e.g. stream) |

## Logging rules

Logged: operation name, duration, model, token usage, success/error code.

Never logged: API keys, prompt contents, message bodies, user personal data.

## Future providers

Implement `AiProvider` for Azure OpenAI, Anthropic, Gemini, DeepSeek, or a local LLM,
register it as `AI_PROVIDER`, and leave business modules unchanged.
