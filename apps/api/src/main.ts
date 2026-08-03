import { config } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { MAX_RESUME_UPLOAD_BYTES } from "@poyino/contracts";
import { AppModule } from "./app.module";
import { ApiExceptionFilter } from "./common/filters/api-exception.filter";

const apiRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
config({ path: resolve(apiRoot, ".env") });

/** Base64 expands ~4/3; leave headroom for JSON wrappers around resume uploads. */
const JSON_BODY_LIMIT_BYTES = Math.ceil(MAX_RESUME_UPLOAD_BYTES * (4 / 3)) + 1024 * 1024;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  const port = Number(process.env.PORT ?? 3000);
  const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

  app.useWebSocketAdapter(new IoAdapter(app));
  app.useBodyParser("json", { limit: JSON_BODY_LIMIT_BYTES });
  app.useBodyParser("urlencoded", {
    limit: JSON_BODY_LIMIT_BYTES,
    extended: true,
  });

  app.setGlobalPrefix("api");
  app.useGlobalFilters(new ApiExceptionFilter());
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  await app.listen(port);

  Logger.log(`API listening on http://localhost:${port}/api`, "Bootstrap");
}

void bootstrap();
