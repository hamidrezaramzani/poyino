import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  LoginSchema,
  RegisterSchema,
  type LoginInput,
  type RegisterInput,
} from "@poyino/contracts";
import type { Request, Response } from "express";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  SESSION_COOKIE_NAME,
  SESSION_EXPIRATION_MS,
} from "../authentication.constants";
import { AuthenticationService } from "../services/authentication.service";

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
}

function resolveClientIp(request: Request) {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.ip || request.socket.remoteAddress || "unknown";
}
