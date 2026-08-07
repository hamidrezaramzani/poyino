import type {
  BetaFeedbackAnalyticsSuccess,
  BetaFeedbackEligibilitySuccess,
  GetBetaFeedbackSuccess,
  ListBetaFeedbackQuery,
  ListBetaFeedbackSuccess,
  SubmitBetaFeedbackInput,
  SubmitBetaFeedbackSuccess,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

function toQuery(params?: Partial<ListBetaFeedbackQuery>) {
  const search = new URLSearchParams();
  if (!params) return "";
  if (params.search) search.set("search", params.search);
  if (params.surveyKey) search.set("surveyKey", params.surveyKey);
  if (params.surveyVersion) search.set("surveyVersion", params.surveyVersion);
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  const value = search.toString();
  return value ? `?${value}` : "";
}

export function getFeedbackEligibility() {
  return apiRequest<BetaFeedbackEligibilitySuccess>("/feedback/eligibility");
}

export function getOrgFeedbackSubmission() {
  return apiRequest<GetBetaFeedbackSuccess>("/feedback/me");
}

export function submitBetaFeedback(input: SubmitBetaFeedbackInput) {
  return apiRequest<SubmitBetaFeedbackSuccess>("/feedback", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listAdminFeedback(query?: Partial<ListBetaFeedbackQuery>) {
  return apiRequest<ListBetaFeedbackSuccess>(
    `/feedback/admin/responses${toQuery(query)}`,
  );
}

export function getAdminFeedback(responseId: string) {
  return apiRequest<GetBetaFeedbackSuccess>(
    `/feedback/admin/responses/${responseId}`,
  );
}

export function getAdminFeedbackAnalytics(surveyKey?: string) {
  const query = surveyKey ? `?surveyKey=${encodeURIComponent(surveyKey)}` : "";
  return apiRequest<BetaFeedbackAnalyticsSuccess>(
    `/feedback/admin/analytics${query}`,
  );
}
