import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import type {
  CreateJobInput,
  GenerateJobContentInput,
  ListJobsQuery,
  UpdateJobExpirationInput,
  UpdateJobInput,
} from "@poyino/contracts";
import { CreateJobSchema, JobErrorCode } from "@poyino/contracts";
import type { Prisma } from "@prisma/client";
import {
  AiException,
  AiInvalidResponseException,
  AiService,
} from "../../ai";
import { PrismaService } from "../../prisma/prisma.service";
import {
  buildJobContentUserPrompt,
  GeneratedJobContentSchema,
  JOB_CONTENT_SCHEMA_HINT,
  JOB_CONTENT_SYSTEM_PROMPT,
  normalizeGeneratedJobContent,
} from "../ai/generate-job-content";
import {
  buildPublicJobUrl,
  formatDateOnly,
  isJobExpired,
} from "../utils/job-expiration";

@Injectable()
export class JobsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AiService) private readonly aiService: AiService,
  ) {}

  async create(organizationId: string, input: CreateJobInput) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { defaultCurrency: true },
    });

    const currency = input.currency ?? organization?.defaultCurrency ?? "IRR";
    const skillNames = normalizeSkillNames(input.skills ?? []);

    const job = await this.prisma.$transaction(async (tx) => {
      const skillRecords = await Promise.all(
        skillNames.map((name) =>
          tx.skill.upsert({
            where: {
              organizationId_name: {
                organizationId,
                name,
              },
            },
            create: {
              organizationId,
              name,
            },
            update: {},
            select: { id: true },
          }),
        ),
      );

      return tx.job.create({
        data: {
          organizationId,
          title: input.title,
          department: input.department,
          employmentType: input.employmentType,
          workplaceType: input.workplaceType,
          location: input.location,
          salaryMin: input.salaryMin,
          salaryMax: input.salaryMax,
          currency,
          salaryVisible: input.salaryVisible,
          description: input.description,
          responsibilities: input.responsibilities,
          requirements: input.requirements,
          benefits: input.benefits,
          positions: input.positions,
          expirationDate: input.expirationDate
            ? new Date(`${input.expirationDate}T00:00:00.000Z`)
            : null,
          status: "DRAFT",
          skills: {
            create: skillRecords.map((skill) => ({
              skillId: skill.id,
            })),
          },
        },
        select: {
          id: true,
          status: true,
        },
      });
    });

    return {
      success: true as const,
      id: job.id,
      status: "DRAFT" as const,
    };
  }

  async list(organizationId: string, query: ListJobsQuery) {
    const where: Prisma.JobWhereInput = { organizationId };
    const orderBy = buildJobListOrderBy(query.sortBy, query.sortOrder);
    const skip = (query.page - 1) * query.pageSize;

    const [organization, totalItems, jobs] = await Promise.all([
      this.prisma.organization.findUnique({
        where: { id: organizationId },
        select: { timezone: true },
      }),
      this.prisma.job.count({ where }),
      this.prisma.job.findMany({
        where,
        orderBy,
        skip,
        take: query.pageSize,
        select: {
          id: true,
          title: true,
          status: true,
          department: true,
          createdAt: true,
          publishedAt: true,
          expirationDate: true,
          _count: {
            select: { candidates: true },
          },
        },
      }),
    ]);

    const timezone = organization?.timezone ?? "Asia/Tehran";
    const totalPages =
      totalItems === 0 ? 0 : Math.ceil(totalItems / query.pageSize);

    return {
      success: true as const,
      jobs: jobs.map((job) => ({
        id: job.id,
        title: job.title,
        status: job.status,
        isExpired:
          job.status === "PUBLISHED" &&
          isJobExpired(job.expirationDate, timezone),
        department: job.department,
        candidateCount: job._count.candidates,
        createdAt: job.createdAt.toISOString(),
        publishedAt: job.publishedAt?.toISOString() ?? null,
      })),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        totalItems,
        totalPages,
      },
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
  }

  async getById(organizationId: string, jobId: string) {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId },
      include: {
        organization: {
          select: { slug: true, timezone: true },
        },
        skills: {
          include: {
            skill: {
              select: { name: true },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        candidates: {
          orderBy: { appliedAt: "desc" },
          take: 1,
          select: {
            id: true,
            fullName: true,
            appliedAt: true,
          },
        },
      },
    });

    if (!job) {
      throw jobNotFound();
    }

    const [applications, newApplications, interviews, hired] =
      await Promise.all([
        this.prisma.candidate.count({
          where: { jobId, organizationId },
        }),
        this.prisma.candidate.count({
          where: { jobId, organizationId, status: "APPLIED" },
        }),
        this.prisma.candidate.count({
          where: {
            jobId,
            organizationId,
            status: { in: ["INTERVIEW_SCHEDULED", "INTERVIEW_PASSED"] },
          },
        }),
        this.prisma.candidate.count({
          where: { jobId, organizationId, status: "HIRED" },
        }),
      ]);

    const latestCandidate = job.candidates[0] ?? null;
    const isExpired =
      job.status === "PUBLISHED" &&
      isJobExpired(job.expirationDate, job.organization.timezone);

    return {
      success: true as const,
      job: {
        id: job.id,
        title: job.title,
        status: job.status,
        isExpired,
        department: job.department,
        employmentType: job.employmentType,
        workplaceType: job.workplaceType,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        currency: job.currency,
        salaryVisible: job.salaryVisible,
        description: job.description,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        benefits: job.benefits,
        skills: job.skills.map((item) => item.skill.name),
        positions: job.positions,
        expirationDate: formatDateOnly(job.expirationDate),
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
        publishedAt: job.publishedAt?.toISOString() ?? null,
        publicUrl:
          job.status === "PUBLISHED"
            ? buildPublicJobUrl(job.organization.slug, job.id)
            : null,
        statistics: {
          applications,
          newApplications,
          interviews,
          hired,
        },
        latestCandidate: latestCandidate
          ? {
              id: latestCandidate.id,
              fullName: latestCandidate.fullName,
              appliedAt: latestCandidate.appliedAt.toISOString(),
            }
          : null,
      },
    };
  }

  async update(organizationId: string, jobId: string, input: UpdateJobInput) {
    const existing = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId },
      select: { id: true, expirationDate: true },
    });

    if (!existing) {
      throw jobNotFound();
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { defaultCurrency: true },
    });
    const currency = input.currency ?? organization?.defaultCurrency ?? "IRR";
    const skillNames = normalizeSkillNames(input.skills ?? []);
    const nextExpirationDate = input.expirationDate
      ? new Date(`${input.expirationDate}T00:00:00.000Z`)
      : null;
    const expirationChanged =
      formatDateOnly(existing.expirationDate) !==
      formatDateOnly(nextExpirationDate);

    await this.prisma.$transaction(async (tx) => {
      const skillRecords = await Promise.all(
        skillNames.map((name) =>
          tx.skill.upsert({
            where: {
              organizationId_name: {
                organizationId,
                name,
              },
            },
            create: {
              organizationId,
              name,
            },
            update: {},
            select: { id: true },
          }),
        ),
      );

      await tx.jobSkill.deleteMany({
        where: { jobId },
      });

      await tx.job.update({
        where: { id: jobId },
        data: {
          title: input.title,
          department: input.department,
          employmentType: input.employmentType,
          workplaceType: input.workplaceType,
          location: input.location,
          salaryMin: input.salaryMin,
          salaryMax: input.salaryMax,
          currency,
          salaryVisible: input.salaryVisible,
          description: input.description,
          responsibilities: input.responsibilities,
          requirements: input.requirements,
          benefits: input.benefits,
          positions: input.positions,
          expirationDate: nextExpirationDate,
          ...(expirationChanged
            ? { expirationReminderSentAt: null }
            : {}),
          skills: {
            create: skillRecords.map((skill) => ({
              skillId: skill.id,
            })),
          },
        },
      });
    });

    return {
      success: true as const,
    };
  }

  async publish(organizationId: string, jobId: string) {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId },
      include: {
        organization: {
          select: { slug: true },
        },
        skills: {
          include: {
            skill: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!job) {
      throw jobNotFound();
    }

    if (job.status !== "DRAFT") {
      throw new BadRequestException({
        success: false,
        error: {
          code: JobErrorCode.INVALID_JOB_STATUS,
          message: "Only draft jobs can be published.",
        },
      });
    }

    const publishInput = {
      title: job.title,
      department: job.department ?? undefined,
      employmentType: job.employmentType,
      workplaceType: job.workplaceType,
      location: job.location ?? undefined,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.currency,
      salaryVisible: job.salaryVisible,
      description: job.description,
      responsibilities: job.responsibilities ?? undefined,
      requirements: job.requirements ?? undefined,
      benefits: job.benefits ?? undefined,
      skills: job.skills.map((item) => item.skill.name),
      positions: job.positions,
      expirationDate: formatDateOnly(job.expirationDate) ?? undefined,
    };

    const validation = CreateJobSchema.safeParse(publishInput);
    if (!validation.success) {
      throw new BadRequestException({
        success: false,
        error: {
          code: JobErrorCode.JOB_NOT_PUBLISHABLE,
          message: "Job is missing required fields for publishing.",
          details: validation.error.flatten().fieldErrors,
        },
      });
    }

    await this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: "PUBLISHED",
        publishedAt: job.publishedAt ?? new Date(),
      },
    });

    return {
      success: true as const,
      status: "PUBLISHED" as const,
      publicUrl: buildPublicJobUrl(job.organization.slug, job.id),
    };
  }

  async unpublish(organizationId: string, jobId: string) {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId },
      select: { id: true, status: true },
    });

    if (!job) {
      throw jobNotFound();
    }

    if (job.status !== "PUBLISHED") {
      throw new BadRequestException({
        success: false,
        error: {
          code: JobErrorCode.INVALID_JOB_STATUS,
          message: "Only published jobs can be unpublished.",
        },
      });
    }

    await this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: "DRAFT",
      },
    });

    return {
      success: true as const,
      status: "DRAFT" as const,
    };
  }

  async remove(organizationId: string, jobId: string) {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId },
      select: {
        id: true,
        status: true,
        _count: {
          select: { candidates: true },
        },
      },
    });

    if (!job) {
      throw jobNotFound();
    }

    if (job._count.candidates > 0) {
      throw new ConflictException({
        success: false,
        error: {
          code: JobErrorCode.JOB_HAS_CANDIDATES,
          message: "Job has candidates.",
        },
      });
    }

    if (job.status !== "DRAFT" && job.status !== "PUBLISHED") {
      throw new BadRequestException({
        success: false,
        error: {
          code: JobErrorCode.INVALID_JOB_STATUS,
          message: "Only draft or published jobs without candidates may be deleted.",
        },
      });
    }

    await this.prisma.job.delete({
      where: { id: jobId },
    });
  }

  async updateExpiration(
    organizationId: string,
    jobId: string,
    input: UpdateJobExpirationInput,
  ) {
    const existing = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId },
      select: { id: true, expirationDate: true },
    });

    if (!existing) {
      throw jobNotFound();
    }

    const nextExpirationDate = input.expirationDate
      ? new Date(`${input.expirationDate}T00:00:00.000Z`)
      : null;
    const expirationChanged =
      formatDateOnly(existing.expirationDate) !==
      formatDateOnly(nextExpirationDate);

    await this.prisma.job.update({
      where: { id: jobId },
      data: {
        expirationDate: nextExpirationDate,
        ...(expirationChanged ? { expirationReminderSentAt: null } : {}),
      },
    });

    return {
      success: true as const,
    };
  }

  async listTemplates(organizationId: string) {
    const templates = await this.prisma.jobTemplate.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true as const,
      templates: templates.map((template) => ({
        id: template.id,
        name: template.name,
        title: template.title,
        department: template.department,
        employmentType: template.employmentType,
        workplaceType: template.workplaceType,
        location: template.location,
        salaryMin: template.salaryMin,
        salaryMax: template.salaryMax,
        currency: template.currency,
        salaryVisible: template.salaryVisible,
        description: template.description,
        responsibilities: template.responsibilities,
        requirements: template.requirements,
        benefits: template.benefits,
        skills: template.skills,
        positions: template.positions,
      })),
    };
  }

  async generateContent(input: GenerateJobContentInput) {
    try {
      const result = await this.aiService.generateStructured({
        system: JOB_CONTENT_SYSTEM_PROMPT,
        prompt: buildJobContentUserPrompt(input.prompt),
        schema: GeneratedJobContentSchema,
        schemaName: "GeneratedJobContent",
        schemaHint: JOB_CONTENT_SCHEMA_HINT,
        maxTokens: 2_500,
        normalize: normalizeGeneratedJobContent,
      });

      return {
        success: true as const,
        content: result.data,
      };
    } catch (error) {
      if (error instanceof AiInvalidResponseException) {
        throw new BadRequestException({
          success: false,
          error: {
            code: JobErrorCode.UNEXPECTED_ERROR,
            message: "AI could not generate valid job content. Please try again.",
          },
        });
      }

      if (error instanceof AiException) {
        throw new ServiceUnavailableException({
          success: false,
          error: {
            code: JobErrorCode.UNEXPECTED_ERROR,
            message: "AI service is temporarily unavailable. Please try again.",
          },
        });
      }

      throw error;
    }
  }
}

function jobNotFound() {
  return new NotFoundException({
    success: false,
    error: {
      code: JobErrorCode.JOB_NOT_FOUND,
      message: "Job not found.",
    },
  });
}

function buildJobListOrderBy(
  sortBy: ListJobsQuery["sortBy"],
  sortOrder: ListJobsQuery["sortOrder"],
): Prisma.JobOrderByWithRelationInput {
  if (sortBy === "candidateCount") {
    return {
      candidates: {
        _count: sortOrder,
      },
    };
  }

  if (sortBy === "title") {
    return { title: sortOrder };
  }

  if (sortBy === "status") {
    return { status: sortOrder };
  }

  return { createdAt: sortOrder };
}

function normalizeSkillNames(skills: string[]) {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const skill of skills) {
    const name = skill.trim().replace(/\s+/g, " ");
    if (!name) {
      continue;
    }
    const key = name.toLocaleLowerCase("en");
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    normalized.push(name);
  }

  return normalized;
}
