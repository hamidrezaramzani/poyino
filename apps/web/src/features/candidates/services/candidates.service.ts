import type {
  CandidateNoteSuccess,
  CompleteInterviewInput,
  CreateCandidateNoteInput,
  CreateInterviewInput,
  DeleteCandidateNoteSuccess,
  GetCandidateProfileSuccess,
  InterviewProcessSuccess,
  InterviewSuccess,
  ListCandidatesQuery,
  ListCandidatesSuccess,
  ListOrgCandidatesQuery,
  ListOrgCandidatesSuccess,
  UpdateCandidateNoteInput,
  UpdateCandidateStatusInput,
  UpdateCandidateStatusSuccess,
  UpdateInterviewInput,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

export { ApiRequestError } from "../../../shared/api/api-client";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

export async function fetchCandidates(
  jobId: string,
  query: ListCandidatesQuery,
) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.experienceLevel) params.set("experienceLevel", query.experienceLevel);
  if (query.education) params.set("education", query.education);
  if (query.dateRange) params.set("dateRange", query.dateRange);
  if (query.dateFrom) params.set("dateFrom", query.dateFrom);
  if (query.dateTo) params.set("dateTo", query.dateTo);
  params.set("sortBy", query.sortBy);
  params.set("sortOrder", query.sortOrder);
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));

  return apiRequest<ListCandidatesSuccess>(
    `/jobs/${jobId}/candidates?${params.toString()}`,
  );
}

export async function fetchCandidateProfile(
  jobId: string,
  candidateId: string,
) {
  return apiRequest<GetCandidateProfileSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}`,
  );
}

export function getResumeDownloadUrl(jobId: string, candidateId: string) {
  return `${API_BASE_URL}/jobs/${jobId}/candidates/${candidateId}/resume`;
}

export async function updateCandidateStatus(
  jobId: string,
  candidateId: string,
  input: UpdateCandidateStatusInput,
) {
  return apiRequest<UpdateCandidateStatusSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function createCandidateNote(
  jobId: string,
  candidateId: string,
  input: CreateCandidateNoteInput,
) {
  return apiRequest<CandidateNoteSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/notes`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateCandidateNote(
  jobId: string,
  candidateId: string,
  noteId: string,
  input: UpdateCandidateNoteInput,
) {
  return apiRequest<CandidateNoteSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/notes/${noteId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteCandidateNote(
  jobId: string,
  candidateId: string,
  noteId: string,
) {
  return apiRequest<DeleteCandidateNoteSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/notes/${noteId}`,
    { method: "DELETE" },
  );
}

export async function fetchInterviews(jobId: string, candidateId: string) {
  return apiRequest<InterviewProcessSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interviews`,
  );
}

export async function createInterview(
  jobId: string,
  candidateId: string,
  input: CreateInterviewInput,
) {
  return apiRequest<InterviewSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interviews`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateInterview(
  jobId: string,
  candidateId: string,
  interviewId: string,
  input: UpdateInterviewInput,
) {
  return apiRequest<InterviewSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interviews/${interviewId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function cancelInterview(
  jobId: string,
  candidateId: string,
  interviewId: string,
) {
  return apiRequest<InterviewSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interviews/${interviewId}/cancel`,
    { method: "PATCH" },
  );
}

export async function completeInterview(
  jobId: string,
  candidateId: string,
  interviewId: string,
  input: CompleteInterviewInput,
) {
  return apiRequest<InterviewSuccess>(
    `/jobs/${jobId}/candidates/${candidateId}/interviews/${interviewId}/complete`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function fetchOrgCandidates(query: ListOrgCandidatesQuery) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  params.set("sortBy", query.sortBy);
  params.set("sortOrder", query.sortOrder);
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));

  return apiRequest<ListOrgCandidatesSuccess>(`/candidates?${params.toString()}`);
}
