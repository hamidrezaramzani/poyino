import { Controller, Get, HttpCode, HttpStatus, Inject } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get("health")
  getHealth() {
    return this.appService.getStatus();
  }

  @Get("config")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  getConfig() {
    return this.appService.getConfig();
  }
}
