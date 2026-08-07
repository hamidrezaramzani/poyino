import { AiCreditsSection } from "../components/ai-credits-section";
import { DashboardErrorState } from "../components/dashboard-error-state";
import { RecentCandidatesTable } from "../components/recent-candidates-table";
import { RecentJobsTable } from "../components/recent-jobs-table";
import { StatisticsSection } from "../components/statistics-section";
import { SupportStatsSection } from "../components/support-stats-section";
import { FeedbackPromptCard } from "../../feedback/components/feedback-prompt-card";
import { useDashboardOverview } from "../hooks/use-dashboard-overview";

export function DashboardOverviewPage() {
  const { status, data, error, retry } = useDashboardOverview();
  const loading = status === "loading";

  if (status === "error") {
    return <DashboardErrorState message={error ?? undefined} onRetry={retry} />;
  }

  return (
    <div className="dashboard-overview">
      <FeedbackPromptCard />
      <StatisticsSection
        statistics={data?.statistics ?? null}
        loading={loading}
      />
      <SupportStatsSection
        support={data?.support}
        platformSupport={data?.platformSupport}
        loading={loading}
      />
      <AiCreditsSection
        aiCredits={data?.aiCredits ?? null}
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
