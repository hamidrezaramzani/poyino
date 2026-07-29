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
      recentCandidates,
    ] = await Promise.all([
      this.prisma.job.count({
        where: { organizationId },
      }),
      this.prisma.job.count({
        where: { organizationId, status: "PUBLISHED" },
      }),
      this.prisma.candidate.count({
        where: { organizationId },
      }),
      this.prisma.candidate.count({
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
            select: { candidates: true },
          },
        },
      }),
      this.prisma.candidate.findMany({
        where: { organizationId },
        orderBy: { appliedAt: "desc" },
        take: RECENT_LIMIT,
        select: {
          id: true,
          fullName: true,
          aiScore: true,
          status: true,
          appliedAt: true,
          jobId: true,
          job: {
            select: {
              title: true,
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
        candidateCount: job._count.candidates,
      })),
      recentCandidates: recentCandidates.map((candidate) => ({
        id: candidate.id,
        fullName: candidate.fullName,
        jobTitle: candidate.job.title,
        jobId: candidate.jobId,
        aiScore: candidate.aiScore,
        status: candidate.status,
        submittedAt: candidate.appliedAt.toISOString(),
      })),
    };
  }
}
