import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  ListBetaFeedbackQuerySchema,
  type ListBetaFeedbackQuery,
} from "@poyino/contracts";
import { RequirePlatformAdmin } from "../../authentication/decorators/require-platform-admin.decorator";
import { PlatformAdminGuard } from "../../authentication/guards/platform-admin.guard";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { FeedbackService } from "../services/feedback.service";

@Controller("feedback/admin")
@UseGuards(SessionAuthGuard, PlatformAdminGuard)
@RequirePlatformAdmin()
export class FeedbackAdminController {
  constructor(
    @Inject(FeedbackService) private readonly feedbackService: FeedbackService,
  ) {}

  @Get("analytics")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  analytics(@Query("surveyKey") surveyKey?: string) {
    return this.feedbackService.getAdminAnalytics(surveyKey);
  }

  @Get("responses")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  list(
    @Query(new ZodValidationPipe(ListBetaFeedbackQuerySchema))
    query: ListBetaFeedbackQuery,
  ) {
    return this.feedbackService.listAdmin(query);
  }

  @Get("responses/:responseId")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  get(@Param("responseId", ParseUUIDPipe) responseId: string) {
    return this.feedbackService.getAdmin(responseId);
  }
}
