import { z } from "zod";

export const OrganizationRoleSchema = z.enum([
  "OWNER",
  "ADMINISTRATOR",
  "RECRUITER",
  "HIRING_MANAGER",
  "INTERVIEWER",
  "VIEWER",
]);

export type OrganizationRole = z.infer<typeof OrganizationRoleSchema>;

export const OrganizationRole = OrganizationRoleSchema.enum;

export const PermissionSchema = z.enum([
  "organization:view",
  "organization:manage",
  "departments:view",
  "departments:create",
  "departments:update",
  "departments:archive",
  "members:view",
  "members:invite",
  "members:suspend",
  "jobs:view",
  "jobs:create",
  "jobs:update",
  "jobs:delete",
  "jobs:publish",
  "candidates:view",
  "candidates:update",
  "candidates:bookmark",
  "candidates:export",
  "interviews:view",
  "interviews:schedule",
  "interviews:complete",
  "interviews:notes",
  "hiring:view",
  "hiring:decide",
  "hiring:offer",
  "ai:generate",
  "ai:view",
  "credits:view",
  "credits:manage",
  "support:view",
  "support:create",
  "support:reply",
  "support:manage",
  "feedback:submit",
  "feedback:view",
  "dashboard:view",
  "reports:view",
]);

export type Permission = z.infer<typeof PermissionSchema>;

export const Permission = PermissionSchema.enum;

const ALL_PERMISSIONS = PermissionSchema.options;

const ROLE_PERMISSIONS: Record<OrganizationRole, readonly Permission[]> = {
  OWNER: ALL_PERMISSIONS,
  ADMINISTRATOR: ALL_PERMISSIONS,
  RECRUITER: [
    "departments:view",
    "jobs:view",
    "jobs:create",
    "jobs:update",
    "jobs:delete",
    "jobs:publish",
    "candidates:view",
    "candidates:update",
    "candidates:bookmark",
    "candidates:export",
    "interviews:view",
    "interviews:schedule",
    "interviews:complete",
    "interviews:notes",
    "hiring:view",
    "hiring:decide",
    "hiring:offer",
    "ai:generate",
    "ai:view",
    "credits:view",
    "support:view",
    "support:create",
    "support:reply",
    "feedback:submit",
    "feedback:view",
    "dashboard:view",
    "reports:view",
  ],
  HIRING_MANAGER: [
    "departments:view",
    "jobs:view",
    "candidates:view",
    "candidates:bookmark",
    "interviews:view",
    "interviews:complete",
    "interviews:notes",
    "hiring:view",
    "hiring:decide",
    "ai:generate",
    "ai:view",
    "credits:view",
    "support:view",
    "support:create",
    "support:reply",
    "feedback:submit",
    "feedback:view",
    "dashboard:view",
    "reports:view",
  ],
  INTERVIEWER: [
    "departments:view",
    "jobs:view",
    "candidates:view",
    "interviews:view",
    "interviews:complete",
    "interviews:notes",
    "ai:view",
    "credits:view",
    "support:view",
    "support:create",
    "support:reply",
    "feedback:view",
    "dashboard:view",
  ],
  VIEWER: [
    "departments:view",
    "jobs:view",
    "candidates:view",
    "interviews:view",
    "ai:view",
    "credits:view",
    "support:view",
    "support:create",
    "support:reply",
    "feedback:view",
    "dashboard:view",
    "reports:view",
  ],
};

export function hasPermission(
  role: OrganizationRole,
  permission: Permission,
): boolean {
  if (role === "OWNER") {
    return true;
  }
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function isOrgWideRole(role: OrganizationRole): boolean {
  return role === "OWNER" || role === "ADMINISTRATOR";
}

export function listPermissionsForRole(
  role: OrganizationRole,
): readonly Permission[] {
  if (role === "OWNER") {
    return ALL_PERMISSIONS;
  }
  return ROLE_PERMISSIONS[role];
}
