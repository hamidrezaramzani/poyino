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
  ListCandidatesQuerySchema,
  UpdateCandidateNoteSchema,
  UpdateCandidateStatusSchema,
  UpdateInterviewSchema,
  type CompleteInterviewInput,
  type CreateCandidateNoteInput,
  type CreateInterviewInput,
  type ListCandidatesQuery,
  type UpdateCandidateNoteInput,
  type UpdateCandidateStatusInput,
  type UpdateInterviewInput,
} from "@poyino/contracts";
import type { Response } from "express";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { CandidatesService } from "../services/candidates.service";

@Controller("jobs/:jobId/candidates")
@UseGuards(SessionAuthGuard)
export class CandidatesController {
  constructor(
    @Inject(CandidatesService)
    private readonly candidatesService: CandidatesService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Query(new ZodValidationPipe(ListCandidatesQuerySchema))
    query: ListCandidatesQuery,
  ) {
    return this.candidatesService.listForJob(
      user.organizationId,
      jobId,
      query,
    );
  }

  @Get(":candidateId")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
  ) {
    return this.candidatesService.getProfile(
      user.organizationId,
      jobId,
      candidateId,
    );
  }

  @Get(":candidateId/resume")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async downloadResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Res() res: Response,
  ) {
    const file = await this.candidatesService.downloadResume(
      user.organizationId,
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
      user.organizationId,
      user.id,
      jobId,
      candidateId,
      body,
    );
  }

  @Post(":candidateId/notes")
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
      user.organizationId,
      user.id,
      jobId,
      candidateId,
      body,
    );
  }

  @Patch(":candidateId/notes/:noteId")
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
      user.organizationId,
      user.id,
      jobId,
      candidateId,
      noteId,
      body,
    );
  }

  @Delete(":candidateId/notes/:noteId")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  deleteNote(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Param("noteId", ParseUUIDPipe) noteId: string,
  ) {
    return this.candidatesService.deleteNote(
      user.organizationId,
      user.id,
      jobId,
      candidateId,
      noteId,
    );
  }

  @Get(":candidateId/interviews")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  listInterviews(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
  ) {
    return this.candidatesService.listInterviews(
      user.organizationId,
      jobId,
      candidateId,
    );
  }

  @Post(":candidateId/interviews")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  createInterview(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Body(new ZodValidationPipe(CreateInterviewSchema))
    body: CreateInterviewInput,
  ) {
    return this.candidatesService.createInterview(
      user.organizationId,
      user.id,
      jobId,
      candidateId,
      body,
    );
  }

  @Patch(":candidateId/interviews/:interviewId")
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
    return this.candidatesService.updateInterview(
      user.organizationId,
      user.id,
      jobId,
      candidateId,
      interviewId,
      body,
    );
  }

  @Patch(":candidateId/interviews/:interviewId/cancel")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  cancelInterview(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Param("candidateId", ParseUUIDPipe) candidateId: string,
    @Param("interviewId", ParseUUIDPipe) interviewId: string,
  ) {
    return this.candidatesService.cancelInterview(
      user.organizationId,
      user.id,
      jobId,
      candidateId,
      interviewId,
    );
  }

  @Patch(":candidateId/interviews/:interviewId/complete")
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
    return this.candidatesService.completeInterview(
      user.organizationId,
      user.id,
      jobId,
      candidateId,
      interviewId,
      body,
    );
  }
}
