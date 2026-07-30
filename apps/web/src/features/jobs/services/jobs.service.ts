import type {
  CreateJobInput,
  CreateJobSuccess,
  GenerateJobContentInput,
  GenerateJobContentSuccess,
  JobTemplatesSuccess,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

export { ApiRequestError } from "../../../shared/api/api-client";

export async function createJob(input: CreateJobInput) {
  return apiRequest<CreateJobSuccess>("/jobs", {
    method: "POST",
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
