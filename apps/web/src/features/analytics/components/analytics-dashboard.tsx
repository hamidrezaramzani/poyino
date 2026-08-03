import type { AnalyticsDateRange, DashboardCandidateStatus, JobPerformanceItem } from "@poyino/contracts";
import {
  Button,
  Card,
  EmptyState,
  Select,
  Skeleton,
  StatisticCard,
  Table,
  TableSection,
  type TableColumn,
} from "@poyino/ui";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { formatDate } from "../../../shared/lib/format-date";
import { useAnalytics } from "../hooks/use-analytics";

const RANGES: AnalyticsDateRange[] = [
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "LAST_90_DAYS",
  "LAST_YEAR",
];

const STATUS_COLORS: Record<DashboardCandidateStatus, string> = {
  APPLIED: "#93a0b0",
  REVIEWING: "#e8c07a",
  INTERVIEW_SCHEDULED: "#8ea2ff",
  INTERVIEW_PASSED: "#78c0e0",
  HIRED: "#7dcea0",
  REJECTED: "#f2a3a0",
};

export function AnalyticsDashboard() {
  const { t, locale } = useI18n();
  const analytics = useAnalytics();

  if (analytics.status === "loading") {
    return <AnalyticsDashboardSkeleton />;
  }

  if (analytics.status === "error" || !analytics.dashboard) {
    return (
      <EmptyState title={t.analytics.loadFailed}>
        <Button type="button" onClick={() => void analytics.retry()}>
          {t.analytics.retry}
        </Button>
      </EmptyState>
    );
  }

  const { dashboard } = analytics;
  const maxFunnelCount = Math.max(1, ...analytics.funnel.map((stage) => stage.count));

  const jobColumns: Array<TableColumn<JobPerformanceItem>> = [
    {
      key: "title",
      header: t.analytics.jobPerformance.columns.title,
      render: (job) => job.title,
    },
    {
      key: "applications",
      header: t.analytics.jobPerformance.columns.applications,
      render: (job) => job.applications,
    },
    {
      key: "interviews",
      header: t.analytics.jobPerformance.columns.interviews,
      render: (job) => job.interviews,
    },
    {
      key: "hires",
      header: t.analytics.jobPerformance.columns.hires,
      render: (job) => job.hires,
    },
    {
      key: "hireRate",
      header: t.analytics.jobPerformance.columns.hireRate,
      render: (job) => `${job.hireRate.toFixed(1)}%`,
    },
  ];

  return (
    <div className="analytics-layout">
      <div className="analytics-header">
        <div>
          <h1 className="dashboard-section-title">{t.analytics.title}</h1>
          <p className="dashboard-page-label">{t.analytics.description}</p>
        </div>
        <Select
          value={analytics.range}
          onChange={(event) =>
            analytics.changeRange(event.target.value as AnalyticsDateRange)
          }
          options={RANGES.map((value) => ({
            value,
            label: t.analytics.ranges[value],
          }))}
        />
      </div>

      <div className="analytics-kpi-grid">
        <StatisticCard label={t.analytics.kpis.totalJobs} value={dashboard.totalJobs} />
        <StatisticCard label={t.analytics.kpis.activeJobs} value={dashboard.activeJobs} />
        <StatisticCard
          label={t.analytics.kpis.totalApplications}
          value={dashboard.totalApplications}
        />
        <StatisticCard
          label={t.analytics.kpis.totalCandidates}
          value={dashboard.totalCandidates}
        />
        <StatisticCard
          label={t.analytics.kpis.interviewsScheduled}
          value={dashboard.interviewsScheduled}
        />
        <StatisticCard
          label={t.analytics.kpis.hiredCandidates}
          value={dashboard.hiredCandidates}
        />
        <StatisticCard
          label={t.analytics.kpis.rejectedCandidates}
          value={dashboard.rejectedCandidates}
        />
        <StatisticCard
          label={t.analytics.kpis.averageTimeToHireDays}
          value={
            dashboard.averageTimeToHireDays === null
              ? t.analytics.kpis.averageTimeToHireEmpty
              : dashboard.averageTimeToHireDays.toFixed(1)
          }
        />
      </div>

      <div className="analytics-charts-grid">
        <Card title={t.analytics.charts.trendsTitle} description={t.analytics.charts.trendsDescription}>
          {analytics.trends.length === 0 ? (
            <EmptyState title={t.analytics.empty} />
          ) : (
            <div className="analytics-chart-container">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={analytics.trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ui-border)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value: string) => formatShortDate(value, locale)}
                    stroke="var(--ui-muted)"
                    fontSize={12}
                  />
                  <YAxis allowDecimals={false} stroke="var(--ui-muted)" fontSize={12} />
                  <Tooltip
                    labelFormatter={(value) =>
                      formatShortDate(String(value), locale)
                    }
                    contentStyle={{
                      backgroundColor: "var(--ui-surface)",
                      border: "1px solid var(--ui-border)",
                      borderRadius: "0.5rem",
                      color: "var(--ui-text)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--ui-primary)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card title={t.analytics.charts.statusDistributionTitle}>
          {analytics.statusDistribution.length === 0 ? (
            <EmptyState title={t.analytics.empty} />
          ) : (
            <div className="analytics-chart-container">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={analytics.statusDistribution}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    label={(props: unknown) => {
                      const { status, count } = props as {
                        status?: DashboardCandidateStatus;
                        count?: number;
                      };
                      return `${t.dashboard.candidateStatus[status ?? "APPLIED"]} (${count ?? 0})`;
                    }}
                  >
                    {analytics.statusDistribution.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, _name, item) => {
                      const payload = (
                        item as { payload?: { status?: DashboardCandidateStatus } }
                      )?.payload;
                      return [
                        value,
                        t.dashboard.candidateStatus[payload?.status ?? "APPLIED"],
                      ] as [number, string];
                    }}
                    contentStyle={{
                      backgroundColor: "var(--ui-surface)",
                      border: "1px solid var(--ui-border)",
                      borderRadius: "0.5rem",
                      color: "var(--ui-text)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card title={t.analytics.charts.funnelTitle}>
          {analytics.funnel.length === 0 ? (
            <EmptyState title={t.analytics.empty} />
          ) : (
            <div className="analytics-funnel">
              {analytics.funnel.map((stage) => (
                <div className="analytics-funnel-row" key={stage.stage}>
                  <span className="analytics-funnel-label">
                    {t.analytics.funnelStages[stage.stage]}
                  </span>
                  <div className="analytics-funnel-bar-track">
                    <div
                      className="analytics-funnel-bar-fill"
                      style={{
                        width: `${Math.max(4, (stage.count / maxFunnelCount) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="analytics-funnel-value">
                    {stage.count} ({stage.percentage.toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <TableSection
        title={t.analytics.charts.jobPerformanceTitle}
        style={{ marginTop: 0 }}
      >
        {analytics.jobs.length === 0 ? (
          <EmptyState title={t.analytics.jobPerformance.empty} />
        ) : (
          <Table
            columns={jobColumns}
            rows={analytics.jobs}
            getRowKey={(job) => job.jobId}
            caption={t.analytics.charts.jobPerformanceTitle}
          />
        )}
      </TableSection>
    </div>
  );
}

function AnalyticsDashboardSkeleton() {
  return (
    <div className="analytics-layout">
      <Skeleton height={40} width="30%" />
      <div className="analytics-kpi-grid">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} height={110} />
        ))}
      </div>
      <div className="analytics-charts-grid">
        <Skeleton height={300} />
        <Skeleton height={300} />
        <Skeleton height={300} />
      </div>
      <Skeleton height={220} />
    </div>
  );
}

function formatShortDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return formatDate(date, locale, {
    month: "short",
    day: "numeric",
  });
}
