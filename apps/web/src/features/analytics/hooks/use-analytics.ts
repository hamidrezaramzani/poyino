import type {
  AnalyticsDashboard,
  AnalyticsDateRange,
  DashboardCandidateStatus,
  FunnelStage,
  JobPerformanceItem,
  TrendPoint,
} from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  ApiRequestError,
  fetchAnalyticsDashboard,
  fetchAnalyticsFunnel,
  fetchAnalyticsJobs,
  fetchAnalyticsTrends,
} from "../services/analytics.service";

export function useAnalytics() {
  const { t } = useI18n();
  const { push } = useToast();

  const [range, setRange] = useState<AnalyticsDateRange>("LAST_30_DAYS");
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const [statusDistribution, setStatusDistribution] = useState<
    Array<{ status: DashboardCandidateStatus; count: number }>
  >([]);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [jobs, setJobs] = useState<JobPerformanceItem[]>([]);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const query = { range };
      const [dashboardResponse, funnelResponse, jobsResponse, trendsResponse] =
        await Promise.all([
          fetchAnalyticsDashboard(query),
          fetchAnalyticsFunnel(query),
          fetchAnalyticsJobs(query),
          fetchAnalyticsTrends(query),
        ]);
      setDashboard(dashboardResponse.dashboard);
      setStatusDistribution(dashboardResponse.statusDistribution);
      setFunnel(funnelResponse.funnel);
      setJobs(jobsResponse.jobs);
      setTrends(trendsResponse.trends);
      setStatus("success");
    } catch (error) {
      setDashboard(null);
      setStatusDistribution([]);
      setFunnel([]);
      setJobs([]);
      setTrends([]);
      setStatus("error");
      push(
        error instanceof ApiRequestError
          ? error.message || t.analytics.loadFailed
          : t.analytics.loadFailed,
        "error",
      );
    }
  }, [push, range, t.analytics.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const changeRange = useCallback((nextRange: AnalyticsDateRange) => {
    setRange(nextRange);
  }, []);

  return {
    range,
    dashboard,
    statusDistribution,
    funnel,
    jobs,
    trends,
    status,
    changeRange,
    retry: load,
  };
}
