import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  hasPermission,
  type OrganizationRole,
  type Permission,
} from "@poyino/contracts";
import type { Request } from "express";
import { PERMISSIONS_KEY } from "../decorators/require-permission.decorator";
import type { AuthenticatedUser } from "../types/authenticated-user";

type RequestWithUser = Request & { user?: AuthenticatedUser };

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Permission[] | undefined>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw forbiddenException();
    }

    const role = user.role as OrganizationRole;
    const allowed = required.some((permission) =>
      hasPermission(role, permission),
    );

    if (!allowed) {
      throw forbiddenException();
    }

    return true;
  }
}

function forbiddenException() {
  return new HttpException(
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
