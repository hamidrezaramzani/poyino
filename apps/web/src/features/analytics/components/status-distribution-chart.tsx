import type { DashboardCandidateStatus } from "@poyino/contracts";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useI18n } from "../../../shared/i18n/i18n-provider";

const STATUS_ORDER: DashboardCandidateStatus[] = [
  "APPLIED",
  "REVIEWING",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_PASSED",
  "HIRED",
  "REJECTED",
];

const STATUS_COLORS: Record<DashboardCandidateStatus, string> = {
  APPLIED: "#93a0b0",
  REVIEWING: "#e8c07a",
  INTERVIEW_SCHEDULED: "#8ea2ff",
  INTERVIEW_PASSED: "#78c0e0",
  HIRED: "#7dcea0",
  REJECTED: "#f2a3a0",
};

type StatusDistributionEntry = {
  status: DashboardCandidateStatus;
  count: number;
};

type StatusDistributionChartProps = {
  data: StatusDistributionEntry[];
};

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const { t, direction } = useI18n();
  const total = data.reduce((sum, entry) => sum + entry.count, 0);

  const ordered = STATUS_ORDER.map((status) => {
    const match = data.find((entry) => entry.status === status);
    return match ?? { status, count: 0 };
  }).filter((entry) => entry.count > 0);

  const rows = (ordered.length > 0 ? ordered : data).map((entry) => ({
    ...entry,
    percentage: total > 0 ? (entry.count / total) * 100 : 0,
    label: t.dashboard.candidateStatus[entry.status],
    color: STATUS_COLORS[entry.status],
  }));

  return (
    <div className="analytics-status-distribution">
      <div className="analytics-status-donut" aria-hidden={rows.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rows}
              dataKey="count"
              nameKey="label"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={rows.length > 1 ? 3 : 0}
              stroke="none"
              isAnimationActive={false}
            >
              {rows.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, String(name)]}
              contentStyle={{
                backgroundColor: "var(--ui-surface)",
                border: "1px solid var(--ui-border)",
                borderRadius: "0.5rem",
                color: "var(--ui-text)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="analytics-status-donut-center" dir={direction}>
          <strong>{total}</strong>
          <span>{t.analytics.kpis.totalCandidates}</span>
        </div>
      </div>

      <ul className="analytics-status-legend" aria-label={t.analytics.charts.statusDistributionTitle}>
        {rows.map((entry) => (
          <li key={entry.status} className="analytics-status-legend-row">
            <span
              className="analytics-status-swatch"
              style={{ backgroundColor: entry.color }}
              aria-hidden
            />
            <div className="analytics-status-legend-copy">
              <div className="analytics-status-legend-top">
                <span className="analytics-status-legend-label">{entry.label}</span>
                <span className="analytics-status-legend-meta">
                  <strong>{entry.count}</strong>
                  <span>{entry.percentage.toFixed(0)}%</span>
                </span>
              </div>
              <div
                className="analytics-status-legend-track"
                role="presentation"
              >
                <div
                  className="analytics-status-legend-fill"
                  style={{
                    width: `${Math.max(entry.percentage > 0 ? 4 : 0, entry.percentage)}%`,
                    backgroundColor: entry.color,
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
