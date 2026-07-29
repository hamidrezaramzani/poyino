import type { SessionMeSuccess, SessionUser } from "@poyino/contracts";
import { apiRequest } from "../api/api-client";

export async function fetchSessionMe() {
  return apiRequest<SessionMeSuccess>("/auth/me");
}

export type { SessionUser };
