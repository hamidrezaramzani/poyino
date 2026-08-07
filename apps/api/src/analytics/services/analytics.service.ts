import { Inject, Injectable } from "@nestjs/common";
import type { AnalyticsQuery } from "@poyino/contracts";
import type { CandidateStatus, Prisma } from "@prisma/client";
import { departmentScopeFilter } from "../../authentication/lib/department-scope";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getDashboard(user: AuthenticatedUser, query: AnalyticsQuery) {
    const organizationId = user.organizationId;
    const scope = departmentScopeFilter(user);
    const appliedAt = resolveRangeFilter(query);
    const jobScope = scope.departmentId
      ? { departmentId: scope.departmentId }
      : {};
    const applicationWhere: Prisma.ApplicationWhereInput = {
      organizationId,
      ...(scope.departmentId
        ? { job: { departmentId: scope.departmentId } }
        : {}),
      ...(query.jobId ? { jobId: query.jobId } : {}),
      ...(appliedAt ? { appliedAt } : {}),
    };

    const [
      totalJobs,
      activeJobs,
      totalApplications,
      totalCandidates,
      interviewsScheduled,
      statusGroups,
      hiredApps,
    ] = await Promise.all([
      this.prisma.job.count({ where: { organizationId, ...jobScope } }),
      this.prisma.job.count({
        where: { organizationId, status: "PUBLISHED", ...jobScope },
      }),
      this.prisma.application.count({ where: applicationWhere }),
      this.prisma.candidate.count({
        where: {
          organizationId,
          ...(scope.departmentId
            ? { job: { departmentId: scope.departmentId } }
            : {}),
          ...(appliedAt ? { appliedAt } : {}),
        },
      }),
      this.prisma.interview.count({
        where: {
          organizationId,
          status: {
            in: [
              "SCHEDULED",
              "WAITING_CANDIDATE_CONFIRMATION",
              "ACCEPTED",
              "IN_PROGRESS",
            ],
          },
          ...(scope.departmentId
            ? { job: { departmentId: scope.departmentId } }
            : {}),
          ...(query.jobId ? { jobId: query.jobId } : {}),
          ...(appliedAt ? { scheduledAt: appliedAt } : {}),
        },
      }),
      this.prisma.application.groupBy({
        by: ["status"],
        where: applicationWhere,
        _count: { _all: true },
      }),
      this.prisma.application.findMany({
        where: {
          ...applicationWhere,
          status: "HIRED",
        },
        select: {
          appliedAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const statusMap = Object.fromEntries(
      statusGroups.map((group) => [group.status, group._count._all]),
    ) as Partial<Record<CandidateStatus, number>>;

    const statuses: CandidateStatus[] = [
      "APPLIED",
      "REVIEWING",
      "INTERVIEW_SCHEDULED",
      "INTERVIEW_PASSED",
      "REJECTED",
      "HIRED",
    ];

    let averageTimeToHireDays: number | null = null;
    if (hiredApps.length > 0) {
      const totalDays = hiredApps.reduce((sum, app) => {
        const ms = app.updatedAt.getTime() - app.appliedAt.getTime();
        return sum + ms / (24 * 60 * 60 * 1000);
      }, 0);
      averageTimeToHireDays =
        Math.round((totalDays / hiredApps.length) * 10) / 10;
    }

    return {
      success: true as const,
      dashboard: {
        totalJobs,
        activeJobs,
        totalApplications,
        totalCandidates,
        interviewsScheduled,
        hiredCandidates: statusMap.HIRED ?? 0,
        rejectedCandidates: statusMap.REJECTED ?? 0,
        averageTimeToHireDays,
      },
      statusDistribution: statuses.map((status) => ({
        status,
        count: statusMap[status] ?? 0,
      })),
    };
  }

  async getFunnel(user: AuthenticatedUser, query: AnalyticsQuery) {
    const scope = departmentScopeFilter(user);
    const appliedAt = resolveRangeFilter(query);
    const where: Prisma.ApplicationWhereInput = {
      organizationId: user.organizationId,
      ...(scope.departmentId
        ? { job: { departmentId: scope.departmentId } }
        : {}),
      ...(query.jobId ? { jobId: query.jobId } : {}),
      ...(appliedAt ? { appliedAt } : {}),
    };

    const [total, reviewing, interviewScheduled, interviewPassed, hired] =
      await Promise.all([
        this.prisma.application.count({ where }),
        this.prisma.application.count({
          where: {
            ...where,
            status: {
              in: [
                "REVIEWING",
                "INTERVIEW_SCHEDULED",
                "INTERVIEW_PASSED",
                "HIRED",
              ],
            },
          },
        }),
        this.prisma.application.count({
          where: {
            ...where,
            status: {
              in: ["INTERVIEW_SCHEDULED", "INTERVIEW_PASSED", "HIRED"],
            },
          },
        }),
        this.prisma.application.count({
          where: {
            ...where,
            status: { in: ["INTERVIEW_PASSED", "HIRED"] },
          },
        }),
        this.prisma.application.count({
          where: { ...where, status: "HIRED" },
        }),
      ]);

    const stages = [
      { stage: "APPLICATIONS" as const, count: total },
      { stage: "UNDER_REVIEW" as const, count: reviewing },
      { stage: "INTERVIEW_SCHEDULED" as const, count: interviewScheduled },
      { stage: "INTERVIEW_COMPLETED" as const, count: interviewPassed },
      { stage: "HIRED" as const, count: hired },
    ];

    return {
      success: true as const,
      funnel: stages.map((item) => ({
        ...item,
        percentage:
          total === 0 ? 0 : Math.round((item.count / total) * 1000) / 10,
      })),
    };
  }

  async getJobPerformance(user: AuthenticatedUser, query: AnalyticsQuery) {
    const scope = departmentScopeFilter(user);
    const appliedAt = resolveRangeFilter(query);
    const jobs = await this.prisma.job.findMany({
      where: {
        organizationId: user.organizationId,
        status: { not: "DRAFT" },
        ...scope,
        ...(query.jobId ? { id: query.jobId } : {}),
      },
      select: {
        id: true,
        title: true,
        applications: {
          where: appliedAt ? { appliedAt } : undefined,
          select: { status: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const items = jobs
      .map((job) => {
        const applications = job.applications.length;
        const interviews = job.applications.filter((app) =>
          [
            "INTERVIEW_SCHEDULED",
            "INTERVIEW_PASSED",
            "HIRED",
          ].includes(app.status),
        ).length;
        const hires = job.applications.filter(
          (app) => app.status === "HIRED",
        ).length;
        return {
          jobId: job.id,
          title: job.title,
          applications,
          interviews,
          hires,
          hireRate:
            applications === 0
              ? 0
              : Math.round((hires / applications) * 1000) / 10,
        };
      })
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 10);

    return { success: true as const, jobs: items };
  }

  async getTrends(user: AuthenticatedUser, query: AnalyticsQuery) {
    const scope = departmentScopeFilter(user);
    const appliedAt = resolveRangeFilter(query) ?? {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    };

    const applications = await this.prisma.application.findMany({
      where: {
        organizationId: user.organizationId,
        ...(scope.departmentId
          ? { job: { departmentId: scope.departmentId } }
          : {}),
        ...(query.jobId ? { jobId: query.jobId } : {}),
        appliedAt,
      },
      select: { appliedAt: true },
      orderBy: { appliedAt: "asc" },
    });

    const buckets = new Map<string, number>();
    for (const application of applications) {
      const key = application.appliedAt.toISOString().slice(0, 10);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }

    const trends = [...buckets.entries()].map(([date, count]) => ({
      date,
      count,
    }));

    return { success: true as const, trends };
  }
}

function resolveRangeFilter(query: AnalyticsQuery) {
  const now = new Date();
  if (query.range === "CUSTOM") {
    const filter: Prisma.DateTimeFilter = {};
    if (query.dateFrom) {
      filter.gte = new Date(`${query.dateFrom}T00:00:00.000Z`);
    }
    if (query.dateTo) {
      filter.lte = new Date(`${query.dateTo}T23:59:59.999Z`);
    }
    return Object.keys(filter).length > 0 ? filter : undefined;
  }

  const days =
    query.range === "LAST_7_DAYS"
      ? 7
      : query.range === "LAST_90_DAYS"
        ? 90
        : query.range === "LAST_YEAR"
          ? 365
          : 30;

  return { gte: new Date(now.getTime() - days * 24 * 60 * 60 * 1000) };
}
