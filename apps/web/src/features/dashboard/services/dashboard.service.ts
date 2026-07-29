import type { DashboardSuccess } from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

export async function fetchDashboardOverview() {
  return apiRequest<DashboardSuccess>("/dashboard");
}
