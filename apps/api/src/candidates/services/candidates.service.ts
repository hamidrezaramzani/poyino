import {
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CandidateErrorCode,
  JobMatchAnalysisSchema,
  NotificationEventName,
  ResumeAnalysisSchema,
  type CreateCandidateNoteInput,
  type ListCandidatesQuery,
  type ListOrgCandidatesQuery,
  type UpdateCandidateNoteInput,
  type UpdateCandidateStatusInput,
} from "@poyino/contracts";
import type { CandidateStatus, Prisma } from "@prisma/client";
import {
  assertDepartmentAccess,
  departmentScopeFilter,
} from "../../authentication/lib/department-scope";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { mapInterview } from "../../interviews/services/interviews.service";
import { DomainEventPublisher } from "../../notifications/services/domain-event.publisher";
import { RecipientResolverService } from "../../notifications/services/recipient-resolver.service";
import { PrismaService } from "../../prisma/prisma.service";
import { StorageService } from "../../storage";

@Injectable()
export class CandidatesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StorageService) private readonly storageService: StorageService,
    @Inject(DomainEventPublisher)
    private readonly domainEvents: DomainEventPublisher,
    @Inject(RecipientResolverService)
    private readonly recipients: RecipientResolverService,
  ) {}

  async listForJob(
    user: AuthenticatedUser,
    jobId: string,
    query: ListCandidatesQuery,
  ) {
    const organizationId = user.organizationId;
    const job = await this.requireJob(user, jobId);
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

  async listOrg(user: AuthenticatedUser, query: ListOrgCandidatesQuery) {
    const scope = departmentScopeFilter(user);
    const where: Prisma.ApplicationWhereInput = {
      organizationId: user.organizationId,
      ...(scope.departmentId
        ? { job: { departmentId: scope.departmentId } }
        : {}),
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
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
  ) {
    const organizationId = user.organizationId;
    await this.requireJob(user, jobId);
    const application = await this.requireApplication(
      user,
      jobId,
      candidateId,
    );

    const [notes, timeline, interviews, process, resumeMeta] = await Promise.all([
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
        include: {
          recruiterUser: { select: { id: true, email: true } },
        },
      }),
      this.prisma.interviewProcess.findUnique({
        where: { applicationId: application.id },
        select: { status: true },
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
        interviewProcessStatus: process?.status ?? null,
      },
    };
  }

  async updateStatus(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
    input: UpdateCandidateStatusInput,
  ) {
    const organizationId = user.organizationId;
    const application = await this.requireApplication(
      user,
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
          actorUserId: user.id,
          metadata: { status: input.status },
        },
      });
    });

    const metadata = {
      candidateName: application.candidate.fullName,
      jobTitle: application.job.title,
      jobId: application.job.id,
      candidateId,
      status: input.status,
    };

    this.domainEvents.publishNamed(
      NotificationEventName.CANDIDATE_STATUS_CHANGED,
      {
        organizationId,
        triggeredBy: user.id,
        resourceType: "application",
        resourceId: application.id,
        targetUserIds: [],
        applicationId: application.id,
        includeCandidate: true,
        metadata,
      },
    );

    if (input.status === "HIRED" || input.status === "REJECTED") {
      const targetUserIds =
        await this.recipients.resolveRecruitersAndHiringManagers(
          organizationId,
          {
            departmentId: application.job.departmentId,
            excludeUserId: user.id,
          },
        );
      this.domainEvents.publishNamed(
        input.status === "HIRED"
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
          metadata,
        },
      );
    }

    return { success: true as const, status: input.status };
  }

  async createNote(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
    input: CreateCandidateNoteInput,
  ) {
    const organizationId = user.organizationId;
    const application = await this.requireApplication(
      user,
      jobId,
      candidateId,
    );

    const note = await this.prisma.$transaction(async (tx) => {
      const created = await tx.candidateNote.create({
        data: {
          applicationId: application.id,
          organizationId,
          authorUserId: user.id,
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
          actorUserId: user.id,
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
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
    noteId: string,
    input: UpdateCandidateNoteInput,
  ) {
    const organizationId = user.organizationId;
    const application = await this.requireApplication(
      user,
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
          actorUserId: user.id,
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
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
    noteId: string,
  ) {
    const organizationId = user.organizationId;
    const application = await this.requireApplication(
      user,
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
          actorUserId: user.id,
        },
      });
    });

    return { success: true as const };
  }

  async downloadResume(
    user: AuthenticatedUser,
    jobId: string,
    candidateId: string,
  ) {
    const application = await this.requireApplication(
      user,
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
      user.organizationId,
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

  private async requireJob(user: AuthenticatedUser, jobId: string) {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId: user.organizationId },
      select: { id: true, title: true, updatedAt: true, departmentId: true },
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

    assertDepartmentAccess(user, job.departmentId);
    return job;
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
        candidate: true,
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
