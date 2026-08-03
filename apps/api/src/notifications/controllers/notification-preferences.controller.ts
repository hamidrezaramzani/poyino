import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  UpdateNotificationPreferencesSchema,
  type UpdateNotificationPreferencesInput,
} from "@poyino/contracts";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { NotificationPreferencesService } from "../services/notification-preferences.service";

@Controller("notification-preferences")
@UseGuards(SessionAuthGuard)
export class NotificationPreferencesController {
  constructor(
    @Inject(NotificationPreferencesService)
    private readonly notificationPreferencesService: NotificationPreferencesService,
  ) {}

  @Get()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  get(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationPreferencesService.get(user);
  }

  @Patch()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UpdateNotificationPreferencesSchema))
    body: UpdateNotificationPreferencesInput,
  ) {
    return this.notificationPreferencesService.update(user, body);
  }

  @Post("reset")
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  reset(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationPreferencesService.reset(user);
  }
}
