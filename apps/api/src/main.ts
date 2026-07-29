import { config } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ApiExceptionFilter } from "./common/filters/api-exception.filter";

const apiRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
config({ path: resolve(apiRoot, ".env") });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

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
