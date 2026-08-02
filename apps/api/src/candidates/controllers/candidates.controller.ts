import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  CompleteInterviewSchema,
  CreateCandidateNoteSchema,
  CreateInterviewSchema,
  InterviewAiRequestSchema,
  InterviewHiringDecisionSchema,
  ListCandidatesQuerySchema,
  UpdateCandidateNoteSchema,
  UpdateCandidateStatusSchema,
  UpdateInterviewSchema,
  type CompleteInterviewInput,
  type CreateCandidateNoteInput,
  type CreateInterviewInput,
  type InterviewAiRequest,
  type InterviewHiringDecisionInput,
  type ListCandidatesQuery,
  type UpdateCandidateNoteInput,
  type UpdateCandidateStatusInput,
  type UpdateInterviewInput,
} from "@poyino/contracts";
import type { Response } from "express";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { RequirePermission } from "../../authentication/decorators/require-permission.decorator";
import { PermissionsGuard } from "../../authentication/guards/permissions.guard";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { InterviewsService } from "../../interviews/services/interviews.service";
import { CandidatesService } from "../services/candidates.service";

@Controller("jobs/:jobId/candidates")
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class CandidatesController {
  constructor(
    @Inject(CandidatesService)
    private readonly candidatesService: CandidatesService,
    @Inject(InterviewsService)
    private readonly interviewsService: InterviewsService,
  ) {}

  @Get()
  @RequirePermission("candidates:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Query(new ZodValidationPipe(ListCandidatesQuerySchema))
    query: ListCandidatesQuery,
  ) {
    return this.candidatesService.listForJob(user, jobId, query);
  }

  @Get(":candidateId")
  @RequirePermission("candidates:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
  ) {
    return this.candidatesService.getProfile(user, jobId, candidateId);
  }

  @Get(":candidateId/resume")
  @RequirePermission("candidates:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async downloadResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Res() res: Response,
  ) {
    const file = await this.candidatesService.downloadResume(
      user,
      jobId,
      candidateId,
    );

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(file.fileName)}"`,
    );
    res.send(file.content);
  }

  @Patch(":candidateId/status")
  @RequirePermission("candidates:update")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Body(new ZodValidationPipe(UpdateCandidateStatusSchema))
    body: UpdateCandidateStatusInput,
  ) {
    return this.candidatesService.updateStatus(
      user,
      jobId,
      candidateId,
      body,
    );
  }

  @Post(":candidateId/notes")
  @RequirePermission("interviews:notes")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  createNote(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Body(new ZodValidationPipe(CreateCandidateNoteSchema))
    body: CreateCandidateNoteInput,
  ) {
    return this.candidatesService.createNote(
      user,
      jobId,
      candidateId,
      body,
    );
  }

  @Patch(":candidateId/notes/:noteId")
  @RequirePermission("interviews:notes")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  updateNote(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Param("noteId", ParseUUIDPipe) noteId: string,
    @Body(new ZodValidationPipe(UpdateCandidateNoteSchema))
    body: UpdateCandidateNoteInput,
  ) {
    return this.candidatesService.updateNote(
      user,
      jobId,
      candidateId,
      noteId,
      body,
    );
  }

  @Delete(":candidateId/notes/:noteId")
  @RequirePermission("interviews:notes")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  deleteNote(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Param("noteId", ParseUUIDPipe) noteId: string,
  ) {
    return this.candidatesService.deleteNote(
      user,
      jobId,
      candidateId,
      noteId,
    );
  }

  @Get(":candidateId/interviews")
  @RequirePermission("interviews:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  listInterviews(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
  ) {
    return this.interviewsService.getProcess(user, jobId, candidateId);
  }

  @Post(":candidateId/interviews")
  @RequirePermission("interviews:schedule")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  createInterview(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Body(new ZodValidationPipe(CreateInterviewSchema))
    body: CreateInterviewInput,
  ) {
    return this.interviewsService.createStage(
      user,
      jobId,
      candidateId,
      body,
    );
  }

  @Patch(":candidateId/interviews/:interviewId")
  @RequirePermission("interviews:schedule")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  updateInterview(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
    @Body(new ZodValidationPipe(UpdateInterviewSchema))
    body: UpdateInterviewInput,
  ) {
    return this.interviewsService.updateStage(
      user,
      jobId,
      candidateId,
      interviewId,
      body,
    );
  }

  @Patch(":candidateId/interviews/:interviewId/cancel")
  @RequirePermission("interviews:schedule")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  cancelInterview(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
  ) {
    return this.interviewsService.cancelStage(
      user,
      jobId,
      candidateId,
      interviewId,
    );
  }

  @Patch(":candidateId/interviews/:interviewId/complete")
  @RequirePermission("interviews:complete")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  completeInterview(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
    @Body(new ZodValidationPipe(CompleteInterviewSchema))
    body: CompleteInterviewInput,
  ) {
    return this.interviewsService.completeStage(
      user,
      jobId,
      candidateId,
      interviewId,
      body,
    );
  }

  @Post(":candidateId/interview-ai")
  @RequirePermission("ai:generate")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  generateInterviewAi(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Body(new ZodValidationPipe(InterviewAiRequestSchema))
    body: InterviewAiRequest,
  ) {
    return this.interviewsService.generateInterviewAi(
      user,
      jobId,
      candidateId,
      body,
    );
  }

  @Post(":candidateId/interview-summary")
  @RequirePermission("ai:generate")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  generateInterviewSummary(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
  ) {
    return this.interviewsService.generateInterviewSummary(
      user,
      jobId,
      candidateId,
    );
  }

  @Post(":candidateId/interviews/decision")
  @RequirePermission("hiring:decide")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  hiringDecision(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Body(new ZodValidationPipe(InterviewHiringDecisionSchema))
    body: InterviewHiringDecisionInput,
  ) {
    return this.interviewsService.hiringDecision(
      user,
      jobId,
      candidateId,
      body,
    );
  }
}
