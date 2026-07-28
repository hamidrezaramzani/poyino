import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getStatus() {
    return {
      service: "poyino-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
