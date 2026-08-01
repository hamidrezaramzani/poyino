import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

const RECENT_LIMIT = 10;

@Injectable()
export class DashboardService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getOverview(organizationId: string) {
    const [
      totalJobs,
      activeJobs,
      totalCandidates,
      totalHired,
      recentJobs,
      recentApplications,
    ] = await Promise.all([
      this.prisma.job.count({
        where: { organizationId },
      }),
      this.prisma.job.count({
        where: { organizationId, status: "PUBLISHED" },
      }),
      this.prisma.application.count({
        where: { organizationId },
      }),
      this.prisma.application.count({
        where: { organizationId, status: "HIRED" },
      }),
      this.prisma.job.findMany({
        where: { organizationId },
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
        where: { organizationId },
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
