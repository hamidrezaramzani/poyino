import type { DashboardStatistics } from "@poyino/contracts";
import { Skeleton, StatisticCard, Tooltip } from "@poyino/ui";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import {
  BadgeCheckIcon,
  BriefcaseIcon,
  RocketIcon,
  UsersIcon,
} from "./dashboard-icons";

type StatisticsSectionProps = {
  statistics: DashboardStatistics | null;
  loading: boolean;
  error?: boolean;
};

export function StatisticsSection({
  statistics,
  loading,
  error = false,
}: StatisticsSectionProps) {
  const { t } = useI18n();
  const navigate = useNavigate();

  const cards = [
    {
      key: "totalJobs",
      label: t.dashboard.statistics.totalJobs,
      description: t.dashboard.statistics.totalJobsDescription,
      value: statistics?.totalJobs ?? 0,
      href: "/jobs",
      icon: <BriefcaseIcon />,
    },
    {
      key: "activeJobs",
      label: t.dashboard.statistics.activeJobs,
      description: t.dashboard.statistics.activeJobsDescription,
      value: statistics?.activeJobs ?? 0,
      href: "/jobs?status=PUBLISHED",
      icon: <RocketIcon />,
    },
    {
      key: "totalCandidates",
      label: t.dashboard.statistics.totalCandidates,
      description: t.dashboard.statistics.totalCandidatesDescription,
      value: statistics?.totalCandidates ?? 0,
      href: "/candidates",
      icon: <UsersIcon />,
    },
    {
      key: "totalHired",
      label: t.dashboard.statistics.totalHired,
      description: t.dashboard.statistics.totalHiredDescription,
      value: statistics?.totalHired ?? 0,
      href: "/candidates?status=HIRED",
      icon: <BadgeCheckIcon />,
    },
  ] as const;

  return (
    <section aria-label={t.dashboard.statistics.title}>
      <h2 className="dashboard-section-title">{t.dashboard.statistics.title}</h2>
      <div className="dashboard-stats-grid">
        {cards.map((card) =>
          loading ? (
            <div key={card.key} className="dashboard-stat-skeleton">
              <Skeleton height="1rem" width="40%" />
              <Skeleton
                height="2rem"
                width="30%"
                style={{ marginTop: "0.75rem" }}
              />
              <Skeleton
                height="0.75rem"
                width="70%"
                style={{ marginTop: "0.55rem" }}
              />
            </div>
          ) : error ? (
            <Tooltip
              key={card.key}
              content={t.dashboard.statistics.loadError}
              style={{ width: "100%", display: "block" }}
            >
              <StatisticCard
                label={card.label}
                description={card.description}
                value={0}
                error
                errorTooltip={t.dashboard.statistics.loadError}
                icon={card.icon}
              />
            </Tooltip>
          ) : (
            <StatisticCard
              key={card.key}
              label={card.label}
              description={card.description}
              value={card.value}
              icon={card.icon}
              href={card.href}
              onNavigate={() => navigate(card.href)}
            />
          ),
        )}
      </div>
    </section>
  );
}
