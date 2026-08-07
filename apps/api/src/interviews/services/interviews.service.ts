import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CandidateErrorCode,
  InterviewAiPreparationSchema,
  InterviewSummarySchema,
  JobMatchAnalysisSchema,
  NotificationEventName,
  ResumeAnalysisSchema,
  TrackingErrorCode,
  type CalendarInterviewsQuery,
  type CompleteInterviewInput,
  type CreateInterviewInput,
  type DeclineInterviewInput,
  type InterviewAiRequest,
  type InterviewHiringDecisionInput,
  type RequestInterviewRescheduleInput,
  type UpdateInterviewInput,
  type UpdateInterviewStatusInput,
  isOrgWideRole,
  type OrganizationRole,
} from "@poyino/contracts";
import type {
  Interview,
  InterviewCandidateResponse,
  InterviewProcessStatus,
  InterviewResult,
  InterviewStatus,
  InterviewStatusActor,
  Prisma,
} from "@prisma/client";
import { createHash } from "node:crypto";
import { AiException } from "../../ai/exceptions/ai.exceptions";
import { AiService } from "../../ai/ai.service";
import {
  assertDepartmentAccess,
  departmentScopeFilter,
} from "../../authentication/lib/department-scope";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import {
  buildInterviewAiPrompt,
  buildInterviewAiSystemPrompt,
  interviewAiPreparationZodSchema,
  interviewAiSchemaHint,
  normalizeInterviewAiPreparation,
  resolveInterviewAiLanguage,
} from "../../candidates/ai/generate-interview-prep";
import {
  buildInterviewSummaryPrompt,
  buildInterviewSummarySystemPrompt,
  interviewSummarySchemaHint,
  interviewSummaryZodSchema,
  normalizeInterviewSummary,
} from "../../candidates/ai/generate-interview-summary";
import { DomainEventPublisher } from "../../notifications/services/domain-event.publisher";
import { RecipientResolverService } from "../../notifications/services/recipient-resolver.service";
import { PrismaService } from "../../prisma/prisma.service";

const EDITABLE_STATUSES: InterviewStatus[] = [
  "DRAFT",
  "SCHEDULED",
  "WAITING_CANDIDATE_CONFIRMATION",
  "ACCEPTED",
  "RESCHEDULE_REQUESTED",
  "DECLINED",
  "IN_PROGRESS",
];

const RESPONDABLE_STATUSES: InterviewStatus[] = [
  "SCHEDULED",
  "WAITING_CANDIDATE_CONFIRMATION",
];

const ACTIVE_CONFLICT_STATUSES: InterviewStatus[] = [
  "SCHEDULED",
  "WAITING_CANDIDATE_CONFIRMATION",
  "ACCEPTED",
  "RESCHEDULE_REQUESTED",
  "IN_PROGRESS",
];

const DEFAULT_DURATION_MS = 60 * 60 * 1000;

type InterviewWithRecruiter = Interview & {
  recruiterUser?: { id: string; email: string } | null;
};

