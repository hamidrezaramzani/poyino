import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { isPlatformAdmin, type PlatformRole } from "@poyino/contracts";
import type { Request } from "express";
import { PLATFORM_ADMIN_KEY } from "../decorators/require-platform-admin.decorator";
import type { AuthenticatedUser } from "../types/authenticated-user";

type RequestWithUser = Request & { user?: AuthenticatedUser };

@Injectable()
export class PlatformAdminGuard implements CanActivate {
  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<boolean | undefined>(
      PLATFORM_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !isPlatformAdmin(user.platformRole as PlatformRole)) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Platform admin access is required.",
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
