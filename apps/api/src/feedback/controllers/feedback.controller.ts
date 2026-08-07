import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  SubmitBetaFeedbackSchema,
  type SubmitBetaFeedbackInput,
} from "@poyino/contracts";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { RequirePermission } from "../../authentication/decorators/require-permission.decorator";
import { PermissionsGuard } from "../../authentication/guards/permissions.guard";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { FeedbackService } from "../services/feedback.service";

@Controller("feedback")
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class FeedbackController {
  constructor(
    @Inject(FeedbackService) private readonly feedbackService: FeedbackService,
  ) {}

  @Get("eligibility")
  @RequirePermission("feedback:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  eligibility(@CurrentUser() user: AuthenticatedUser) {
    return this.feedbackService.getEligibility(user);
  }

  @Get("me")
  @RequirePermission("feedback:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.feedbackService.getOrgSubmission(user);
  }

  @Post()
  @RequirePermission("feedback:submit")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  submit(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(SubmitBetaFeedbackSchema))
    body: SubmitBetaFeedbackInput,
  ) {
    return this.feedbackService.submit(user, body);
  }
}
