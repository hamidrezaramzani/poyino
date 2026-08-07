import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import {
  AI_CREDITS_INITIAL_GRANT,
  AI_CREDITS_LOW_THRESHOLD,
  AiCreditsErrorCode,
  NotificationEventName,
  getAiActionCost,
  type AiCreditFeature,
  type GetAiCreditHistoryQuery,
} from "@poyino/contracts";
import type { AiCreditTransactionType, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { DomainEventPublisher } from "../../notifications/services/domain-event.publisher";
import { PrismaService } from "../../prisma/prisma.service";
import {
  creditsNotInitializedException,
  insufficientCreditsException,
} from "../credits.errors";

type PrismaClientLike = PrismaService | Prisma.TransactionClient;

function toJsonValue(
  value: Record<string, unknown> | undefined,
): Prisma.InputJsonValue | undefined {
  if (!value) {
    return undefined;
  }
  return value as Prisma.InputJsonValue;
}

type RunWithCreditsParams = {
  organizationId: string;
  feature: AiCreditFeature;
  userId?: string | null;
  metadata?: Record<string, unknown>;
};

type GrantCreditsParams = {
  organizationId: string;
  amount: number;
  type?: Extract<
    AiCreditTransactionType,
    "GRANT" | "BONUS" | "PURCHASE" | "ADJUSTMENT"
  >;
  userId?: string | null;
  metadata?: Record<string, unknown>;
  planCode?: string | null;
  tx?: Prisma.TransactionClient;
};

function isInsufficientCreditsException(error: unknown): boolean {
  if (!(error instanceof BadRequestException)) {
    return false;
  }
  const response = error.getResponse();
  if (!response || typeof response !== "object") {
    return false;
  }
  const code = (response as { error?: { code?: string } }).error?.code;
  return code === AiCreditsErrorCode.INSUFFICIENT_CREDITS;
}

@Injectable()
export class CreditsService {
  private readonly logger = new Logger(CreditsService.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(DomainEventPublisher)
    private readonly domainEvents: DomainEventPublisher,
  ) {}

  /**
   * Creates the org credit wallet and applies the Beta initial grant.
   * Must be called inside the organization creation transaction when possible.
   */
  async initializeOrganizationCredits(
    organizationId: string,
    options?: {
      amount?: number;
      userId?: string | null;
      tx?: Prisma.TransactionClient;
      metadata?: Record<string, unknown>;
    },
  ) {
    const amount = options?.amount ?? AI_CREDITS_INITIAL_GRANT;
    const client = options?.tx ?? this.prisma;

    await client.organizationAiCredits.create({
      data: {
        id: randomUUID(),
        organizationId,
        balance: amount,
        lifetimeGranted: amount,
        lifetimeConsumed: 0,
        planCode: "beta",
      },
    });

    await client.aiCreditTransaction.create({
      data: {
        id: randomUUID(),
        organizationId,
        userId: options?.userId ?? null,
        type: "GRANT",
        feature: null,
        amount,
        balanceAfter: amount,
        metadata: toJsonValue(
          options?.metadata ?? { reason: "beta_initial_grant" },
        ),
      },
    });
  }

  async getBalance(organizationId: string) {
    const row = await this.ensureCreditRow(organizationId);
    return this.toBalanceDto(row.balance);
  }

  async getRemainingForUser(user: AuthenticatedUser) {
    const credits = await this.getBalance(user.organizationId);
    return {
      success: true as const,
      credits,
    };
  }

  async getUsageHistory(user: AuthenticatedUser, query: GetAiCreditHistoryQuery) {
    const organizationId = user.organizationId;
    const credits = await this.getBalance(organizationId);
    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const [total, rows] = await Promise.all([
      this.prisma.aiCreditTransaction.count({
        where: { organizationId },
      }),
      this.prisma.aiCreditTransaction.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          type: true,
          feature: true,
          amount: true,
          balanceAfter: true,
          userId: true,
          createdAt: true,
          user: { select: { email: true } },
        },
      }),
    ]);

    return {
      success: true as const,
      credits,
      items: rows.map((row) => ({
        id: row.id,
        type: row.type,
        feature: row.feature,
        amount: row.amount,
        balanceAfter: row.balanceAfter,
        userId: row.userId,
        userEmail: row.user?.email ?? null,
        createdAt: row.createdAt.toISOString(),
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
      },
    };
  }

  async getConsumptionBreakdown(user: AuthenticatedUser) {
    const organizationId = user.organizationId;
    const credits = await this.getBalance(organizationId);

    const grouped = await this.prisma.aiCreditTransaction.groupBy({
      by: ["feature"],
      where: {
        organizationId,
        type: "CONSUME",
        feature: { not: null },
      },
      _sum: { amount: true },
      _count: { _all: true },
    });

    const breakdown = grouped
      .filter(
        (
          row,
        ): row is typeof row & { feature: NonNullable<typeof row.feature> } =>
          row.feature != null,
      )
      .map((row) => ({
        feature: row.feature,
        creditsUsed: row._sum.amount ?? 0,
        transactionCount: row._count._all,
      }))
      .sort((a, b) => b.creditsUsed - a.creditsUsed);

    return {
      success: true as const,
      credits,
      breakdown,
    };
  }

  /**
   * Future billing will call this for purchased packs, bonuses, and renewals.
   */
  async grantCredits(params: GrantCreditsParams) {
    if (params.amount <= 0) {
      throw new Error("Grant amount must be positive.");
    }

    const client = params.tx ?? this.prisma;
    await this.ensureCreditRow(params.organizationId, client);

    const updated = await client.organizationAiCredits.update({
      where: { organizationId: params.organizationId },
      data: {
        balance: { increment: params.amount },
        lifetimeGranted: { increment: params.amount },
        ...(params.planCode !== undefined
          ? { planCode: params.planCode }
          : {}),
      },
    });

    await client.aiCreditTransaction.create({
      data: {
        id: randomUUID(),
        organizationId: params.organizationId,
        userId: params.userId ?? null,
        type: params.type ?? "GRANT",
        feature: null,
        amount: params.amount,
        balanceAfter: updated.balance,
        metadata: toJsonValue(params.metadata),
      },
    });

    return this.toBalanceDto(updated.balance);
  }

  /**
   * Internal consumption API. Prefer `runWithCredits` from business modules.
   * Atomically deducts credits and records a CONSUME transaction.
   */
  async consumeCredits(
    organizationId: string,
    feature: AiCreditFeature,
    options?: {
      userId?: string | null;
      metadata?: Record<string, unknown>;
      amount?: number;
    },
  ) {
    const amount = options?.amount ?? getAiActionCost(feature);
    const reserved = await this.reserveCredits(organizationId, amount);
    if (!reserved.ok) {
      throw insufficientCreditsException();
    }

    await this.recordConsumption({
      organizationId,
      feature,
      amount,
      balanceAfter: reserved.balanceAfter,
      userId: options?.userId ?? null,
      metadata: options?.metadata,
    });

    await this.maybeNotifyLowCredits(organizationId, reserved.balanceAfter);
    return {
      remaining: reserved.balanceAfter,
    };
  }

  async hasSufficientCredits(
    organizationId: string,
    feature: AiCreditFeature,
  ): Promise<boolean> {
    const cost = getAiActionCost(feature);
    const row = await this.prisma.organizationAiCredits.findUnique({
      where: { organizationId },
      select: { balance: true },
    });
    return (row?.balance ?? 0) >= cost;
  }

  async assertHasCredits(
    organizationId: string,
    feature: AiCreditFeature,
  ): Promise<void> {
    const ok = await this.hasSufficientCredits(organizationId, feature);
    if (!ok) {
      throw insufficientCreditsException();
    }
  }

  /**
   * Reserves credits, runs the AI operation, then records consumption.
   * On failure, reserved credits are refunded so failed AI calls do not bill.
   * Concurrent requests are safe via atomic balance checks (never negative).
   */
  async runWithCredits<T>(
    params: RunWithCreditsParams,
    operation: () => Promise<T>,
  ): Promise<T> {
    const amount = getAiActionCost(params.feature);
    const reserved = await this.reserveCredits(params.organizationId, amount);
    if (!reserved.ok) {
      throw insufficientCreditsException();
    }

    try {
      const result = await operation();
      await this.recordConsumption({
        organizationId: params.organizationId,
        feature: params.feature,
        amount,
        balanceAfter: reserved.balanceAfter,
        userId: params.userId ?? null,
        metadata: params.metadata,
      });
      await this.maybeNotifyLowCredits(
        params.organizationId,
        reserved.balanceAfter,
      );
      return result;
    } catch (error) {
      await this.refundCredits(params.organizationId, amount);
      throw error;
    }
  }

  /**
   * Soft check for background / public flows that should skip AI instead of fail.
   */
  async tryRunWithCredits<T>(
    params: RunWithCreditsParams,
    operation: () => Promise<T>,
  ): Promise<
    { ok: true; result: T } | { ok: false; reason: "INSUFFICIENT_CREDITS" }
  > {
    try {
      const result = await this.runWithCredits(params, operation);
      return { ok: true, result };
    } catch (error) {
      if (isInsufficientCreditsException(error)) {
        return { ok: false, reason: "INSUFFICIENT_CREDITS" };
      }
      throw error;
    }
  }

  private async reserveCredits(
    organizationId: string,
    amount: number,
  ): Promise<{ ok: true; balanceAfter: number } | { ok: false }> {
    await this.ensureCreditRow(organizationId);

    const rows = await this.prisma.$queryRaw<Array<{ balance: number }>>`
      UPDATE "organization_ai_credits"
      SET
        "balance" = "balance" - ${amount},
        "lifetime_consumed" = "lifetime_consumed" + ${amount},
        "updated_at" = CURRENT_TIMESTAMP
      WHERE "organization_id" = ${organizationId}::uuid
        AND "balance" >= ${amount}
      RETURNING "balance"
    `;

    if (!rows[0]) {
      return { ok: false };
    }

    return { ok: true, balanceAfter: rows[0].balance };
  }

  private async refundCredits(organizationId: string, amount: number) {
    await this.prisma.$executeRaw`
      UPDATE "organization_ai_credits"
      SET
        "balance" = "balance" + ${amount},
        "lifetime_consumed" = GREATEST("lifetime_consumed" - ${amount}, 0),
        "updated_at" = CURRENT_TIMESTAMP
      WHERE "organization_id" = ${organizationId}::uuid
    `;
  }

  private async recordConsumption(params: {
    organizationId: string;
    feature: AiCreditFeature;
    amount: number;
    balanceAfter: number;
    userId?: string | null;
    metadata?: Record<string, unknown>;
  }) {
    await this.prisma.aiCreditTransaction.create({
      data: {
        id: randomUUID(),
        organizationId: params.organizationId,
        userId: params.userId ?? null,
        type: "CONSUME",
        feature: params.feature,
        amount: params.amount,
        balanceAfter: params.balanceAfter,
        metadata: toJsonValue(params.metadata),
      },
    });
  }

  private async ensureCreditRow(
    organizationId: string,
    client: PrismaClientLike = this.prisma,
  ) {
    const existing = await client.organizationAiCredits.findUnique({
      where: { organizationId },
    });
    if (existing) {
      return existing;
    }

    this.logger.warn(
      `Initializing missing AI credits wallet for organization ${organizationId}`,
    );
    try {
      await this.initializeOrganizationCredits(organizationId, {
        tx:
          client === this.prisma
            ? undefined
            : (client as Prisma.TransactionClient),
      });
    } catch (error) {
      const raced = await client.organizationAiCredits.findUnique({
        where: { organizationId },
      });
      if (raced) {
        return raced;
      }
      this.logger.error(
        `Failed to initialize AI credits for ${organizationId}: ${String(error)}`,
      );
      throw creditsNotInitializedException();
    }

    const created = await client.organizationAiCredits.findUnique({
      where: { organizationId },
    });
    if (!created) {
      throw creditsNotInitializedException();
    }
    return created;
  }

  private toBalanceDto(remaining: number) {
    return {
      remaining,
      low: remaining > 0 && remaining <= AI_CREDITS_LOW_THRESHOLD,
      lowThreshold: AI_CREDITS_LOW_THRESHOLD,
      initialGrant: AI_CREDITS_INITIAL_GRANT,
    };
  }

  private async maybeNotifyLowCredits(
    organizationId: string,
    remaining: number,
  ) {
    if (remaining <= 0 || remaining > AI_CREDITS_LOW_THRESHOLD) {
      return;
    }

    try {
      const owners = await this.prisma.user.findMany({
        where: {
          organizationId,
          role: "OWNER",
          status: "ACTIVE",
        },
        select: { id: true },
      });

      if (owners.length === 0) {
        return;
      }

      this.domainEvents.publishNamed(
        NotificationEventName.BILLING_AI_CREDIT_LOW,
        {
          organizationId,
          triggeredBy: null,
          resourceType: "organization",
          resourceId: organizationId,
          targetUserIds: owners.map((owner) => owner.id),
          metadata: {
            remaining,
            lowThreshold: AI_CREDITS_LOW_THRESHOLD,
          },
        },
      );
    } catch (error) {
      this.logger.warn(
        `Failed to publish low AI credit notification: ${String(error)}`,
      );
    }
  }
}
