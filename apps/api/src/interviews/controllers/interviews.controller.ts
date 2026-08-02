import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  CalendarInterviewsQuerySchema,
  UpdateInterviewStatusSchema,
  type CalendarInterviewsQuery,
  type UpdateInterviewStatusInput,
} from "@poyino/contracts";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { RequirePermission } from "../../authentication/decorators/require-permission.decorator";
import { PermissionsGuard } from "../../authentication/guards/permissions.guard";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { InterviewsService } from "../services/interviews.service";

@Controller("interviews")
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class InterviewsController {
  constructor(
    @Inject(InterviewsService)
    private readonly interviewsService: InterviewsService,
  ) {}

  @Get("calendar")
  @RequirePermission("interviews:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  calendar(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(CalendarInterviewsQuerySchema))
    query: CalendarInterviewsQuery,
  ) {
    return this.interviewsService.listCalendar(user, query);
  }

  @Get("recruiters")
  @RequirePermission("interviews:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  recruiters(@CurrentUser() user: AuthenticatedUser) {
    return this.interviewsService.listOrgRecruiters(user);
  }

  @Patch(":interviewId/status")
  @RequirePermission("interviews:complete")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
    @Body(new ZodValidationPipe(UpdateInterviewStatusSchema))
    body: UpdateInterviewStatusInput,
  ) {
    return this.interviewsService.updateStageStatus(
      user,
      interviewId,
      body,
    );
  }
}
