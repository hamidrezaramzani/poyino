import { apiRequest } from "../../../shared/api/api-client";

export async function logoutUser() {
  return apiRequest<{ success: true }>("/auth/logout", {
    method: "POST",
  });
}
