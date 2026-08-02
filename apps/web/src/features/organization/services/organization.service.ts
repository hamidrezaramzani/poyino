import type {
  CreateDepartmentInput,
  CreateDepartmentSuccess,
  DepartmentSummary,
  ListDepartmentsSuccess,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

export async function listDepartments(): Promise<DepartmentSummary[]> {
  const response = await apiRequest<ListDepartmentsSuccess>(
    "/organization/departments",
  );
  return response.departments;
}

export async function createDepartment(
  input: CreateDepartmentInput,
): Promise<DepartmentSummary> {
  const response = await apiRequest<CreateDepartmentSuccess>(
    "/organization/departments",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return response.department;
}
