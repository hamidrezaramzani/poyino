import { Inject, Injectable } from "@nestjs/common";
import { departmentScopeFilter } from "../../authentication/lib/department-scope";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { PrismaService } from "../../prisma/prisma.service";

const RECENT_LIMIT = 10;

@Injectable()
export class DashboardService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getOverview(user: AuthenticatedUser) {
    const organizationId = user.organizationId;
    const scope = departmentScopeFilter(user);
    const jobScope = scope.departmentId
      ? { departmentId: scope.departmentId }
      : {};
    const applicationScope = scope.departmentId
      ? { job: { departmentId: scope.departmentId } }
      : {};

    const [
      totalJobs,
      activeJobs,
      totalCandidates,
      totalHired,
      recentJobs,
      recentApplications,
    ] = await Promise.all([
      this.prisma.job.count({
        where: { organizationId, ...jobScope },
      }),
      this.prisma.job.count({
        where: { organizationId, status: "PUBLISHED", ...jobScope },
      }),
      this.prisma.application.count({
        where: { organizationId, ...applicationScope },
      }),
      this.prisma.application.count({
        where: { organizationId, status: "HIRED", ...applicationScope },
      }),
      this.prisma.job.findMany({
        where: { organizationId, ...jobScope },
        orderBy: { createdAt: "desc" },
        take: RECENT_LIMIT,
        select: {
          id: true,
          title: true,
          status: true,
          publishedAt: true,
          _count: {
            select: { applications: true },
          },
        },
      }),
      this.prisma.application.findMany({
        where: { organizationId, ...applicationScope },
        orderBy: { appliedAt: "desc" },
        take: RECENT_LIMIT,
        select: {
          id: true,
          status: true,
          appliedAt: true,
          jobId: true,
          job: {
            select: {
              title: true,
            },
          },
          candidate: {
            select: {
              id: true,
              fullName: true,
              aiScore: true,
            },
          },
        },
      }),
    ]);

    return {
      success: true as const,
      statistics: {
        totalJobs,
        activeJobs,
        totalCandidates,
        totalHired,
      },
      recentJobs: recentJobs.map((job) => ({
        id: job.id,
        title: job.title,
        status: job.status,
        publishedAt: job.publishedAt?.toISOString() ?? null,
        candidateCount: job._count.applications,
      })),
      recentCandidates: recentApplications.map((application) => ({
        id: application.candidate.id,
        fullName: application.candidate.fullName,
        jobTitle: application.job.title,
        jobId: application.jobId,
        aiScore: application.candidate.aiScore,
        status: application.status,
        submittedAt: application.appliedAt.toISOString(),
      })),
    };
  }
}
