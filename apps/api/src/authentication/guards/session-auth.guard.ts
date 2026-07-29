import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { SessionErrorCode } from "@poyino/contracts";
import type { Request } from "express";
import { SESSION_COOKIE_NAME } from "../authentication.constants";
import { AuthenticationService } from "../services/authentication.service";
import type { AuthenticatedUser } from "../types/authenticated-user";

type RequestWithUser = Request & { user?: AuthenticatedUser };

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const sessionToken = readCookie(request, SESSION_COOKIE_NAME);

    if (!sessionToken) {
      throw unauthorizedException();
    }

    const user =
      await this.authenticationService.resolveSessionUser(sessionToken);

    if (!user) {
      throw unauthorizedException();
    }

    request.user = user;
    return true;
  }
}

function readCookie(request: Request, name: string) {
  const header = request.headers.cookie;
  if (!header) {
    return undefined;
  }

  for (const part of header.split(";")) {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (rawKey === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return undefined;
}

function unauthorizedException() {
  return new HttpException(
    {
      success: false,
      error: {
        code: SessionErrorCode.UNAUTHORIZED,
        message: "احراز هویت لازم است. لطفاً دوباره وارد شوید.",
      },
    },
    HttpStatus.UNAUTHORIZED,
  );
}
