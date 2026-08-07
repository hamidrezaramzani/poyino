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
  GetAiCreditHistoryQuerySchema,
  type GetAiCreditHistoryQuery,
} from "@poyino/contracts";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { RequirePermission } from "../../authentication/decorators/require-permission.decorator";
import { PermissionsGuard } from "../../authentication/guards/permissions.guard";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { CreditsService } from "../services/credits.service";

@Controller("credits")
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class CreditsController {
  constructor(
    @Inject(CreditsService) private readonly creditsService: CreditsService,
  ) {}

  @Get()
  @RequirePermission("credits:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getRemaining(@CurrentUser() user: AuthenticatedUser) {
    return this.creditsService.getRemainingForUser(user);
  }

  @Get("history")
  @RequirePermission("credits:manage")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(GetAiCreditHistoryQuerySchema))
    query: GetAiCreditHistoryQuery,
  ) {
    return this.creditsService.getUsageHistory(user, query);
  }

  @Get("breakdown")
  @RequirePermission("credits:manage")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getBreakdown(@CurrentUser() user: AuthenticatedUser) {
    return this.creditsService.getConsumptionBreakdown(user);
  }
}
