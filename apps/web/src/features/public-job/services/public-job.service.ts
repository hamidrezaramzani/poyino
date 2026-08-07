import type {
  AnalyzeResumeInput,
  AnalyzeResumeSoftFailure,
  AnalyzeResumeSuccess,
  PublicJobSuccess,
  SubmitApplicationInput,
  SubmitApplicationSuccess,
  TrackingSuccess,
  UploadResumeInput,
  UploadResumeSuccess,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

export function resolvePublicAssetUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getPublicJob(orgSlug: string, jobId: string) {
  return apiRequest<PublicJobSuccess>(
    `/public/${encodeURIComponent(orgSlug)}/jobs/${jobId}`,
  );
}

export function uploadResume(
  orgSlug: string,
  jobId: string,
  input: UploadResumeInput,
) {
  return apiRequest<UploadResumeSuccess>(
    `/public/${encodeURIComponent(orgSlug)}/jobs/${jobId}/upload`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function analyzeResume(
  orgSlug: string,
  jobId: string,
  input: AnalyzeResumeInput,
) {
  return apiRequest<AnalyzeResumeSuccess | AnalyzeResumeSoftFailure>(
    `/public/${encodeURIComponent(orgSlug)}/jobs/${jobId}/analyze`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function submitApplication(
  orgSlug: string,
  jobId: string,
  input: SubmitApplicationInput,
) {
  return apiRequest<SubmitApplicationSuccess>(
    `/public/${encodeURIComponent(orgSlug)}/jobs/${jobId}/apply`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function getTracking(token: string) {
  return apiRequest<TrackingSuccess>(
    `/public/tracking/${encodeURIComponent(token)}`,
  );
}

export function acceptInterview(token: string, interviewId: string) {
  return apiRequest<{ success: true; interview: import("@poyino/contracts").PublicInterview }>(
    `/public/tracking/${encodeURIComponent(token)}/interviews/${interviewId}/accept`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
}

export function requestInterviewReschedule(
  token: string,
  interviewId: string,
  input: {
    message?: string | null;
    proposedScheduledAt?: string | null;
  },
) {
  return apiRequest<{ success: true; interview: import("@poyino/contracts").PublicInterview }>(
    `/public/tracking/${encodeURIComponent(token)}/interviews/${interviewId}/reschedule`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function declineInterview(
  token: string,
  interviewId: string,
  input: { message?: string | null },
) {
  return apiRequest<{ success: true; interview: import("@poyino/contracts").PublicInterview }>(
    `/public/tracking/${encodeURIComponent(token)}/interviews/${interviewId}/decline`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unable to read file."));
        return;
      }
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}
