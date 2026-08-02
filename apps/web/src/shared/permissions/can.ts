import {
  hasPermission,
  type OrganizationRole,
  type Permission,
} from "@poyino/contracts";
import { useSession } from "../session/session-provider";

export function can(
  role: OrganizationRole | null | undefined,
  permission: Permission,
): boolean {
  if (!role) {
    return false;
  }
  return hasPermission(role, permission);
}

export function useCan(permission: Permission): boolean {
  const { user } = useSession();
  return can(user?.role, permission);
}

export function usePermissions() {
  const { user } = useSession();
  const role = user?.role;

  return {
    role,
    can: (permission: Permission) => can(role, permission),
  };
}
