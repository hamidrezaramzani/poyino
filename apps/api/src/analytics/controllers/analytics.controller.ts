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
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { AnalyticsService } from "../services/analytics.service";

@Controller("analytics")
@UseGuards(SessionAuthGuard)
export class AnalyticsController {
  constructor(
    @Inject(AnalyticsService)
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get("dashboard")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  dashboard(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(AnalyticsQuerySchema)) query: AnalyticsQuery,
  ) {
    return this.analyticsService.getDashboard(user.organizationId, query);
  }

  @Get("funnel")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  funnel(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(AnalyticsQuerySchema)) query: AnalyticsQuery,
  ) {
    return this.analyticsService.getFunnel(user.organizationId, query);
  }

  @Get("jobs")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  jobs(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(AnalyticsQuerySchema)) query: AnalyticsQuery,
  ) {
    return this.analyticsService.getJobPerformance(user.organizationId, query);
  }

  @Get("trends")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  trends(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(AnalyticsQuerySchema)) query: AnalyticsQuery,
  ) {
    return this.analyticsService.getTrends(user.organizationId, query);
  }
}
