import type {
  GetAiCreditBreakdownSuccess,
  GetAiCreditHistoryQuery,
  GetAiCreditHistorySuccess,
  GetAiCreditsSuccess,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

export function fetchAiCredits() {
  return apiRequest<GetAiCreditsSuccess>("/credits");
}

export function fetchAiCreditHistory(query?: Partial<GetAiCreditHistoryQuery>) {
  const params = new URLSearchParams();
  if (query?.page) {
    params.set("page", String(query.page));
  }
  if (query?.pageSize) {
    params.set("pageSize", String(query.pageSize));
  }
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<GetAiCreditHistorySuccess>(`/credits/history${suffix}`);
}

export function fetchAiCreditBreakdown() {
  return apiRequest<GetAiCreditBreakdownSuccess>("/credits/breakdown");
}
