import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
} from "@poyino/contracts";
import type { Request, Response } from "express";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  SESSION_COOKIE_NAME,
  SESSION_EXPIRATION_MS,
} from "../authentication.constants";
import { CurrentUser } from "../decorators/current-user.decorator";
import { SessionAuthGuard } from "../guards/session-auth.guard";
import { AuthenticationService } from "../services/authentication.service";
import type { AuthenticatedUser } from "../types/authenticated-user";

@Controller("auth")
export class AuthenticationController {
  constructor(
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  register(
    @Body(new ZodValidationPipe(RegisterSchema)) body: RegisterInput,
  ) {
    return this.authenticationService.register(body);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) body: LoginInput,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authenticationService.login(body, {
      ip: resolveClientIp(request),
      userAgent: request.headers["user-agent"],
    });

    response.cookie(SESSION_COOKIE_NAME, result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: result.expiresAt,
      maxAge: SESSION_EXPIRATION_MS,
      path: "/",
    });

    return { success: true as const };
  }

  @Get("me")
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  me(@CurrentUser() user: AuthenticatedUser) {
    return {
      success: true as const,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        platformRole: user.platformRole,
        departmentId: user.departmentId,
        organization: {
          id: user.organizationId,
          name: user.organizationName,
        },
      },
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sessionToken = readCookie(request, SESSION_COOKIE_NAME);
    if (sessionToken) {
      await this.authenticationService.logout(sessionToken);
    }

    response.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true as const };
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  forgotPassword(
    @Body(new ZodValidationPipe(ForgotPasswordSchema))
    body: ForgotPasswordInput,
    @Req() request: Request,
  ) {
    return this.authenticationService.forgotPassword(body, {
      ip: resolveClientIp(request),
    });
  }

  @Get("reset-password")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  validateResetToken(@Query("token") token?: string) {
    return this.authenticationService.validateResetToken(token ?? "");
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  resetPassword(
    @Body(new ZodValidationPipe(ResetPasswordSchema)) body: ResetPasswordInput,
    @Req() request: Request,
  ) {
    return this.authenticationService.resetPassword(body, {
      ip: resolveClientIp(request),
    });
  }
}

function resolveClientIp(request: Request) {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.ip || request.socket.remoteAddress || "unknown";
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
