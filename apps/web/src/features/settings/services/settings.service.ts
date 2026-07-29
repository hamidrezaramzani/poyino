import type {
  BrandingSettingsInput,
  BrandingSettingsSuccess,
  ChangePasswordInput,
  ChangePasswordSuccess,
  GeneralSettingsInput,
  GeneralSettingsSuccess,
  NotificationSettingsInput,
  NotificationSettingsSuccess,
  ProfileSettingsInput,
  ProfileSettingsSuccess,
  UploadFileSuccess,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

export async function fetchGeneralSettings() {
  return apiRequest<GeneralSettingsSuccess>("/settings/general");
}

export async function updateGeneralSettings(input: GeneralSettingsInput) {
  return apiRequest<GeneralSettingsSuccess>("/settings/general", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function fetchProfileSettings() {
  return apiRequest<ProfileSettingsSuccess>("/settings/profile");
}

export async function updateProfileSettings(input: ProfileSettingsInput) {
  return apiRequest<ProfileSettingsSuccess>("/settings/profile", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function fetchBrandingSettings() {
  return apiRequest<BrandingSettingsSuccess>("/settings/branding");
}

export async function updateBrandingSettings(input: BrandingSettingsInput) {
  return apiRequest<BrandingSettingsSuccess>("/settings/branding", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function fetchNotificationSettings() {
  return apiRequest<NotificationSettingsSuccess>("/settings/notifications");
}

export async function updateNotificationSettings(
  input: NotificationSettingsInput,
) {
  return apiRequest<NotificationSettingsSuccess>("/settings/notifications", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function changePassword(input: ChangePasswordInput) {
  return apiRequest<ChangePasswordSuccess>("/settings/change-password", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function uploadSettingsFile(file: File) {
  const contentBase64 = await readFileAsBase64(file);
  const mimeType =
    file.type === "image/jpg" ? "image/jpeg" : (file.type as UploadMime);

  return apiRequest<UploadFileSuccess>("/settings/files", {
    method: "POST",
    body: JSON.stringify({
      fileName: file.name,
      mimeType,
      contentBase64,
    }),
  });
}

export async function resolveAuthenticatedImageUrl(
  path: string | null | undefined,
): Promise<string | null> {
  if (!path) {
    return null;
  }

  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    return null;
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

type UploadMime = "image/png" | "image/jpeg" | "image/svg+xml";

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unable to read file"));
        return;
      }
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export { ApiRequestError } from "../../../shared/api/api-client";
