import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UsePipes,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { RegisterInput } from "@poyino/contracts";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
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
  @UsePipes(ZodValidationPipe)
  register(@Body() body: RegisterInput) {
    return this.authenticationService.register(body);
  }
}
