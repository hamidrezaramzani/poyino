import { HttpException, HttpStatus } from "@nestjs/common";
import { isOrgWideRole, type OrganizationRole } from "@poyino/contracts";
import type { AuthenticatedUser } from "../types/authenticated-user";

export function departmentScopeFilter(user: AuthenticatedUser): {
  departmentId?: string;
} {
  if (isOrgWideRole(user.role as OrganizationRole)) {
    return {};
  }
  return { departmentId: user.departmentId };
}

export function assertDepartmentAccess(
  user: AuthenticatedUser,
  resourceDepartmentId: string | null | undefined,
) {
  if (isOrgWideRole(user.role as OrganizationRole)) {
    return;
  }

  if (!resourceDepartmentId || resourceDepartmentId !== user.departmentId) {
    throw new HttpException(
      {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
        },
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
