import { Inject, Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import {
  BETA_FEEDBACK_COOLDOWN_DAYS,
  BETA_FEEDBACK_MIN_ORG_AGE_DAYS,
  BETA_FEEDBACK_SURVEY_KEY,
  BETA_FEEDBACK_SURVEY_VERSION,
  BetaFeedbackAnswersV1Schema,
  isBetaStage,
  type BetaFeedbackAnswersV1,
  type BetaFeedbackEligibility,
  type BetaFeedbackResponse,
  type ListBetaFeedbackQuery,
  type SubmitBetaFeedbackInput,
} from "@poyino/contracts";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { loadAppConfig } from "../../app/config/app-stage.config";
import { PrismaService } from "../../prisma/prisma.service";
import {
  feedbackCooldownException,
  feedbackForbiddenException,
  feedbackInvalidSurveyException,
  feedbackNotEligibleException,
  feedbackNotFoundException,
} from "../feedback.errors";

type StoredResponse = {
  id: string;
  organizationId: string;
  submittedByUserId: string;
  surveyKey: string;
  surveyVersion: string;
  productVersion: string | null;
  answers: unknown;
  submittedAt: Date;
  updatedAt: Date;
  organization?: { name: string } | null;
  submittedByUser?: { email: string } | null;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "or",
  "the",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "is",
  "it",
  "this",
  "that",
  "we",
  "our",
  "my",
  "be",
  "as",
  "at",
  "by",
  "from",
  "not",
  "no",
  "yes",
  "و",
  "در",
  "به",
  "از",
  "که",
  "این",
  "را",
  "با",
  "برای",
]);

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getEligibility(
    user: AuthenticatedUser,
  ): Promise<{ success: true; eligibility: BetaFeedbackEligibility }> {
    this.assertBetaEnabled();
    const eligibility = await this.resolveEligibility(
      user.organizationId,
      BETA_FEEDBACK_SURVEY_KEY,
    );
    return { success: true as const, eligibility };
  }

  async submit(
    user: AuthenticatedUser,
    input: SubmitBetaFeedbackInput,
  ): Promise<{
    success: true;
    response: BetaFeedbackResponse;
    updated: boolean;
  }> {
    this.assertBetaEnabled();
    const surveyKey = input.surveyKey || BETA_FEEDBACK_SURVEY_KEY;
    const surveyVersion = input.surveyVersion || BETA_FEEDBACK_SURVEY_VERSION;

    if (
      surveyKey !== BETA_FEEDBACK_SURVEY_KEY ||
      surveyVersion !== BETA_FEEDBACK_SURVEY_VERSION
    ) {
      throw feedbackInvalidSurveyException("Unsupported survey version.");
    }

    const eligibility = await this.resolveEligibility(
      user.organizationId,
      surveyKey,
    );

    if (!eligibility.eligible) {
      throw feedbackNotEligibleException();
    }

    if (!eligibility.canSubmit && !eligibility.canUpdate) {
      throw feedbackCooldownException(
        eligibility.nextSubmitAt ?? new Date().toISOString(),
      );
    }

    // Updates are always allowed; the cooldown only blocks a second distinct cycle
    // when no prior response exists to update (handled by unique org+surveyKey).

    const productVersion = loadAppConfig().productVersion;
    const existing = await this.prisma.betaFeedbackResponse.findUnique({
      where: {
        organizationId_surveyKey: {
          organizationId: user.organizationId,
          surveyKey,
        },
      },
    });

    const record = existing
      ? await this.prisma.betaFeedbackResponse.update({
          where: { id: existing.id },
          data: {
            submittedByUserId: user.id,
            surveyVersion,
            productVersion,
            answers: input.answers as Prisma.InputJsonValue,
          },
          include: {
            organization: { select: { name: true } },
            submittedByUser: { select: { email: true } },
          },
        })
      : await this.prisma.betaFeedbackResponse.create({
          data: {
            organizationId: user.organizationId,
            submittedByUserId: user.id,
            surveyKey,
            surveyVersion,
            productVersion,
            answers: input.answers as Prisma.InputJsonValue,
          },
          include: {
            organization: { select: { name: true } },
            submittedByUser: { select: { email: true } },
          },
        });

    return {
      success: true as const,
      response: this.mapResponse(record),
      updated: Boolean(existing),
    };
  }

  async getOrgSubmission(user: AuthenticatedUser) {
    this.assertBetaEnabled();
    const record = await this.prisma.betaFeedbackResponse.findUnique({
      where: {
        organizationId_surveyKey: {
          organizationId: user.organizationId,
          surveyKey: BETA_FEEDBACK_SURVEY_KEY,
        },
      },
      include: {
        organization: { select: { name: true } },
        submittedByUser: { select: { email: true } },
      },
    });

    if (!record) {
      throw feedbackNotFoundException();
    }

    return {
      success: true as const,
      response: this.mapResponse(record),
    };
  }

  async listAdmin(query: ListBetaFeedbackQuery) {
    const where = {
      ...(query.surveyKey ? { surveyKey: query.surveyKey } : {}),
      ...(query.surveyVersion ? { surveyVersion: query.surveyVersion } : {}),
      ...(query.search
        ? {
            OR: [
              {
                organization: {
                  name: { contains: query.search, mode: "insensitive" as const },
                },
              },
              {
                submittedByUser: {
                  email: {
                    contains: query.search,
                    mode: "insensitive" as const,
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      this.prisma.betaFeedbackResponse.count({ where }),
      this.prisma.betaFeedbackResponse.findMany({
        where,
        include: {
          organization: { select: { name: true } },
          submittedByUser: { select: { email: true } },
        },
        orderBy: { submittedAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
    ]);

    return {
      success: true as const,
      responses: rows.map((row) => this.mapResponse(row)),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async getAdmin(responseId: string) {
    const record = await this.prisma.betaFeedbackResponse.findUnique({
      where: { id: responseId },
      include: {
        organization: { select: { name: true } },
        submittedByUser: { select: { email: true } },
      },
    });

    if (!record) {
      throw feedbackNotFoundException();
    }

    return {
      success: true as const,
      response: this.mapResponse(record),
    };
  }

  async getAdminAnalytics(surveyKey = BETA_FEEDBACK_SURVEY_KEY) {
    const rows = await this.prisma.betaFeedbackResponse.findMany({
      where: { surveyKey },
      include: {
        organization: { select: { name: true } },
        submittedByUser: { select: { email: true } },
      },
      orderBy: { submittedAt: "desc" },
    });

    const answers = rows
      .map((row) => {
        const parsed = BetaFeedbackAnswersV1Schema.safeParse(row.answers);
        return parsed.success ? parsed.data : null;
      })
      .filter((value): value is BetaFeedbackAnswersV1 => Boolean(value));

    const totalResponses = rows.length;
    const avg = (values: number[]) =>
      values.length === 0
        ? null
        : Math.round(
            (values.reduce((sum, value) => sum + value, 0) / values.length) * 10,
          ) / 10;

    const countBy = <T extends string>(values: T[]) => {
      const result: Record<string, number> = {};
      for (const value of values) {
        result[value] = (result[value] ?? 0) + 1;
      }
      return result;
    };

    const freeText = answers.flatMap((answer) => [
      answer.needsImprovement,
      answer.confusingAspects,
      answer.missingFeature,
      answer.additionalComments ?? "",
    ]);

    const orgCount = await this.prisma.organization.count();
    const completionRate =
      orgCount > 0 ? Math.round((totalResponses / orgCount) * 1000) / 1000 : null;

    return {
      success: true as const,
      analytics: {
        totalResponses,
        eligibleOrganizationsEstimate: orgCount,
        completionRate,
        averageSatisfaction: avg(answers.map((a) => a.satisfaction)),
        averageDisappointmentIfGone: avg(
          answers.map((a) => a.disappointmentIfGone),
        ),
        willingnessToPayDistribution: countBy(
          answers.map((a) => a.willingnessToPay),
        ),
        timeReductionDistribution: countBy(
          answers.map((a) => a.timeReduction),
        ),
        mostValuableFeatureDistribution: countBy(
          answers.map((a) => a.mostValuableFeature),
        ),
        aiHelpDistribution: countBy(
          answers.map((a) => a.aiRecommendationsHelp),
        ),
        topMissingFeatures: this.topPhrases(
          answers.map((a) => a.missingFeature),
        ),
        topImprovementThemes: this.topPhrases(
          answers.map((a) => a.needsImprovement),
        ),
        commonKeywords: this.extractKeywords(freeText),
        recentResponses: rows.slice(0, 8).map((row) => this.mapResponse(row)),
      },
    };
  }

  private assertBetaEnabled() {
    if (!isBetaStage(loadAppConfig().stage)) {
      throw feedbackForbiddenException(
        "Beta feedback is only available while APP_STAGE=beta.",
      );
    }
  }

  private async resolveEligibility(
    organizationId: string,
    surveyKey: string,
  ): Promise<BetaFeedbackEligibility> {
    const [organization, jobCount, candidateCount, existing] =
      await Promise.all([
        this.prisma.organization.findUniqueOrThrow({
          where: { id: organizationId },
          select: { createdAt: true },
        }),
        this.prisma.job.count({ where: { organizationId } }),
        this.prisma.candidate.count({ where: { organizationId } }),
        this.prisma.betaFeedbackResponse.findUnique({
          where: {
            organizationId_surveyKey: { organizationId, surveyKey },
          },
          include: {
            organization: { select: { name: true } },
            submittedByUser: { select: { email: true } },
          },
        }),
      ]);

    const ageMs = Date.now() - organization.createdAt.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    const reasons: BetaFeedbackEligibility["reasons"] = [];

    if (ageDays >= BETA_FEEDBACK_MIN_ORG_AGE_DAYS) {
      reasons.push("ORG_AGE");
    }
    if (jobCount > 0) {
      reasons.push("HAS_JOBS");
    }
    if (candidateCount > 0) {
      reasons.push("HAS_CANDIDATES");
    }

    const eligible = reasons.length > 0;
    if (!eligible) {
      reasons.push("NOT_ELIGIBLE");
    }

    const submission = existing ? this.mapResponse(existing) : null;
    const hasSubmission = Boolean(existing);
    const canUpdate = eligible && hasSubmission;
    const canSubmit = eligible && !hasSubmission;

    let nextSubmitAt: string | null = null;
    if (existing) {
      const cooldownMs = BETA_FEEDBACK_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
      nextSubmitAt = new Date(
        existing.updatedAt.getTime() + cooldownMs,
      ).toISOString();
    }

    return {
      eligible,
      reasons,
      hasSubmission,
      canSubmit,
      canUpdate,
      nextSubmitAt,
      submission,
    };
  }

  private mapResponse(record: StoredResponse): BetaFeedbackResponse {
    const parsed = BetaFeedbackAnswersV1Schema.safeParse(record.answers);
    if (!parsed.success) {
      throw feedbackInvalidSurveyException("Stored answers are invalid.");
    }

    return {
      id: record.id,
      organizationId: record.organizationId,
      organizationName: record.organization?.name,
      submittedByUserId: record.submittedByUserId,
      submittedByEmail: record.submittedByUser?.email,
      surveyKey: record.surveyKey,
      surveyVersion: record.surveyVersion,
      productVersion: record.productVersion,
      answers: parsed.data,
      submittedAt: record.submittedAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  private topPhrases(texts: string[], limit = 8) {
    const counts = new Map<string, number>();
    for (const text of texts) {
      const normalized = text.trim().toLowerCase();
      if (normalized.length < 3) continue;
      const key =
        normalized.length > 80 ? `${normalized.slice(0, 77)}...` : normalized;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([text, count]) => ({ text, count }));
  }

  private extractKeywords(texts: string[], limit = 12) {
    const counts = new Map<string, number>();
    for (const text of texts) {
      const tokens = text
        .toLowerCase()
        .split(/[^\p{L}\p{N}]+/u)
        .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
      for (const token of tokens) {
        counts.set(token, (counts.get(token) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([keyword, count]) => ({ keyword, count }));
  }
}
