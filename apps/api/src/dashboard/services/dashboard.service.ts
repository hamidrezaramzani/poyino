import { Inject, Injectable } from "@nestjs/common";
import {
  AI_CREDITS_LOW_THRESHOLD,
  isPlatformAdmin,
  type PlatformRole,
} from "@poyino/contracts";
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
      aiCreditsRow,
      supportOpen,
      supportResolved,
      latestSupportReply,
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
      this.prisma.organizationAiCredits.findUnique({
        where: { organizationId },
        select: { balance: true },
      }),
      this.prisma.supportTicket.count({
        where: {
          organizationId,
          status: {
            in: ["OPEN", "WAITING_FOR_ADMIN", "WAITING_FOR_CUSTOMER"],
          },
        },
      }),
      this.prisma.supportTicket.count({
        where: {
          organizationId,
          status: { in: ["RESOLVED", "CLOSED"] },
        },
      }),
      this.prisma.supportMessage.findFirst({
        where: {
          authorType: "PLATFORM_ADMIN",
          ticket: { organizationId },
        },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

    const remaining = aiCreditsRow?.balance ?? 0;
    const platformSupport = isPlatformAdmin(user.platformRole as PlatformRole)
      ? await this.getPlatformSupportStats()
      : undefined;

    return {
      success: true as const,
      statistics: {
        totalJobs,
        activeJobs,
        totalCandidates,
        totalHired,
      },
      aiCredits: {
        remaining,
        low: remaining > 0 && remaining <= AI_CREDITS_LOW_THRESHOLD,
        lowThreshold: AI_CREDITS_LOW_THRESHOLD,
      },
      support: {
        openTickets: supportOpen,
        resolvedTickets: supportResolved,
        latestReplyAt: latestSupportReply?.createdAt.toISOString() ?? null,
      },
      ...(platformSupport ? { platformSupport } : {}),
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

  private async getPlatformSupportStats() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [openTickets, waitingForReply, resolvedToday, responseSamples] =
      await Promise.all([
        this.prisma.supportTicket.count({
          where: {
            status: {
              in: ["OPEN", "WAITING_FOR_ADMIN", "WAITING_FOR_CUSTOMER"],
            },
          },
        }),
        this.prisma.supportTicket.count({
          where: { status: "WAITING_FOR_ADMIN" },
        }),
        this.prisma.supportTicket.count({
          where: {
            status: "RESOLVED",
            resolvedAt: { gte: startOfDay },
          },
        }),
        this.prisma.supportTicket.findMany({
          where: { firstResponseAt: { not: null } },
          select: { createdAt: true, firstResponseAt: true },
          take: 500,
          orderBy: { createdAt: "desc" },
        }),
      ]);

    let averageResponseTimeMinutes: number | null = null;
    if (responseSamples.length > 0) {
      const totalMs = responseSamples.reduce((sum, ticket) => {
        if (!ticket.firstResponseAt) {
          return sum;
        }
        return (
          sum +
          (ticket.firstResponseAt.getTime() - ticket.createdAt.getTime())
        );
      }, 0);
      averageResponseTimeMinutes = Math.round(
        totalMs / responseSamples.length / 60_000,
      );
    }

    return {
      openTickets,
      waitingForReply,
      resolvedToday,
      averageResponseTimeMinutes,
    };
  }
}
