import type {
  CreateMemberInput,
  CreateMemberSuccess,
  ListMembersSuccess,
  OrganizationMember,
  UpdateMemberInput,
  UpdateMemberSuccess,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

export async function listMembers(): Promise<OrganizationMember[]> {
  const response = await apiRequest<ListMembersSuccess>("/organization/members");
  return response.members;
}

export async function createMember(
  input: CreateMemberInput,
): Promise<OrganizationMember> {
  const response = await apiRequest<CreateMemberSuccess>(
    "/organization/members",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return response.member;
}

export async function updateMember(
  memberId: string,
  input: UpdateMemberInput,
): Promise<OrganizationMember> {
  const response = await apiRequest<UpdateMemberSuccess>(
    `/organization/members/${memberId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
  return response.member;
}
