import type {
  BetaFeedbackAnalytics,
  BetaFeedbackResponse,
  ListBetaFeedbackQuery,
} from "@poyino/contracts";
import {
  Button,
  EmptyState,
  Input,
  Skeleton,
  StatisticCard,
} from "@poyino/ui";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { formatDate } from "../../../shared/lib/format-date";
import {
  getAdminFeedbackAnalytics,
  listAdminFeedback,
} from "../services/feedback.service";

export function AdminFeedbackPage() {
  const { t, locale } = useI18n();
  const [responses, setResponses] = useState<BetaFeedbackResponse[]>([]);
  const [analytics, setAnalytics] = useState<BetaFeedbackAnalytics | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [filters, setFilters] = useState<Partial<ListBetaFeedbackQuery>>({
    page: 1,
    pageSize: 20,
  });

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [list, stats] = await Promise.all([
        listAdminFeedback(filters),
        getAdminFeedbackAnalytics(),
      ]);
      setResponses(list.responses);
      setAnalytics(stats.analytics);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [filters]);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === "error") {
    return (
      <EmptyState title={t.feedback.loadFailed}>
        <Button type="button" onClick={() => void load()}>
          {t.feedback.retry}
        </Button>
      </EmptyState>
    );
  }

  const willingnessData = Object.entries(
    analytics?.willingnessToPayDistribution ?? {},
  ).map(([key, value]) => ({
    name:
      t.feedback.options.willingnessToPay[
        key as keyof typeof t.feedback.options.willingnessToPay
      ] ?? key,
    count: value,
  }));

  const valuableData = Object.entries(
    analytics?.mostValuableFeatureDistribution ?? {},
  ).map(([key, value]) => ({
    name:
      t.feedback.options.valuableFeature[
        key as keyof typeof t.feedback.options.valuableFeature
      ] ?? key,
    count: value,
  }));

  return (
    <div className="feedback-admin-page">
      <header className="feedback-page-header">
        <div>
          <h1>{t.feedback.adminTitle}</h1>
          <p>{t.feedback.adminDescription}</p>
        </div>
      </header>

      {status === "loading" || !analytics ? (
        <div className="feedback-admin-stats">
          <Skeleton height="6rem" />
          <Skeleton height="6rem" />
          <Skeleton height="6rem" />
          <Skeleton height="6rem" />
        </div>
      ) : (
        <>
          <section className="feedback-admin-stats" aria-label={t.feedback.analyticsTitle}>
            <StatisticCard
              label={t.feedback.totalResponses}
              value={String(analytics.totalResponses)}
            />
            <StatisticCard
              label={t.feedback.averageSatisfaction}
              value={
                analytics.averageSatisfaction == null
                  ? "—"
                  : String(analytics.averageSatisfaction)
              }
            />
            <StatisticCard
              label={t.feedback.averageRecommendation}
              value={
                analytics.averageDisappointmentIfGone == null
                  ? "—"
                  : String(analytics.averageDisappointmentIfGone)
              }
            />
            <StatisticCard
              label={t.feedback.completionRate}
              value={
                analytics.completionRate == null
                  ? "—"
                  : `${Math.round(analytics.completionRate * 100)}%`
              }
            />
          </section>

          <section className="feedback-admin-charts">
            <article>
              <h2>{t.feedback.willingnessToPay}</h2>
              <div className="feedback-chart">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={willingnessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--ui-primary, #150578)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
            <article>
              <h2>{t.feedback.mostValuable}</h2>
              <div className="feedback-chart">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={valuableData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" hide />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--ui-accent, #3943B7)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          <section className="feedback-admin-lists">
            <article>
              <h2>{t.feedback.topMissing}</h2>
              <ul>
                {analytics.topMissingFeatures.length === 0 ? (
                  <li>—</li>
                ) : (
                  analytics.topMissingFeatures.map((item) => (
                    <li key={item.text}>
                      {item.text} ({item.count})
                    </li>
                  ))
                )}
              </ul>
            </article>
            <article>
              <h2>{t.feedback.topProblems}</h2>
              <ul>
                {analytics.topImprovementThemes.length === 0 ? (
                  <li>—</li>
                ) : (
                  analytics.topImprovementThemes.map((item) => (
                    <li key={item.text}>
                      {item.text} ({item.count})
                    </li>
                  ))
                )}
              </ul>
            </article>
            <article>
              <h2>{t.feedback.commonKeywords}</h2>
              <div className="feedback-keywords">
                {analytics.commonKeywords.length === 0
                  ? "—"
                  : analytics.commonKeywords.map((item) => (
                      <span key={item.keyword}>
                        {item.keyword} · {item.count}
                      </span>
                    ))}
              </div>
            </article>
          </section>
        </>
      )}

      <section className="feedback-admin-list">
        <div className="feedback-admin-list-toolbar">
          <h2>{t.feedback.recentFeedback}</h2>
          <Input
            value={filters.search ?? ""}
            placeholder={t.feedback.searchPlaceholder}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value || undefined,
                page: 1,
              }))
            }
          />
        </div>

        {status === "loading" ? (
          <Skeleton height="10rem" />
        ) : responses.length === 0 ? (
          <EmptyState title={t.feedback.adminEmptyTitle}>
            <p>{t.feedback.adminEmptyDescription}</p>
          </EmptyState>
        ) : (
          <ul className="feedback-response-list">
            {responses.map((response) => (
              <li key={response.id}>
                <div>
                  <strong>
                    {response.organizationName ?? response.organizationId}
                  </strong>
                  <p>
                    {response.submittedByEmail ?? response.submittedByUserId} ·{" "}
                    {formatDate(response.submittedAt, locale, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p>
                    {t.feedback.averageSatisfaction}:{" "}
                    {response.answers.satisfaction}/10
                  </p>
                </div>
                <Link to={`/admin/feedback/${response.id}`}>
                  <Button type="button" variant="secondary">
                    {t.feedback.viewDetails}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
