import { DashboardErrorState } from "../components/dashboard-error-state";
import { RecentCandidatesTable } from "../components/recent-candidates-table";
import { RecentJobsTable } from "../components/recent-jobs-table";
import { StatisticsSection } from "../components/statistics-section";
import { useDashboardOverview } from "../hooks/use-dashboard-overview";

export function DashboardOverviewPage() {
  const { status, data, error, retry } = useDashboardOverview();
  const loading = status === "loading";

  if (status === "error") {
    return <DashboardErrorState message={error ?? undefined} onRetry={retry} />;
  }

  return (
    <div className="dashboard-overview">
      <StatisticsSection
        statistics={data?.statistics ?? null}
        loading={loading}
      />
      <RecentJobsTable jobs={data?.recentJobs ?? []} loading={loading} />
      <RecentCandidatesTable
        candidates={data?.recentCandidates ?? []}
        loading={loading}
      />
    </div>
  );
}
