import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  ListNotificationsQuerySchema,
  type ListNotificationsQuery,
} from "@poyino/contracts";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { NotificationsService } from "../services/notifications.service";

@Controller("notifications")
@UseGuards(SessionAuthGuard)
export class NotificationsController {
  constructor(
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(ListNotificationsQuerySchema))
    query: ListNotificationsQuery,
  ) {
    return this.notificationsService.list(user, query);
  }

  @Get("unread-count")
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  unreadCount(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.unreadCount(user);
  }

  @Patch("read-all")
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  markAllRead(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.markAllRead(user);
  }

  @Patch(":notificationId/read")
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  markRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param("notificationId", ParseUUIDPipe) notificationId: string,
  ) {
    return this.notificationsService.markRead(user, notificationId);
  }

  @Delete(":notificationId")
  @Throttle({ default: { limit: 40, ttl: 60_000 } })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param("notificationId", ParseUUIDPipe) notificationId: string,
  ) {
    return this.notificationsService.remove(user, notificationId);
  }
}
