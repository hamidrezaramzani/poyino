import type {
  CalendarInterviewsQuery,
  CalendarInterviewsSuccess,
  CompleteInterviewInput,
  CreateInterviewInput,
  InterviewAiRequest,
  InterviewAiSuccess,
  InterviewHiringDecisionInput,
  InterviewProcessSuccess,
  InterviewSuccess,
  InterviewStatus,
  InterviewSummarySuccess,
  UpdateInterviewInput,
  UpdateInterviewStatusInput,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

export type RecruiterOption = { id: string; email: string };

export async function fetchInterviewProcess(jobId: string, candidateId: string) {
  return apiRequest<InterviewProcessSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interviews`,
  );
}

export async function createInterviewStage(
  jobId: string,
  candidateId: string,
  input: CreateInterviewInput,
) {
  return apiRequest<InterviewSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interviews`,
    { method: "POST", body: JSON.stringify(input) },
  );
}

export async function updateInterviewStage(
  jobId: string,
  candidateId: string,
  interviewId: string,
  input: UpdateInterviewInput,
) {
  return apiRequest<InterviewSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interviews/${interviewId}`,
    { method: "PATCH", body: JSON.stringify(input) },
  );
}

export async function cancelInterviewStage(
  jobId: string,
  candidateId: string,
  interviewId: string,
) {
  return apiRequest<InterviewSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interviews/${interviewId}/cancel`,
    { method: "PATCH" },
  );
}

export async function completeInterviewStage(
  jobId: string,
  candidateId: string,
  interviewId: string,
  input: CompleteInterviewInput,
) {
  return apiRequest<InterviewSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interviews/${interviewId}/complete`,
    { method: "PATCH", body: JSON.stringify(input) },
  );
}

export async function submitHiringDecision(
  jobId: string,
  candidateId: string,
  input: InterviewHiringDecisionInput,
) {
  return apiRequest<InterviewProcessSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interviews/decision`,
    { method: "POST", body: JSON.stringify(input) },
  );
}

export async function generateInterviewAi(
  jobId: string,
  candidateId: string,
  input: InterviewAiRequest,
) {
  return apiRequest<InterviewAiSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interview-ai`,
    { method: "POST", body: JSON.stringify(input) },
  );
}

export async function generateInterviewSummary(
  jobId: string,
  candidateId: string,
) {
  return apiRequest<InterviewSummarySuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interview-summary`,
    { method: "POST", body: JSON.stringify({}) },
  );
}

export async function fetchCalendarInterviews(query: CalendarInterviewsQuery) {
  const params = new URLSearchParams();
  params.set("from", query.from);
  params.set("to", query.to);
  if (query.recruiterUserId) params.set("recruiterUserId", query.recruiterUserId);
  if (query.jobId) params.set("jobId", query.jobId);
  if (query.type) params.set("type", query.type);
  if (query.status) params.set("status", query.status);
  return apiRequest<CalendarInterviewsSuccess>(
    `/interviews/calendar?${params.toString()}`,
  );
}

export async function updateInterviewStatus(
  interviewId: string,
  input: UpdateInterviewStatusInput,
) {
  return apiRequest<InterviewSuccess>(`/interviews/${interviewId}/status`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function fetchInterviewRecruiters() {
  return apiRequest<{ success: true; recruiters: RecruiterOption[] }>(
    `/interviews/recruiters`,
  );
}

export function defaultStageName(type: string): string {
  const map: Record<string, string> = {
    HR: "HR Interview",
    TECHNICAL: "Technical Interview",
    TEAM_LEAD: "Team Lead Interview",
    MANAGER: "Manager Interview",
    FINAL: "Final Interview",
    CUSTOM: "Custom Interview",
  };
  return map[type] ?? "Interview";
}

export type { InterviewStatus };
