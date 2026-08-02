import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CandidateErrorCode,
  JobMatchAnalysisSchema,
  ResumeAnalysisSchema,
  type CompleteInterviewInput,
  type CreateCandidateNoteInput,
  type CreateInterviewInput,
  type ListCandidatesQuery,
  type ListOrgCandidatesQuery,
  type UpdateCandidateNoteInput,
  type UpdateCandidateStatusInput,
  type UpdateInterviewInput,
} from "@poyino/contracts";
import type { CandidateStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { StorageService } from "../../storage";

@Injectable()
export class CandidatesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StorageService) private readonly storageService: StorageService,
  ) {}

  async listForJob(
    organizationId: string,
    jobId: string,
    query: ListCandidatesQuery,
  ) {
    const job = await this.requireJob(organizationId, jobId);
    const where = this.buildJobCandidatesWhere(organizationId, jobId, query);

    const [totalItems, applications, statusGroups] = await Promise.all([
      this.prisma.application.count({ where }),
      this.prisma.application.findMany({
        where,
        include: {
          candidate: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              currentPosition: true,
              skills: true,
              aiScore: true,
            },
          },
        },
        orderBy: this.buildOrderBy(query.sortBy, query.sortOrder),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.application.groupBy({
        by: ["status"],
        where: { organizationId, jobId },
        _count: { _all: true },
      }),
    ]);

    const statusCounts = Object.fromEntries(
      statusGroups.map((group) => [group.status, group._count._all]),
    ) as Partial<Record<CandidateStatus, number>>;

    const totalForJob = Object.values(statusCounts).reduce(
      (sum, count) => sum + (count ?? 0),
      0,
    );

    return {
      success: true as const,
      job: {
        id: job.id,
        title: job.title,
        updatedAt: job.updatedAt.toISOString(),
      },
      items: applications.map((application) =>
        mapListItem(application, application.candidate),
      ),
      stats: {
        total: totalForJob,
        reviewing: statusCounts.REVIEWING ?? 0,
        interviewScheduled: statusCounts.INTERVIEW_SCHEDULED ?? 0,
        hired: statusCounts.HIRED ?? 0,
        rejected: statusCounts.REJECTED ?? 0,
      },
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / query.pageSize) || 0,
      },
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
  }

  async listOrg(organizationId: string, query: ListOrgCandidatesQuery) {
    const where: Prisma.ApplicationWhereInput = {
      organizationId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            candidate: {
              OR: [
                { fullName: { contains: query.search, mode: "insensitive" } },
                { email: { contains: query.search, mode: "insensitive" } },
                { phone: { contains: query.search, mode: "insensitive" } },
              ],
            },
          }
        : {}),
    };

    const [totalItems, applications] = await Promise.all([
      this.prisma.application.count({ where }),
      this.prisma.application.findMany({
        where,
        include: {
          candidate: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              currentPosition: true,
              skills: true,
              aiScore: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: this.buildOrderBy(query.sortBy, query.sortOrder),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
    ]);

    return {
      success: true as const,
      items: applications.map((application) => ({
        ...mapListItem(application, application.candidate),
        jobId: application.job.id,
        jobTitle: application.job.title,
      })),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / query.pageSize) || 0,
      },
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
  }

  async getProfile(
    organizationId: string,
    jobId: string,
    candidateId: string,
  ) {
    await this.requireJob(organizationId, jobId);
    const application = await this.requireApplication(
      organizationId,
      jobId,
      candidateId,
    );

    const [notes, timeline, interviews, resumeMeta] = await Promise.all([
      this.prisma.candidateNote.findMany({
        where: { applicationId: application.id },
        orderBy: { createdAt: "desc" },
        include: {
          authorUser: { select: { id: true, email: true } },
        },
      }),
      this.prisma.applicationActivityEvent.findMany({
        where: { applicationId: application.id },
        orderBy: { createdAt: "desc" },
        include: {
          actorUser: { select: { id: true, email: true } },
        },
      }),
      this.prisma.interview.findMany({
        where: { applicationId: application.id },
        orderBy: { scheduledAt: "desc" },
      }),
      application.resumeFileId
        ? this.storageService.getOwnedMetadata(
            organizationId,
            application.resumeFileId,
          )
        : Promise.resolve(null),
    ]);

    let downloadUrl: string | null = null;
    if (application.resumeFileId) {
      try {
        downloadUrl = await this.storageService.generateSignedUrl(
          application.resumeFileId,
          60 * 30,
        );
      } catch {
        downloadUrl = null;
      }
    }

    const skills = parseSkills(application.candidate.skills);
    const resumeAnalysis = parseResumeAnalysis(application.aiAnalysis);
    const jobMatchAnalysis = parseJobMatchAnalysis(
      application.jobMatchAnalysis,
    );

    return {
      success: true as const,
      job: {
        id: application.job.id,
        title: application.job.title,
      },
      candidate: {
        id: application.candidate.id,
        applicationId: application.id,
        fullName: application.candidate.fullName,
        email: application.candidate.email,
        phone: application.candidate.phone,
        currentPosition: application.candidate.currentPosition,
        skills,
        experience: application.candidate.experience,
        education: application.candidate.education,
        linkedin: application.candidate.linkedin,
        portfolio: application.candidate.portfolio,
        website: application.candidate.website,
        status: application.status,
        aiScore:
          jobMatchAnalysis?.matchScore ?? application.candidate.aiScore ?? null,
        yearsExperience: application.yearsExperience,
        appliedAt: application.appliedAt.toISOString(),
        resume:
          resumeMeta && downloadUrl
            ? {
                fileId: resumeMeta.id,
                fileName: resumeMeta.originalName,
                mimeType: resumeMeta.mimeType,
                downloadUrl,
              }
            : resumeMeta
              ? {
                  fileId: resumeMeta.id,
                  fileName: resumeMeta.originalName,
                  mimeType: resumeMeta.mimeType,
                  downloadUrl: `/api/jobs/${jobId}/candidates/${candidateId}/resume`,
                }
              : null,
        resumeAnalysis,
        jobMatchAnalysis,
        notes: notes.map((note) => ({
          id: note.id,
          body: note.body,
          authorUserId: note.authorUser.id,
          authorEmail: note.authorUser.email,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
        })),
        timeline: timeline.map((event) => ({
          id: event.id,
          type: event.type,
          description: event.description,
          actorUserId: event.actorUser?.id ?? null,
          actorEmail: event.actorUser?.email ?? null,
          createdAt: event.createdAt.toISOString(),
        })),
        interviews: interviews.map(mapInterview),
      },
    };
  }

  async updateStatus(
    organizationId: string,
    userId: string,
    jobId: string,
    candidateId: string,
    input: UpdateCandidateStatusInput,
  ) {
    const application = await this.requireApplication(
      organizationId,
      jobId,
      candidateId,
    );

    if (application.status === input.status) {
      return { success: true as const, status: application.status };
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.application.update({
        where: { id: application.id },
        data: { status: input.status },
      });
      await tx.candidate.update({
        where: { id: candidateId },
        data: { status: input.status },
      });
      await tx.applicationStatusEvent.create({
        data: {
          applicationId: application.id,
          status: input.status,
        },
      });
      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "STATUS_CHANGED",
          description: `Status changed to ${input.status}`,
          actorUserId: userId,
          metadata: { status: input.status },
        },
      });
    });

    return { success: true as const, status: input.status };
  }

  async createNote(
    organizationId: string,
    userId: string,
    jobId: string,
    candidateId: string,
    input: CreateCandidateNoteInput,
  ) {
    const application = await this.requireApplication(
      organizationId,
      jobId,
      candidateId,
    );

    const note = await this.prisma.$transaction(async (tx) => {
      const created = await tx.candidateNote.create({
        data: {
          applicationId: application.id,
          organizationId,
          authorUserId: userId,
          body: input.body,
        },
        include: {
          authorUser: { select: { id: true, email: true } },
        },
      });

      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "NOTE_ADDED",
          description: "Recruiter note added",
          actorUserId: userId,
        },
      });

      return created;
    });

    return {
      success: true as const,
      note: {
        id: note.id,
        body: note.body,
        authorUserId: note.authorUser.id,
        authorEmail: note.authorUser.email,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      },
    };
  }

  async updateNote(
    organizationId: string,
    userId: string,
    jobId: string,
    candidateId: string,
    noteId: string,
    input: UpdateCandidateNoteInput,
  ) {
    const application = await this.requireApplication(
      organizationId,
      jobId,
      candidateId,
    );

    const existing = await this.prisma.candidateNote.findFirst({
      where: {
        id: noteId,
        applicationId: application.id,
        organizationId,
      },
    });

    if (!existing) {
      throw noteNotFound();
    }

    const note = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.candidateNote.update({
        where: { id: noteId },
        data: { body: input.body },
        include: {
          authorUser: { select: { id: true, email: true } },
        },
      });

      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "NOTE_UPDATED",
          description: "Recruiter note updated",
          actorUserId: userId,
        },
      });

      return updated;
    });

    return {
      success: true as const,
      note: {
        id: note.id,
        body: note.body,
        authorUserId: note.authorUser.id,
        authorEmail: note.authorUser.email,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      },
    };
  }

  async deleteNote(
    organizationId: string,
    userId: string,
    jobId: string,
    candidateId: string,
    noteId: string,
  ) {
    const application = await this.requireApplication(
      organizationId,
      jobId,
      candidateId,
    );

    const existing = await this.prisma.candidateNote.findFirst({
      where: {
        id: noteId,
        applicationId: application.id,
        organizationId,
      },
    });

    if (!existing) {
      throw noteNotFound();
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.candidateNote.delete({ where: { id: noteId } });
      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "NOTE_DELETED",
          description: "Recruiter note deleted",
          actorUserId: userId,
        },
      });
    });

    return { success: true as const };
  }

  async listInterviews(
    organizationId: string,
    jobId: string,
    candidateId: string,
  ) {
    const application = await this.requireApplication(
      organizationId,
      jobId,
      candidateId,
    );

    const interviews = await this.prisma.interview.findMany({
      where: { applicationId: application.id },
      orderBy: { scheduledAt: "desc" },
    });

    return {
      success: true as const,
      interviews: interviews.map(mapInterview),
    };
  }

  async createInterview(
    organizationId: string,
    userId: string,
    jobId: string,
    candidateId: string,
    input: CreateInterviewInput,
  ) {
    const application = await this.requireApplication(
      organizationId,
      jobId,
      candidateId,
    );
    const scheduledAt = parseFutureDate(input.scheduledAt);

    const interview = await this.prisma.$transaction(async (tx) => {
      const created = await tx.interview.create({
        data: {
          applicationId: application.id,
          organizationId,
          jobId,
          candidateId,
          scheduledAt,
          type: input.type,
          status: "SCHEDULED",
          location: input.location,
          meetingUrl: input.meetingUrl,
          notes: input.notes,
          createdByUserId: userId,
        },
      });

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
      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "INTERVIEW_SCHEDULED",
          description: `Interview scheduled (${input.type})`,
          actorUserId: userId,
          metadata: { interviewId: created.id },
        },
      });

      return created;
    });

    return { success: true as const, interview: mapInterview(interview) };
  }

  async updateInterview(
    organizationId: string,
    userId: string,
    jobId: string,
    candidateId: string,
    interviewId: string,
    input: UpdateInterviewInput,
  ) {
    const application = await this.requireApplication(
      organizationId,
      jobId,
      candidateId,
    );
    const interview = await this.requireEditableInterview(
      application.id,
      interviewId,
    );
    const scheduledAt = parseFutureDate(input.scheduledAt);

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.interview.update({
        where: { id: interview.id },
        data: {
          scheduledAt,
          type: input.type,
          location: input.location,
          meetingUrl: input.meetingUrl,
          notes: input.notes,
        },
      });

      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "INTERVIEW_UPDATED",
          description: "Interview updated",
          actorUserId: userId,
          metadata: { interviewId: interview.id },
        },
      });

      return result;
    });

    return { success: true as const, interview: mapInterview(updated) };
  }

  async cancelInterview(
    organizationId: string,
    userId: string,
    jobId: string,
    candidateId: string,
    interviewId: string,
  ) {
    const application = await this.requireApplication(
      organizationId,
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
      });

      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "INTERVIEW_CANCELLED",
          description: "Interview cancelled",
          actorUserId: userId,
          metadata: { interviewId: interview.id },
        },
      });

      return result;
    });

    return { success: true as const, interview: mapInterview(updated) };
  }

  async completeInterview(
    organizationId: string,
    userId: string,
    jobId: string,
    candidateId: string,
    interviewId: string,
    input: CompleteInterviewInput,
  ) {
    const application = await this.requireApplication(
      organizationId,
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
        data: {
          status: "COMPLETED",
          notes: input.notes ?? interview.notes,
        },
      });

      await tx.application.update({
        where: { id: application.id },
        data: { status: "INTERVIEW_PASSED" },
      });
      await tx.candidate.update({
        where: { id: candidateId },
        data: { status: "INTERVIEW_PASSED" },
      });
      await tx.applicationStatusEvent.create({
        data: {
          applicationId: application.id,
          status: "INTERVIEW_PASSED",
        },
      });
      await tx.applicationActivityEvent.create({
        data: {
          applicationId: application.id,
          organizationId,
          type: "INTERVIEW_COMPLETED",
          description: "Interview completed",
          actorUserId: userId,
          metadata: { interviewId: interview.id },
        },
      });

      return result;
    });

    return { success: true as const, interview: mapInterview(updated) };
  }

  async downloadResume(
    organizationId: string,
    jobId: string,
    candidateId: string,
  ) {
    const application = await this.requireApplication(
      organizationId,
      jobId,
      candidateId,
    );

    if (!application.resumeFileId) {
      throw new NotFoundException({
        success: false,
        error: {
          code: CandidateErrorCode.RESUME_NOT_FOUND,
          message: "Resume not found.",
        },
      });
    }

    return this.storageService.downloadByOrganization(
      organizationId,
      application.resumeFileId,
    );
  }

  private buildJobCandidatesWhere(
    organizationId: string,
    jobId: string,
    query: ListCandidatesQuery,
  ): Prisma.ApplicationWhereInput {
    const candidateWhere: Prisma.CandidateWhereInput = {};

    if (query.education) {
      candidateWhere.education = {
        contains: query.education,
        mode: "insensitive",
      };
    }

    if (query.search) {
      candidateWhere.OR = [
        { fullName: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { phone: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const where: Prisma.ApplicationWhereInput = {
      organizationId,
      jobId,
      ...(query.status ? { status: query.status } : {}),
      ...(Object.keys(candidateWhere).length > 0
        ? { candidate: candidateWhere }
        : {}),
    };

    if (query.experienceLevel === "JUNIOR") {
      where.yearsExperience = { lt: 3 };
    } else if (query.experienceLevel === "MID") {
      where.yearsExperience = { gte: 3, lt: 7 };
    } else if (query.experienceLevel === "SENIOR") {
      where.yearsExperience = { gte: 7 };
    }

    const dateFilter = resolveDateFilter(query);
    if (dateFilter) {
      where.appliedAt = dateFilter;
    }

    return where;
  }

  private buildOrderBy(
    sortBy: ListCandidatesQuery["sortBy"],
    sortOrder: ListCandidatesQuery["sortOrder"],
  ): Prisma.ApplicationOrderByWithRelationInput[] {
    if (sortBy === "fullName") {
      return [{ candidate: { fullName: sortOrder } }];
    }
    if (sortBy === "appliedAt") {
      return [{ appliedAt: sortOrder }];
    }
    return [
      { candidate: { aiScore: { sort: sortOrder, nulls: "last" } } },
      { appliedAt: "desc" },
    ];
  }

  private async requireJob(organizationId: string, jobId: string) {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId },
      select: { id: true, title: true, updatedAt: true },
    });

    if (!job) {
      throw new NotFoundException({
        success: false,
        error: {
          code: CandidateErrorCode.JOB_NOT_FOUND,
          message: "Job not found.",
        },
      });
    }

    return job;
  }

  private async requireApplication(
    organizationId: string,
    jobId: string,
    candidateId: string,
  ) {
    const application = await this.prisma.application.findFirst({
      where: { organizationId, jobId, candidateId },
      include: {
        candidate: true,
        job: { select: { id: true, title: true } },
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

    if (interview.status !== "SCHEDULED") {
      throw new BadRequestException({
        success: false,
        error: {
          code: CandidateErrorCode.INTERVIEW_NOT_EDITABLE,
          message: "Completed or cancelled interviews cannot be edited.",
        },
      });
    }

    return interview;
  }
}

function mapListItem(
  application: {
    id: string;
    status: CandidateStatus;
    yearsExperience: number | null;
    appliedAt: Date;
  },
  candidate: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    currentPosition: string | null;
    skills: unknown;
    aiScore: number | null;
  },
) {
  return {
    id: candidate.id,
    applicationId: application.id,
    fullName: candidate.fullName,
    email: candidate.email,
    phone: candidate.phone,
    currentPosition: candidate.currentPosition,
    aiScore: candidate.aiScore,
    yearsExperience: application.yearsExperience,
    skills: parseSkills(candidate.skills),
    status: application.status,
    appliedAt: application.appliedAt.toISOString(),
  };
}

function mapInterview(interview: {
  id: string;
  scheduledAt: Date;
  type: "HR" | "TECHNICAL" | "MANAGER" | "FINAL";
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED";
  location: string | null;
  meetingUrl: string | null;
  notes: string | null;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: interview.id,
    scheduledAt: interview.scheduledAt.toISOString(),
    type: interview.type,
    status: interview.status,
    location: interview.location,
    meetingUrl: interview.meetingUrl,
    notes: interview.notes,
    createdByUserId: interview.createdByUserId,
    createdAt: interview.createdAt.toISOString(),
    updatedAt: interview.updatedAt.toISOString(),
  };
}

function parseSkills(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function parseResumeAnalysis(value: unknown) {
  const parsed = ResumeAnalysisSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function parseJobMatchAnalysis(value: unknown) {
  const parsed = JobMatchAnalysisSchema.safeParse(value);
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

function resolveDateFilter(query: ListCandidatesQuery) {
  if (!query.dateRange) {
    return undefined;
  }

  const now = new Date();
  if (query.dateRange === "TODAY") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { gte: start };
  }
  if (query.dateRange === "LAST_7_DAYS") {
    return { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
  }
  if (query.dateRange === "LAST_30_DAYS") {
    return { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
  }
  if (query.dateRange === "CUSTOM") {
    const filter: Prisma.DateTimeFilter = {};
    if (query.dateFrom) {
      filter.gte = new Date(`${query.dateFrom}T00:00:00.000Z`);
    }
    if (query.dateTo) {
      filter.lte = new Date(`${query.dateTo}T23:59:59.999Z`);
    }
    return Object.keys(filter).length > 0 ? filter : undefined;
  }
  return undefined;
}

function noteNotFound() {
  return new NotFoundException({
    success: false,
    error: {
      code: CandidateErrorCode.NOTE_NOT_FOUND,
      message: "Note not found.",
    },
  });
}
