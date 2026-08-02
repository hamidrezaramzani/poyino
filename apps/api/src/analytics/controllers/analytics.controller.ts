import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  AnalyticsQuerySchema,
  type AnalyticsQuery,
} from "@poyino/contracts";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { RequirePermission } from "../../authentication/decorators/require-permission.decorator";
import { PermissionsGuard } from "../../authentication/guards/permissions.guard";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { AnalyticsService } from "../services/analytics.service";

@Controller("analytics")
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class AnalyticsController {
  constructor(
    @Inject(AnalyticsService)
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get("dashboard")
  @RequirePermission("reports:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  dashboard(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(AnalyticsQuerySchema)) query: AnalyticsQuery,
  ) {
    return this.analyticsService.getDashboard(user, query);
  }

  @Get("funnel")
  @RequirePermission("reports:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  funnel(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(AnalyticsQuerySchema)) query: AnalyticsQuery,
  ) {
    return this.analyticsService.getFunnel(user, query);
  }

  @Get("jobs")
  @RequirePermission("reports:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  jobs(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(AnalyticsQuerySchema)) query: AnalyticsQuery,
  ) {
    return this.analyticsService.getJobPerformance(user, query);
  }

  @Get("trends")
  @RequirePermission("reports:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  trends(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(AnalyticsQuerySchema)) query: AnalyticsQuery,
  ) {
    return this.analyticsService.getTrends(user, query);
  }
}