@Injectable()
export class InterviewsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AiService) private readonly aiService: AiService,
    @Inject(DomainEventPublisher)
    private readonly domainEvents: DomainEventPublisher,
    @Inject(RecipientResolverService)
    private readonly recipients: RecipientResolverService,
  ) {}

  async getProcess(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
  ) {
    const application = await this.requireApplication(
      user,
      jobId,
      candidateId,
    );
    const process = await this.ensureProcess(application);
    return {
      success: true as const,
      process: await this.mapProcess(process.id),
    };
  }

  async createStage(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
    input: CreateInterviewInput,
  ) {
    const organizationId = user.organizationId;
    const application = await this.requireApplication(
      user,
      jobId,
      candidateId,
    );
    const scheduledAt = parseFutureDate(input.scheduledAt);
    await this.validateRecruiter(organizationId, input.recruiterUserId);
    const process = await this.ensureProcess(application);
    const conflict = await this.hasRecruiterConflict(
      organizationId,
      input.recruiterUserId ?? null,
      scheduledAt,
      null,
    );

    const interview = await this.prisma.$transaction(async (tx) => {
      const created = await tx.interview.create({
        data: {
          processId: process.id,
          applicationId: application.id,
          organizationId,
          jobId,
          candidateId,
          name: input.name,
          scheduledAt,
          type: input.type,
          status: "WAITING_CANDIDATE_CONFIRMATION",
          location: input.location,
          meetingUrl: input.meetingUrl,
          internalNotes: input.internalNotes,
          candidateNotes: input.candidateNotes,
          recruiterUserId: input.recruiterUserId ?? null,
          createdByUserId: user.id,
        },
        include: { recruiterUser: { select: { id: true, email: true } } },
      });

      await recordInterviewStatusEvent(tx, {
        interviewId: created.id,
        fromStatus: null,
        toStatus: "WAITING_CANDIDATE_CONFIRMATION",
        actorType: "RECRUITER",
        actorUserId: user.id,
      });

      if (process.status === "WAITING") {
        await tx.interviewProcess.update({
          where: { id: process.id },
          data: { status: "INTERVIEWING" },
        });
      }

      if (application.status !== "INTERVIEW_SCHEDULED") {
        await tx.application.update({
          where: { id: application.id },
          data: { status: "INTERVIEW_SCHEDULED" },
        });
        await tx.candidate.update({
          where: { id: candidateId },
          data: { status: "INTERVIEW_SCHEDULED" },
        });
        await tx.applicationStatusEvent.create({
          data: {
            applicationId: application.id,
            status: "INTERVIEW_SCHEDULED",
          },
        });
      }

      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "INTERVIEW_SCHEDULED",
          description: `Interview scheduled: ${input.name}`,
          actorUserId: user.id,
          metadata: { interviewId: created.id },
        },
      });

      return created;
    });

    const recruiters = await this.recipients.resolveRecruiters(organizationId, {
      departmentId: application.job.departmentId,
      excludeUserId: user.id,
    });
    const targetUserIds = [
      ...new Set([
        ...recruiters,
        ...(interview.recruiterUserId ? [interview.recruiterUserId] : []),
      ]),
    ];
    this.domainEvents.publishNamed(NotificationEventName.INTERVIEW_CREATED, {
      organizationId,
      triggeredBy: user.id,
      resourceType: "interview",
      resourceId: interview.id,
      targetUserIds,
      applicationId: application.id,
      includeCandidate: true,
      metadata: {
        interviewName: interview.name,
        candidateName: application.candidate.fullName,
        jobId,
        candidateId,
        jobTitle: application.job.title,
      },
    });

    return {
      success: true as const,
      interview: mapInterview(interview),
      conflict,
    };
  }

  async updateStage(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
    interviewId: string,
    input: UpdateInterviewInput,
  ) {
    const organizationId = user.organizationId;
    const application = await this.requireApplication(
      user,
      jobId,
      candidateId,
    );
    const interview = await this.requireEditableInterview(
      application.id,
      interviewId,
    );
    const scheduledAt = parseFutureDate(input.scheduledAt);
    await this.validateRecruiter(organizationId, input.recruiterUserId);
    const conflict = await this.hasRecruiterConflict(
      organizationId,
      input.recruiterUserId ?? null,
      scheduledAt,
      interview.id,
    );

    const timeChanged =
      scheduledAt.getTime() !== interview.scheduledAt.getTime();
    const shouldRequestConfirmation =
      timeChanged ||
      interview.status === "RESCHEDULE_REQUESTED" ||
      interview.status === "DECLINED" ||
      interview.status === "DRAFT" ||
      interview.status === "SCHEDULED";
    const nextStatus: InterviewStatus = shouldRequestConfirmation
      ? "WAITING_CANDIDATE_CONFIRMATION"
      : interview.status;
    const wasReschedule =
      interview.status === "RESCHEDULE_REQUESTED" || timeChanged;

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.interview.update({
        where: { id: interview.id },
        data: {
          name: input.name,
          scheduledAt,
          type: input.type,
          location: input.location,
          meetingUrl: input.meetingUrl,
          internalNotes: input.internalNotes,
          candidateNotes: input.candidateNotes,
          recruiterUserId: input.recruiterUserId ?? null,
          status: nextStatus,
          ...(shouldRequestConfirmation
            ? {
                candidateResponse: null,
                respondedAt: null,
                responseMessage: null,
                proposedScheduledAt: null,
              }
            : {}),
        },
        include: { recruiterUser: { select: { id: true, email: true } } },
      });

      if (nextStatus !== interview.status) {
        await recordInterviewStatusEvent(tx, {
          interviewId: interview.id,
          fromStatus: interview.status,
          toStatus: nextStatus,
          actorType: "RECRUITER",
          actorUserId: user.id,
        });
      }

      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: wasReschedule ? "INTERVIEW_RESCHEDULED" : "INTERVIEW_UPDATED",
          description: wasReschedule
            ? `Interview rescheduled: ${input.name}`
            : `Interview updated: ${input.name}`,
          actorUserId: user.id,
          metadata: { interviewId: interview.id },
        },
      });

      return result;
    });

    const recruiters = await this.recipients.resolveRecruiters(organizationId, {
      departmentId: application.job.departmentId,
      excludeUserId: user.id,
    });
    const targetUserIds = [
      ...new Set([
        ...recruiters,
        ...(updated.recruiterUserId ? [updated.recruiterUserId] : []),
      ]),
    ];
    const eventName = wasReschedule
      ? NotificationEventName.INTERVIEW_RESCHEDULED
      : NotificationEventName.INTERVIEW_UPDATED;
    this.domainEvents.publishNamed(eventName, {
      organizationId,
      triggeredBy: user.id,
      resourceType: "interview",
      resourceId: updated.id,
      targetUserIds,
      applicationId: application.id,
      includeCandidate: true,
      metadata: {
        interviewName: updated.name,
        candidateName: application.candidate.fullName,
        jobId,
        candidateId,
        jobTitle: application.job.title,
      },
    });

    return {
      success: true as const,
      interview: mapInterview(updated),
      conflict,
    };
  }

  async cancelStage(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
    interviewId: string,
  ) {
    const organizationId = user.organizationId;
    const application = await this.requireApplication(
      user,
      jobId,
      candidateId,
    );
    const interview = await this.requireEditableInterview(
      application.id,
      interviewId,
    );

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.interview.update({
        where: { id: interview.id },
        data: { status: "CANCELLED" },
        include: { recruiterUser: { select: { id: true, email: true } } },
      });

      await recordInterviewStatusEvent(tx, {
        interviewId: interview.id,
        fromStatus: interview.status,
        toStatus: "CANCELLED",
        actorType: "RECRUITER",
        actorUserId: user.id,
      });

      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "INTERVIEW_CANCELLED",
          description: `Interview cancelled: ${interview.name}`,
          actorUserId: user.id,
          metadata: { interviewId: interview.id },
        },
      });

      return result;
    });

    const recruiters = await this.recipients.resolveRecruiters(organizationId, {
      departmentId: application.job.departmentId,
      excludeUserId: user.id,
    });
    const targetUserIds = [
      ...new Set([
        ...recruiters,
        ...(updated.recruiterUserId ? [updated.recruiterUserId] : []),
      ]),
    ];
    this.domainEvents.publishNamed(NotificationEventName.INTERVIEW_CANCELLED, {
      organizationId,
      triggeredBy: user.id,
      resourceType: "interview",
      resourceId: updated.id,
      targetUserIds,
      applicationId: application.id,
      includeCandidate: true,
      metadata: {
        interviewName: interview.name,
        candidateName: application.candidate.fullName,
        jobId,
        candidateId,
        jobTitle: application.job.title,
      },
    });

    return { success: true as const, interview: mapInterview(updated) };
  }

  async completeStage(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
    interviewId: string,
    input: CompleteInterviewInput,
  ) {
    const organizationId = user.organizationId;
    const application = await this.requireApplication(
      user,
      jobId,
      candidateId,
    );
    const interview = await this.requireEditableInterview(
      application.id,
      interviewId,
    );
    const result = input.result ?? "PENDING";

    const updated = await this.prisma.$transaction(async (tx) => {
      const stage = await tx.interview.update({
        where: { id: interview.id },
        data: {
          status: "COMPLETED",
          result,
          internalNotes: input.internalNotes ?? interview.internalNotes,
          candidateNotes: input.candidateNotes ?? interview.candidateNotes,
        },
        include: { recruiterUser: { select: { id: true, email: true } } },
      });

      await recordInterviewStatusEvent(tx, {
        interviewId: interview.id,
        fromStatus: interview.status,
        toStatus: "COMPLETED",
        actorType: "RECRUITER",
        actorUserId: user.id,
        metadata: { result },
      });

      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "INTERVIEW_COMPLETED",
          description: `Interview completed: ${interview.name}`,
          actorUserId: user.id,
          metadata: { interviewId: interview.id, result },
        },
      });

      await this.syncProcessAfterStageOutcome(
        tx,
        interview.processId,
        application.id,
        candidateId,
        organizationId,
        user.id,
        result,
      );

      return stage;
    });

    const targetUserIds =
      await this.recipients.resolveRecruitersAndHiringManagers(organizationId, {
        departmentId: application.job.departmentId,
        excludeUserId: user.id,
      });
    this.domainEvents.publishNamed(NotificationEventName.INTERVIEW_COMPLETED, {
      organizationId,
      triggeredBy: user.id,
      resourceType: "interview",
      resourceId: updated.id,
      targetUserIds,
      applicationId: application.id,
      metadata: {
        interviewName: interview.name,
        candidateName: application.candidate.fullName,
        jobId,
        candidateId,
        jobTitle: application.job.title,
        result,
      },
    });

    return { success: true as const, interview: mapInterview(updated) };
  }

  async updateStageStatus(
    user: AuthenticatedUser,
    interviewId: string,
    input: UpdateInterviewStatusInput,
  ) {
    const organizationId = user.organizationId;
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, organizationId },
      include: { job: { select: { departmentId: true } } },
    });

    if (!interview) {
      throw new NotFoundException({
        success: false,
        error: {
          code: CandidateErrorCode.INTERVIEW_NOT_FOUND,
          message: "Interview not found.",
        },
      });
    }

    assertDepartmentAccess(user, interview.job.departmentId);

    const updated = await this.prisma.$transaction(async (tx) => {
      const data: Prisma.InterviewUpdateInput = {
        status: input.status,
      };

      if (input.result !== undefined) {
        data.result = input.result;
      }
      if (input.internalNotes !== undefined) {
        data.internalNotes = input.internalNotes;
      }
      if (input.status === "COMPLETED" && !input.result) {
        data.result = interview.result ?? "PENDING";
      }

      const stage = await tx.interview.update({
        where: { id: interview.id },
        data,
        include: { recruiterUser: { select: { id: true, email: true } } },
      });

      if (input.status !== interview.status) {
        await recordInterviewStatusEvent(tx, {
          interviewId: interview.id,
          fromStatus: interview.status,
          toStatus: input.status,
          actorType: "RECRUITER",
          actorUserId: user.id,
        });
      }

      const activity = activityForStatus(input.status);
      await tx.applicationActivityEvent.create({
        data: {
          applicationId: interview.applicationId,
          organizationId,
          type: activity.type,
          description: activity.description(interview.name),
          actorUserId: user.id,
          metadata: { interviewId: interview.id, status: input.status },
        },
      });

      if (input.status === "COMPLETED") {
        await this.syncProcessAfterStageOutcome(
          tx,
          interview.processId,
          interview.applicationId,
          interview.candidateId,
          organizationId,
          user.id,
          (input.result ?? interview.result ?? "PENDING") as InterviewResult,
        );
      } else if (input.status === "IN_PROGRESS") {
        await tx.interviewProcess.update({
          where: { id: interview.processId },
          data: { status: "INTERVIEWING" },
        });
      }

      return stage;
    });

    return { success: true as const, interview: mapInterview(updated) };
  }

  async acceptInterviewByTrackingToken(token: string, interviewId: string) {
    return this.respondByTrackingToken(token, interviewId, {
      response: "ACCEPTED",
      status: "ACCEPTED",
      activityType: "INTERVIEW_ACCEPTED",
      activityDescription: (name) => `Candidate accepted interview: ${name}`,
      notificationEvent: NotificationEventName.INTERVIEW_ACCEPTED_BY_CANDIDATE,
    });
  }

  async requestRescheduleByTrackingToken(
    token: string,
    interviewId: string,
    input: RequestInterviewRescheduleInput,
  ) {
    const proposedScheduledAt = input.proposedScheduledAt
      ? parseFutureDate(input.proposedScheduledAt)
      : null;

    return this.respondByTrackingToken(token, interviewId, {
      response: "RESCHEDULE_REQUESTED",
      status: "RESCHEDULE_REQUESTED",
      message: input.message ?? null,
      proposedScheduledAt,
      activityType: "INTERVIEW_RESCHEDULE_REQUESTED",
      activityDescription: (name) =>
        `Candidate requested reschedule: ${name}`,
      notificationEvent:
        NotificationEventName.INTERVIEW_RESCHEDULE_REQUESTED_BY_CANDIDATE,
    });
  }

  async declineInterviewByTrackingToken(
    token: string,
    interviewId: string,
    input: DeclineInterviewInput,
  ) {
    return this.respondByTrackingToken(token, interviewId, {
      response: "DECLINED",
      status: "DECLINED",
      message: input.message ?? null,
      activityType: "INTERVIEW_DECLINED",
      activityDescription: (name) => `Candidate declined interview: ${name}`,
      notificationEvent: NotificationEventName.INTERVIEW_DECLINED_BY_CANDIDATE,
    });
  }

  private async respondByTrackingToken(
    token: string,
    interviewId: string,
    options: {
      response: InterviewCandidateResponse;
      status: InterviewStatus;
      message?: string | null;
      proposedScheduledAt?: Date | null;
      activityType:
        | "INTERVIEW_ACCEPTED"
        | "INTERVIEW_RESCHEDULE_REQUESTED"
        | "INTERVIEW_DECLINED";
      activityDescription: (name: string) => string;
      notificationEvent:
        | typeof NotificationEventName.INTERVIEW_ACCEPTED_BY_CANDIDATE
        | typeof NotificationEventName.INTERVIEW_RESCHEDULE_REQUESTED_BY_CANDIDATE
        | typeof NotificationEventName.INTERVIEW_DECLINED_BY_CANDIDATE;
    },
  ) {
    const trackingTokenHash = hashTrackingToken(token);
    const application = await this.prisma.application.findFirst({
      where: { trackingTokenHash },
      select: {
        id: true,
        organizationId: true,
        jobId: true,
        candidateId: true,
        candidate: { select: { fullName: true } },
        job: { select: { title: true, departmentId: true } },
      },
    });

    if (!application) {
      throw new NotFoundException({
        success: false,
        error: {
          code: TrackingErrorCode.TRACKING_NOT_FOUND,
          message: "Tracking link not found.",
        },
      });
    }

    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, applicationId: application.id },
    });

    if (!interview) {
      throw new NotFoundException({
        success: false,
        error: {
          code: TrackingErrorCode.INTERVIEW_NOT_FOUND,
          message: "Interview not found.",
        },
      });
    }

    if (!RESPONDABLE_STATUSES.includes(interview.status)) {
      throw new BadRequestException({
        success: false,
        error: {
          code: TrackingErrorCode.INTERVIEW_NOT_RESPONDABLE,
          message: "This interview cannot receive a response.",
        },
      });
    }

    if (interview.scheduledAt.getTime() <= Date.now()) {
      throw new BadRequestException({
        success: false,
        error: {
          code: TrackingErrorCode.INTERVIEW_IN_PAST,
          message: "Only future interviews can be accepted or declined.",
        },
      });
    }

    const respondedAt = new Date();
    const updated = await this.prisma.$transaction(async (tx) => {
      const stage = await tx.interview.update({
        where: { id: interview.id },
        data: {
          status: options.status,
          candidateResponse: options.response,
          respondedAt,
          responseMessage: options.message ?? null,
          proposedScheduledAt: options.proposedScheduledAt ?? null,
        },
        include: { recruiterUser: { select: { id: true, email: true } } },
      });

      await recordInterviewStatusEvent(tx, {
        interviewId: interview.id,
        fromStatus: interview.status,
        toStatus: options.status,
        actorType: "CANDIDATE",
        message: options.message ?? null,
        metadata: {
          proposedScheduledAt: options.proposedScheduledAt?.toISOString() ?? null,
        },
      });

      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId: application.organizationId,
          type: options.activityType,
          description: options.activityDescription(interview.name),
          actorUserId: null,
          metadata: {
            interviewId: interview.id,
            response: options.response,
            message: options.message ?? null,
            proposedScheduledAt:
              options.proposedScheduledAt?.toISOString() ?? null,
          },
        },
      });

      return stage;
    });

    const recruiters = await this.recipients.resolveRecruiters(
      application.organizationId,
      { departmentId: application.job.departmentId },
    );
    const targetUserIds = [
      ...new Set([
        ...recruiters,
        ...(updated.recruiterUserId ? [updated.recruiterUserId] : []),
        updated.createdByUserId,
      ]),
    ];

    this.domainEvents.publishNamed(options.notificationEvent, {
      organizationId: application.organizationId,
      triggeredBy: null,
      resourceType: "interview",
      resourceId: updated.id,
      targetUserIds,
      applicationId: application.id,
      includeCandidate: false,
      metadata: {
        interviewName: updated.name,
        candidateName: application.candidate.fullName,
        jobId: application.jobId,
        candidateId: application.candidateId,
        jobTitle: application.job.title,
        message: options.message ?? null,
        proposedScheduledAt:
          options.proposedScheduledAt?.toISOString() ?? null,
      },
    });

    return {
      success: true as const,
      interview: mapPublicInterview(updated),
    };
  }

  async hiringDecision(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
    input: InterviewHiringDecisionInput,
  ) {
    const organizationId = user.organizationId;
    const application = await this.requireApplication(
      user,
      jobId,
      candidateId,
    );
    const process = await this.ensureProcess(application);
    const processStatus: InterviewProcessStatus =
      input.decision === "HIRE" ? "HIRED" : "FAILED";
    const appStatus = input.decision === "HIRE" ? "HIRED" : "REJECTED";

    await this.prisma.$transaction(async (tx) => {
      await tx.interviewProcess.update({
        where: { id: process.id },
        data: { status: processStatus },
      });
      await tx.application.update({
        where: { id: application.id },
        data: { status: appStatus },
      });
      await tx.candidate.update({
        where: { id: candidateId },
        data: { status: appStatus },
      });
      await tx.applicationStatusEvent.create({
        data: {
          applicationId: application.id,
          status: appStatus,
        },
      });
      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "INTERVIEW_PROCESS_UPDATED",
          description:
            input.decision === "HIRE"
              ? "Candidate hired after interview process"
              : "Candidate rejected after interview process",
          actorUserId: user.id,
          metadata: { decision: input.decision },
        },
      });
    });

    const targetUserIds =
      await this.recipients.resolveRecruitersAndHiringManagers(organizationId, {
        departmentId: application.job.departmentId,
        excludeUserId: user.id,
      });
    this.domainEvents.publishNamed(
      input.decision === "HIRE"
        ? NotificationEventName.CANDIDATE_HIRED
        : NotificationEventName.CANDIDATE_REJECTED,
      {
        organizationId,
        triggeredBy: user.id,
        resourceType: "application",
        resourceId: application.id,
        targetUserIds,
        applicationId: application.id,
        includeCandidate: true,
        metadata: {
          candidateName: application.candidate.fullName,
          jobId,
          candidateId,
          jobTitle: application.job.title,
          decision: input.decision,
        },
      },
    );

    return {
      success: true as const,
      process: await this.mapProcess(process.id),
    };
  }

  async listCalendar(user: AuthenticatedUser, query: CalendarInterviewsQuery) {
    const organizationId = user.organizationId;
    const scope = departmentScopeFilter(user);
    const from = new Date(query.from);
    const to = new Date(query.to);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
      throw new BadRequestException({
        success: false,
        error: {
          code: CandidateErrorCode.VALIDATION_ERROR,
          message: "Invalid calendar date range.",
        },
      });
    }

    const where: Prisma.InterviewWhereInput = {
      organizationId,
      scheduledAt: { gte: from, lte: to },
      ...(scope.departmentId
        ? { job: { departmentId: scope.departmentId } }
        : {}),
    };
    if (query.recruiterUserId) where.recruiterUserId = query.recruiterUserId;
    if (query.jobId) where.jobId = query.jobId;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

    const rows = await this.prisma.interview.findMany({
      where,
      orderBy: { scheduledAt: "asc" },
      include: {
        candidate: { select: { id: true, fullName: true } },
        job: { select: { id: true, title: true } },
        recruiterUser: { select: { id: true, email: true } },
      },
    });

    const conflictIds = detectConflicts(rows);

    const events = rows.map((row) => ({
      id: row.id,
      processId: row.processId,
      applicationId: row.applicationId,
      jobId: row.job.id,
      jobTitle: row.job.title,
      candidateId: row.candidate.id,
      candidateName: row.candidate.fullName,
      name: row.name,
      type: row.type,
      status: row.status,
      result: row.result,
      scheduledAt: row.scheduledAt.toISOString(),
      location: row.location,
      meetingUrl: row.meetingUrl,
      internalNotes: row.internalNotes,
      candidateNotes: row.candidateNotes,
      recruiterUserId: row.recruiterUserId,
      recruiterEmail: row.recruiterUser?.email ?? null,
      hasConflict: conflictIds.has(row.id),
    }));

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    const upcomingEnd = new Date(startOfToday);
    upcomingEnd.setDate(upcomingEnd.getDate() + 7);

    const today = events.filter((event) => {
      const at = new Date(event.scheduledAt);
      return at >= startOfToday && at <= endOfToday;
    });
    const upcoming = events.filter((event) => {
      const at = new Date(event.scheduledAt);
      return at > endOfToday && at <= upcomingEnd;
    });

    return {
      success: true as const,
      events,
      today,
      upcoming,
    };
  }

  async listOrgRecruiters(user: AuthenticatedUser) {
    const users = await this.prisma.user.findMany({
      where: {
        organizationId: user.organizationId,
        ...(isOrgWideRole(user.role as OrganizationRole)
          ? {}
          : { departmentId: user.departmentId }),
      },
      select: { id: true, email: true },
      orderBy: { email: "asc" },
    });
    return { success: true as const, recruiters: users };
  }

  async generateInterviewAi(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
    input: InterviewAiRequest,
  ) {
    const organizationId = user.organizationId;
    const application = await this.prisma.application.findFirst({
      where: { organizationId, jobId, candidateId },
      include: {
        candidate: true,
        job: {
          include: {
            skills: { include: { skill: true } },
            organization: { select: { language: true } },
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException({
        success: false,
        error: {
          code: CandidateErrorCode.CANDIDATE_NOT_FOUND,
          message: "Candidate not found.",
        },
      });
    }

    assertDepartmentAccess(user, application.job.departmentId);

    const interview = await this.prisma.interview.findFirst({
      where: {
        id: input.interviewId,
        applicationId: application.id,
        organizationId,
      },
    });

    if (!interview) {
      throw new NotFoundException({
        success: false,
        error: {
          code: CandidateErrorCode.INTERVIEW_NOT_FOUND,
          message: "Interview not found.",
        },
      });
    }

    const skills = Array.isArray(application.candidate.skills)
      ? application.candidate.skills.filter(
          (item): item is string => typeof item === "string",
        )
      : [];
    const requiredSkills = application.job.skills.map(
      (row) => row.skill.name,
    );
    const resumeAnalysis = ResumeAnalysisSchema.safeParse(application.aiAnalysis);
    const jobMatch = JobMatchAnalysisSchema.safeParse(
      application.jobMatchAnalysis,
    );

    try {
      const outputLanguage = resolveInterviewAiLanguage({
        organizationLanguage: application.job.organization.language || "fa",
        recruiterPrompt: input.prompt,
      });

      const result = await this.aiService.generateStructured({
        prompt: buildInterviewAiPrompt({
          language: application.job.organization.language || "fa",
          recruiterPrompt: input.prompt,
          interviewName: interview.name,
          interviewType: interview.type,
          jobTitle: application.job.title,
          department: application.job.department,
          employmentType: application.job.employmentType,
          workplaceType: application.job.workplaceType,
          jobDescription: application.job.description,
          responsibilities: application.job.responsibilities,
          requirements: application.job.requirements,
          requiredSkills,
          candidateFullName: application.candidate.fullName,
          candidateCurrentPosition: application.candidate.currentPosition,
          candidateSkills: skills,
          candidateExperience: application.candidate.experience,
          candidateEducation: application.candidate.education,
          resumeSummary: jobMatch.success
            ? jobMatch.data.executiveSummary
            : resumeAnalysis.success
              ? resumeAnalysis.data.experience.slice(0, 1000) || null
              : null,
          matchScore: jobMatch.success ? jobMatch.data.matchScore : null,
          missingSkills: jobMatch.success ? jobMatch.data.missingSkills : [],
          extractedText: application.extractedText,
        }),
        schema: interviewAiPreparationZodSchema,
        schemaName: "InterviewAiPreparation",
        schemaHint: interviewAiSchemaHint,
        normalize: normalizeInterviewAiPreparation,
        system: buildInterviewAiSystemPrompt(outputLanguage),
        temperature: 0.2,
        maxTokens: 3_500,
      });

      const generatedAt = new Date();
      const promptValue = input.prompt?.trim() || null;

      await this.prisma.interview.update({
        where: { id: interview.id },
        data: {
          aiPreparation: result.data,
          aiPrompt: promptValue,
          aiGeneratedAt: generatedAt,
        },
      });

      this.domainEvents.publishNamed(
        NotificationEventName.AI_INTERVIEW_QUESTIONS_GENERATED,
        {
          organizationId,
          triggeredBy: user.id,
          resourceType: "interview",
          resourceId: interview.id,
          targetUserIds: [user.id],
          applicationId: application.id,
          metadata: {
            interviewName: interview.name,
            candidateName: application.candidate.fullName,
            jobId,
            candidateId,
            jobTitle: application.job.title,
          },
        },
      );

      return {
        success: true as const,
        interviewId: interview.id,
        preparation: result.data,
        aiPrompt: promptValue,
        aiGeneratedAt: generatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof AiException) {
        const timedOut = error.code === "AI_TIMEOUT";
        throw new BadRequestException({
          success: false,
          error: {
            code: CandidateErrorCode.INTERVIEW_AI_FAILED,
            message: timedOut
              ? "تولید آماده‌سازی مصاحبه بیش از حد طول کشید. لطفاً دوباره تلاش کنید."
              : "امکان تولید آماده‌سازی مصاحبه وجود ندارد. لطفاً دوباره تلاش کنید.",
          },
        });
      }
      throw error;
    }
  }

  async generateInterviewSummary(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
  ) {
    const organizationId = user.organizationId;
    const application = await this.prisma.application.findFirst({
      where: { organizationId, jobId, candidateId },
      include: {
        candidate: true,
        job: {
          include: {
            skills: { include: { skill: true } },
            organization: { select: { language: true } },
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException({
        success: false,
        error: {
          code: CandidateErrorCode.CANDIDATE_NOT_FOUND,
          message: "Candidate not found.",
        },
      });
    }

    assertDepartmentAccess(user, application.job.departmentId);

    const completedInterviews = await this.prisma.interview.findMany({
      where: {
        applicationId: application.id,
        organizationId,
        status: "COMPLETED",
      },
      orderBy: { scheduledAt: "asc" },
    });

    if (completedInterviews.length === 0) {
      throw new BadRequestException({
        success: false,
        error: {
          code: CandidateErrorCode.NO_COMPLETED_INTERVIEWS,
          message: "No completed interviews are available to summarize.",
        },
      });
    }

    const skills = Array.isArray(application.candidate.skills)
      ? application.candidate.skills.filter(
          (item): item is string => typeof item === "string",
        )
      : [];
    const requiredSkills = application.job.skills.map(
      (row) => row.skill.name,
    );
    const resumeAnalysis = ResumeAnalysisSchema.safeParse(application.aiAnalysis);
    const jobMatch = JobMatchAnalysisSchema.safeParse(
      application.jobMatchAnalysis,
    );

    const completedInterviewPayload = completedInterviews.map((interview) => ({
      name: interview.name,
      type: interview.type,
      result: interview.result,
      status: interview.status,
      internalNotes: interview.internalNotes,
      scheduledAt: interview.scheduledAt.toISOString(),
    }));

    const outputLanguage = resolveInterviewAiLanguage({
      organizationLanguage: application.job.organization.language || "fa",
      sourceTexts: completedInterviewPayload.flatMap((interview) => [
        interview.internalNotes,
        interview.name,
      ]),
    });

    try {
      const result = await this.aiService.generateStructured({
        prompt: buildInterviewSummaryPrompt({
          language: application.job.organization.language || "fa",
          jobTitle: application.job.title,
          jobDescription: application.job.description,
          responsibilities: application.job.responsibilities,
          requirements: application.job.requirements,
          requiredSkills,
          candidateFullName: application.candidate.fullName,
          candidateCurrentPosition: application.candidate.currentPosition,
          candidateSkills: skills,
          candidateExperience: application.candidate.experience,
          candidateEducation: application.candidate.education,
          resumeSummary: jobMatch.success
            ? jobMatch.data.executiveSummary
            : resumeAnalysis.success
              ? resumeAnalysis.data.experience.slice(0, 1000) || null
              : null,
          matchScore: jobMatch.success ? jobMatch.data.matchScore : null,
          completedInterviews: completedInterviewPayload,
        }),
        schema: interviewSummaryZodSchema,
        schemaName: "InterviewSummary",
        schemaHint: interviewSummarySchemaHint,
        normalize: normalizeInterviewSummary,
        system: buildInterviewSummarySystemPrompt(outputLanguage),
        temperature: 0.2,
        maxTokens: 3_000,
      });

      const generatedAt = new Date();
      const process = await this.ensureProcess(application);

      await this.prisma.interviewProcess.update({
        where: { id: process.id },
        data: {
          aiSummary: result.data,
          aiSummaryGeneratedAt: generatedAt,
        },
      });

      const targetUserIds = await this.recipients.resolveRecruiters(
        organizationId,
        {
          departmentId: application.job.departmentId,
          excludeUserId: user.id,
        },
      );
      this.domainEvents.publishNamed(
        NotificationEventName.AI_INTERVIEW_SUMMARY_GENERATED,
        {
          organizationId,
          triggeredBy: user.id,
          resourceType: "application",
          resourceId: application.id,
          targetUserIds,
          applicationId: application.id,
          metadata: {
            candidateName: application.candidate.fullName,
            jobId,
            candidateId,
            jobTitle: application.job.title,
            completedInterviewCount: completedInterviews.length,
          },
        },
      );

      return {
        success: true as const,
        summary: result.data,
        completedInterviewCount: completedInterviews.length,
        aiSummaryGeneratedAt: generatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof AiException) {
        const timedOut = error.code === "AI_TIMEOUT";
        throw new BadRequestException({
          success: false,
          error: {
            code: CandidateErrorCode.INTERVIEW_SUMMARY_FAILED,
            message: timedOut
              ? "تولید خلاصه مصاحبه بیش از حد طول کشید. لطفاً دوباره تلاش کنید."
              : "امکان تولید خلاصه مصاحبه وجود ندارد. لطفاً دوباره تلاش کنید.",
          },
        });
      }
      throw error;
    }
  }

  private async syncProcessAfterStageOutcome(
    tx: Prisma.TransactionClient,
    processId: string,
    applicationId: string,
    candidateId: string,
    organizationId: string,
    userId: string,
    result: InterviewResult,
  ) {
    if (result === "FAILED") {
      await tx.interviewProcess.update({
        where: { id: processId },
        data: { status: "FAILED" },
      });
      await tx.application.update({
        where: { id: applicationId },
        data: { status: "REJECTED" },
      });
      await tx.candidate.update({
        where: { id: candidateId },
        data: { status: "REJECTED" },
      });
      await tx.applicationStatusEvent.create({
        data: { applicationId, status: "REJECTED" },
      });
      await tx.applicationActivityEvent.create({
        data: {
          applicationId,
          organizationId,
          type: "INTERVIEW_PROCESS_UPDATED",
          description: "Interview process marked failed",
          actorUserId: userId,
          metadata: { result },
        },
      });
      return;
    }

    if (result === "PASSED") {
      await tx.interviewProcess.update({
        where: { id: processId },
        data: { status: "INTERVIEWING" },
      });
      // Stay in INTERVIEW_SCHEDULED / INTERVIEW_PASSED only via hiring decision
      // Optional soft signal: mark INTERVIEW_PASSED if recruiter wants mid-process pass
      await tx.application.update({
        where: { id: applicationId },
        data: { status: "INTERVIEW_PASSED" },
      });
      await tx.candidate.update({
        where: { id: candidateId },
        data: { status: "INTERVIEW_PASSED" },
      });
      await tx.applicationStatusEvent.create({
        data: { applicationId, status: "INTERVIEW_PASSED" },
      });
    }
  }

  private async mapProcess(processId: string) {
    const process = await this.prisma.interviewProcess.findUniqueOrThrow({
      where: { id: processId },
      include: {
        stages: {
          orderBy: { scheduledAt: "asc" },
          include: {
            recruiterUser: { select: { id: true, email: true } },
          },
        },
      },
    });

    return {
      id: process.id,
      applicationId: process.applicationId,
      status: process.status,
      stages: process.stages.map(mapInterview),
      aiSummary: mapInterviewSummary(process.aiSummary),
      aiSummaryGeneratedAt: process.aiSummaryGeneratedAt
        ? process.aiSummaryGeneratedAt.toISOString()
        : null,
      createdAt: process.createdAt.toISOString(),
      updatedAt: process.updatedAt.toISOString(),
    };
  }

  private async ensureProcess(application: {
    id: string;
    organizationId: string;
    jobId: string;
    candidateId: string;
  }) {
    const existing = await this.prisma.interviewProcess.findUnique({
      where: { applicationId: application.id },
    });
    if (existing) return existing;

    return this.prisma.interviewProcess.create({
      data: {
        applicationId: application.id,
        organizationId: application.organizationId,
        jobId: application.jobId,
        candidateId: application.candidateId,
        status: "WAITING",
      },
    });
  }

  private async requireApplication(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
  ) {
    const application = await this.prisma.application.findFirst({
      where: {
        organizationId: user.organizationId,
        jobId,
        candidateId,
      },
      include: {
        candidate: { select: { id: true, fullName: true } },
        job: { select: { id: true, title: true, departmentId: true } },
      },
    });

    if (!application) {
      throw new NotFoundException({
        success: false,
        error: {
          code: CandidateErrorCode.CANDIDATE_NOT_FOUND,
          message: "Candidate not found.",
        },
      });
    }

    assertDepartmentAccess(user, application.job.departmentId);
    return application;
  }

  private async requireEditableInterview(
    applicationId: string,
    interviewId: string,
  ) {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, applicationId },
    });

    if (!interview) {
      throw new NotFoundException({
        success: false,
        error: {
          code: CandidateErrorCode.INTERVIEW_NOT_FOUND,
          message: "Interview not found.",
        },
      });
    }

    if (!EDITABLE_STATUSES.includes(interview.status)) {
      throw new BadRequestException({
        success: false,
        error: {
          code: CandidateErrorCode.INTERVIEW_NOT_EDITABLE,
          message: "This interview cannot be edited.",
        },
      });
    }

    return interview;
  }

  private async validateRecruiter(
    organizationId: string,
    recruiterUserId: string | null | undefined,
  ) {
    if (!recruiterUserId) return;
    const user = await this.prisma.user.findFirst({
      where: { id: recruiterUserId, organizationId },
      select: { id: true },
    });
    if (!user) {
      throw new BadRequestException({
        success: false,
        error: {
          code: CandidateErrorCode.VALIDATION_ERROR,
          message: "Recruiter not found in organization.",
        },
      });
    }
  }

  private async hasRecruiterConflict(
    organizationId: string,
    recruiterUserId: string | null,
    scheduledAt: Date,
    excludeId: string | null,
  ) {
    if (!recruiterUserId) return false;
    const windowStart = new Date(scheduledAt.getTime() - DEFAULT_DURATION_MS);
    const windowEnd = new Date(scheduledAt.getTime() + DEFAULT_DURATION_MS);

    const conflict = await this.prisma.interview.findFirst({
      where: {
        organizationId,
        recruiterUserId,
        status: { in: ACTIVE_CONFLICT_STATUSES },
        scheduledAt: { gte: windowStart, lte: windowEnd },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    return Boolean(conflict);
  }
}

export function mapInterview(interview: InterviewWithRecruiter) {
  const preparation = InterviewAiPreparationSchema.safeParse(
    interview.aiPreparation,
  );

  return {
    id: interview.id,
    processId: interview.processId,
    name: interview.name,
    scheduledAt: interview.scheduledAt.toISOString(),
    type: interview.type,
    status: interview.status,
    result: interview.result,
    location: interview.location,
    meetingUrl: interview.meetingUrl,
    internalNotes: interview.internalNotes,
    candidateNotes: interview.candidateNotes,
    candidateResponse: interview.candidateResponse ?? null,
    respondedAt: interview.respondedAt?.toISOString() ?? null,
    responseMessage: interview.responseMessage ?? null,
    proposedScheduledAt: interview.proposedScheduledAt?.toISOString() ?? null,
    recruiterUserId: interview.recruiterUserId,
    recruiterEmail: interview.recruiterUser?.email ?? null,
    createdByUserId: interview.createdByUserId,
    createdAt: interview.createdAt.toISOString(),
    updatedAt: interview.updatedAt.toISOString(),
    aiPreparation: preparation.success ? preparation.data : null,
    aiPrompt: interview.aiPrompt ?? null,
    aiGeneratedAt: interview.aiGeneratedAt
      ? interview.aiGeneratedAt.toISOString()
      : null,
  };
}

export function mapPublicInterview(interview: {
  id: string;
  name: string;
  type: Interview["type"];
  status: InterviewStatus;
  scheduledAt: Date;
  location: string | null;
  meetingUrl: string | null;
  candidateNotes: string | null;
  candidateResponse: InterviewCandidateResponse | null;
  respondedAt: Date | null;
  responseMessage: string | null;
  proposedScheduledAt: Date | null;
}) {
  return {
    id: interview.id,
    name: interview.name,
    type: interview.type,
    status: interview.status,
    scheduledAt: interview.scheduledAt.toISOString(),
    location: interview.location,
    meetingUrl: interview.meetingUrl,
    candidateNotes: interview.candidateNotes,
    candidateResponse: interview.candidateResponse,
    respondedAt: interview.respondedAt?.toISOString() ?? null,
    responseMessage: interview.responseMessage,
    proposedScheduledAt: interview.proposedScheduledAt?.toISOString() ?? null,
    canRespond: canCandidateRespond(interview),
  };
}

export function canCandidateRespond(interview: {
  status: InterviewStatus;
  scheduledAt: Date;
}) {
  return (
    RESPONDABLE_STATUSES.includes(interview.status) &&
    interview.scheduledAt.getTime() > Date.now()
  );
}

function mapInterviewSummary(value: unknown) {
  const parsed = InterviewSummarySchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function parseFutureDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException({
      success: false,
      error: {
        code: CandidateErrorCode.VALIDATION_ERROR,
        message: "Interview date is invalid.",
      },
    });
  }

  if (date.getTime() < Date.now() - 60_000) {
    throw new BadRequestException({
      success: false,
      error: {
        code: CandidateErrorCode.VALIDATION_ERROR,
        message: "Interview date cannot be in the past.",
      },
    });
  }

  return date;
}

function activityForStatus(status: InterviewStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return {
        type: "INTERVIEW_STARTED" as const,
        description: (name: string) => `Interview started: ${name}`,
      };
    case "COMPLETED":
      return {
        type: "INTERVIEW_COMPLETED" as const,
        description: (name: string) => `Interview completed: ${name}`,
      };
    case "CANCELLED":
      return {
        type: "INTERVIEW_CANCELLED" as const,
        description: (name: string) => `Interview cancelled: ${name}`,
      };
    case "NO_SHOW":
      return {
        type: "INTERVIEW_NO_SHOW" as const,
        description: (name: string) => `Interview no-show: ${name}`,
      };
    default:
      return {
        type: "INTERVIEW_UPDATED" as const,
        description: (name: string) => `Interview status updated: ${name}`,
      };
  }
}

function detectConflicts(
  rows: Array<{
    id: string;
    recruiterUserId: string | null;
    scheduledAt: Date;
    status: InterviewStatus;
  }>,
) {
  const ids = new Set<string>();
  const active = rows.filter(
    (row) =>
      row.recruiterUserId && ACTIVE_CONFLICT_STATUSES.includes(row.status),
  );

  for (let i = 0; i < active.length; i += 1) {
    for (let j = i + 1; j < active.length; j += 1) {
      const a = active[i]!;
      const b = active[j]!;
      if (a.recruiterUserId !== b.recruiterUserId) continue;
      if (
        Math.abs(a.scheduledAt.getTime() - b.scheduledAt.getTime()) <
        DEFAULT_DURATION_MS
      ) {
        ids.add(a.id);
        ids.add(b.id);
      }
    }
  }

  return ids;
}

async function recordInterviewStatusEvent(
  tx: Prisma.TransactionClient,
  input: {
    interviewId: string;
    fromStatus: InterviewStatus | null;
    toStatus: InterviewStatus;
    actorType: InterviewStatusActor;
    actorUserId?: string | null;
    message?: string | null;
    metadata?: Prisma.InputJsonValue;
  },
) {
  await tx.interviewStatusEvent.create({
    data: {
      interviewId: input.interviewId,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      actorType: input.actorType,
      actorUserId: input.actorUserId ?? null,
      message: input.message ?? null,
      metadata: input.metadata,
    },
  });
}

function hashTrackingToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
