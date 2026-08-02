import type {
  AnalyticsDashboardSuccess,
  AnalyticsFunnelSuccess,
  AnalyticsJobsSuccess,
  AnalyticsQuery,
  AnalyticsTrendsSuccess,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

export { ApiRequestError } from "../../../shared/api/api-client";

function buildParams(query: AnalyticsQuery) {
  const params = new URLSearchParams();
  params.set("range", query.range);
  if (query.dateFrom) params.set("dateFrom", query.dateFrom);
  if (query.dateTo) params.set("dateTo", query.dateTo);
  if (query.jobId) params.set("jobId", query.jobId);
  return params;
}

export async function fetchAnalyticsDashboard(query: AnalyticsQuery) {
  return apiRequest<AnalyticsDashboardSuccess>(
    `/analytics/dashboard?${buildParams(query).toString()}`,
  );
}

export async function fetchAnalyticsFunnel(query: AnalyticsQuery) {
  return apiRequest<AnalyticsFunnelSuccess>(
    `/analytics/funnel?${buildParams(query).toString()}`,
  );
}

export async function fetchAnalyticsJobs(query: AnalyticsQuery) {
  return apiRequest<AnalyticsJobsSuccess>(
    `/analytics/jobs?${buildParams(query).toString()}`,
  );
}

export async function fetchAnalyticsTrends(query: AnalyticsQuery) {
  return apiRequest<AnalyticsTrendsSuccess>(
    `/analytics/trends?${buildParams(query).toString()}`,
  );
}
