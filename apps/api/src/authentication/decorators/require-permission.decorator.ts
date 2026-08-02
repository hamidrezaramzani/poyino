import { SetMetadata } from "@nestjs/common";
import type { Permission } from "@poyino/contracts";

export const PERMISSIONS_KEY = "permissions";

export const RequirePermission = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
