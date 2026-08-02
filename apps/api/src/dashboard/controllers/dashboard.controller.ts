import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { RequirePermission } from "../../authentication/decorators/require-permission.decorator";
import { PermissionsGuard } from "../../authentication/guards/permissions.guard";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { DashboardService } from "../services/dashboard.service";

@Controller("dashboard")
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(
    @Inject(DashboardService)
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  @RequirePermission("dashboard:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getOverview(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getOverview(user);
  }
}
