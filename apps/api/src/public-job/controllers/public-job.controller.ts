import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  AcceptInterviewSchema,
  AnalyzeResumeSchema,
  DeclineInterviewSchema,
  RequestInterviewRescheduleSchema,
  SubmitApplicationSchema,
  UploadResumeSchema,
  type AcceptInterviewInput,
  type AnalyzeResumeInput,
  type DeclineInterviewInput,
  type RequestInterviewRescheduleInput,
  type SubmitApplicationInput,
  type UploadResumeInput,
} from "@poyino/contracts";
import type { Response } from "express";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { InterviewsService } from "../../interviews/services/interviews.service";
import { PublicJobService } from "../services/public-job.service";

@Controller("public")
export class PublicJobController {
  constructor(
    @Inject(PublicJobService)
    private readonly publicJobService: PublicJobService,
    @Inject(InterviewsService)
    private readonly interviewsService: InterviewsService,
  ) {}

  @Get("tracking/:token")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getTracking(@Param("token") token: string) {
    return this.publicJobService.getTracking(token);
  }

  @Get("tracking/:token/notifications")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getTrackingNotifications(@Param("token") token: string) {
    return this.publicJobService.getTrackingNotifications(token);
  }

  @Post("tracking/:token/interviews/:interviewId/accept")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  acceptInterview(
    @Param("token") token: string,
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
    @Body(new ZodValidationPipe(AcceptInterviewSchema))
    _body: AcceptInterviewInput,
  ) {
    return this.interviewsService.acceptInterviewByTrackingToken(
      token,
      interviewId,
    );
  }

  @Post("tracking/:token/interviews/:interviewId/reschedule")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  requestReschedule(
    @Param("token") token: string,
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
    @Body(new ZodValidationPipe(RequestInterviewRescheduleSchema))
    body: RequestInterviewRescheduleInput,
  ) {
    return this.interviewsService.requestRescheduleByTrackingToken(
      token,
      interviewId,
      body,
    );
  }

  @Post("tracking/:token/interviews/:interviewId/decline")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  declineInterview(
    @Param("token") token: string,
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
    @Body(new ZodValidationPipe(DeclineInterviewSchema))
    body: DeclineInterviewInput,
  ) {
    return this.interviewsService.declineInterviewByTrackingToken(
      token,
      interviewId,
      body,
    );
  }

  @Get(":orgSlug/logo")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  async getLogo(
    @Param("orgSlug") orgSlug: string,
    @Res() response: Response,
  ) {
    const file = await this.publicJobService.getOrganizationLogo(orgSlug);
    response.setHeader("Content-Type", file.mimeType);
    response.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(file.fileName)}"`,
    );
    response.setHeader("Cache-Control", "public, max-age=3600");
    response.send(file.content);
  }

  @Get(":orgSlug/jobs/:jobId")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getJob(
    @Param("orgSlug") orgSlug: string,
    @Param("jobId", ParseUUIDPipe) jobId: string,
  ) {
    return this.publicJobService.getPublicJob(orgSlug, jobId);
  }

  @Post(":orgSlug/jobs/:jobId/upload")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  upload(
    @Param("orgSlug") orgSlug: string,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Body(new ZodValidationPipe(UploadResumeSchema)) body: UploadResumeInput,
  ) {
    return this.publicJobService.uploadResume(orgSlug, jobId, body);
  }

  @Post(":orgSlug/jobs/:jobId/analyze")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  analyze(
    @Param("orgSlug") orgSlug: string,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Body(new ZodValidationPipe(AnalyzeResumeSchema)) body: AnalyzeResumeInput,
  ) {
    return this.publicJobService.analyzeResume(orgSlug, jobId, body);
  }

  @Post(":orgSlug/jobs/:jobId/apply")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  apply(
    @Param("orgSlug") orgSlug: string,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Body(new ZodValidationPipe(SubmitApplicationSchema))
    body: SubmitApplicationInput,
  ) {
    return this.publicJobService.submitApplication(orgSlug, jobId, body);
  }
}
