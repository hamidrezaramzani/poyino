import type {
  CreateJobInput,
  CreateJobSuccess,
  GenerateJobContentInput,
  GenerateJobContentSuccess,
  JobDetailsSuccess,
  JobTemplatesSuccess,
  ListJobsQuery,
  ListJobsSuccess,
  UpdateJobInput,
  UpdateJobSuccess,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

export { ApiRequestError } from "../../../shared/api/api-client";

export async function createJob(input: CreateJobInput) {
  return apiRequest<CreateJobSuccess>("/jobs", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchJobs(query: ListJobsQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return apiRequest<ListJobsSuccess>(`/jobs?${params.toString()}`);
}

export async function fetchJob(jobId: string) {
  return apiRequest<JobDetailsSuccess>(`/jobs/${jobId}`);
}

export async function updateJob(jobId: string, input: UpdateJobInput) {
  return apiRequest<UpdateJobSuccess>(`/jobs/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function generateJobContent(input: GenerateJobContentInput) {
  return apiRequest<GenerateJobContentSuccess>("/jobs/generate", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchJobTemplates() {
  return apiRequest<JobTemplatesSuccess>("/jobs/templates");
}
