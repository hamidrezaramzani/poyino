import { Injectable } from "@nestjs/common";
import type { AppConfigSuccess } from "@poyino/contracts";
import { loadAppConfig } from "./app/config/app-stage.config";

@Injectable()
export class AppService {
  getStatus() {
    return {
      service: "poyino-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }

  getConfig(): AppConfigSuccess {
    return {
      success: true as const,
      config: loadAppConfig(),
    };
  }
}
