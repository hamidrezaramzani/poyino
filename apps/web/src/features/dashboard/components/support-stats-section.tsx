import type {
  DashboardPlatformSupportStats,
  DashboardSupportStats,
} from "@poyino/contracts";
import { Skeleton, StatisticCard } from "@poyino/ui";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useIsPlatformAdmin } from "../../../shared/permissions/use-platform-admin";

type SupportStatsSectionProps = {
  support: DashboardSupportStats | null | undefined;
  platformSupport: DashboardPlatformSupportStats | null | undefined;
  loading: boolean;
};

export function SupportStatsSection({
  support,
  platformSupport,
  loading,
}: SupportStatsSectionProps) {
  const { t } = useI18n();
  const isPlatformAdmin = useIsPlatformAdmin();

  if (isPlatformAdmin && (platformSupport || loading)) {
    return (
      <section className="support-stats-section">
        <div className="support-stats-header">
          <h2>{t.support.platformWidgetTitle}</h2>
          <Link to="/admin/support">{t.support.viewTickets}</Link>
        </div>
        <div className="dashboard-statistics-grid">
          {loading ? (
            <>
              <Skeleton height="6rem" />
              <Skeleton height="6rem" />
              <Skeleton height="6rem" />
              <Skeleton height="6rem" />
            </>
          ) : (
            <>
              <StatisticCard
                label={t.support.stats.openTickets}
                value={String(platformSupport?.openTickets ?? 0)}
              />
              <StatisticCard
                label={t.support.stats.waitingForReply}
                value={String(platformSupport?.waitingForReply ?? 0)}
              />
              <StatisticCard
                label={t.support.stats.resolvedToday}
                value={String(platformSupport?.resolvedToday ?? 0)}
              />
              <StatisticCard
                label={t.support.stats.avgResponse}
                value={
                  platformSupport?.averageResponseTimeMinutes == null
                    ? "—"
                    : `${platformSupport.averageResponseTimeMinutes} ${t.support.stats.minutes}`
                }
              />
            </>
          )}
        </div>
      </section>
    );
  }

  if (!support && !loading) {
    return null;
  }

  return (
    <section className="support-stats-section">
      <div className="support-stats-header">
        <h2>{t.support.orgWidgetTitle}</h2>
        <Link to="/dashboard/support">{t.support.viewTickets}</Link>
      </div>
      <div className="dashboard-statistics-grid">
        {loading ? (
          <>
            <Skeleton height="6rem" />
            <Skeleton height="6rem" />
            <Skeleton height="6rem" />
          </>
        ) : (
          <>
            <StatisticCard
              label={t.support.stats.openTickets}
              value={String(support?.openTickets ?? 0)}
            />
            <StatisticCard
              label={t.support.stats.resolvedTickets}
              value={String(support?.resolvedTickets ?? 0)}
            />
            <StatisticCard
              label={t.support.stats.latestReply}
              value={
                support?.latestReplyAt
                  ? new Date(support.latestReplyAt).toLocaleString()
                  : "—"
              }
            />
          </>
        )}
      </div>
    </section>
  );
}
