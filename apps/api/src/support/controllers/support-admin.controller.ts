import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  ListSupportTicketsQuerySchema,
  ReplySupportTicketSchema,
  type ListSupportTicketsQuery,
  type ReplySupportTicketInput,
} from "@poyino/contracts";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { RequirePlatformAdmin } from "../../authentication/decorators/require-platform-admin.decorator";
import { PlatformAdminGuard } from "../../authentication/guards/platform-admin.guard";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { SupportService } from "../services/support.service";

@Controller("support/admin")
@UseGuards(SessionAuthGuard, PlatformAdminGuard)
@RequirePlatformAdmin()
export class SupportAdminController {
  constructor(
    @Inject(SupportService) private readonly supportService: SupportService,
  ) {}

  @Get("stats")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  stats() {
    return this.supportService.getAdminStats();
  }

  @Get("tickets")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  list(
    @Query(new ZodValidationPipe(ListSupportTicketsQuerySchema))
    query: ListSupportTicketsQuery,
  ) {
    return this.supportService.listAdminTickets(query);
  }

  @Get("tickets/:ticketId")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  get(@Param("ticketId", ParseUUIDPipe) ticketId: string) {
    return this.supportService.getAdminTicket(ticketId);
  }

  @Post("tickets/:ticketId/messages")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  reply(
    @CurrentUser() user: AuthenticatedUser,
    @Param("ticketId", ParseUUIDPipe) ticketId: string,
    @Body(new ZodValidationPipe(ReplySupportTicketSchema))
    body: ReplySupportTicketInput,
  ) {
    return this.supportService.replyAsAdmin(user, ticketId, body);
  }

  @Post("tickets/:ticketId/assign")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  assign(
    @CurrentUser() user: AuthenticatedUser,
    @Param("ticketId", ParseUUIDPipe) ticketId: string,
  ) {
    return this.supportService.assignToMe(user, ticketId);
  }

  @Post("tickets/:ticketId/resolve")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  resolve(
    @CurrentUser() user: AuthenticatedUser,
    @Param("ticketId", ParseUUIDPipe) ticketId: string,
  ) {
    return this.supportService.resolveTicket(user, ticketId);
  }

  @Post("tickets/:ticketId/close")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  close(
    @CurrentUser() user: AuthenticatedUser,
    @Param("ticketId", ParseUUIDPipe) ticketId: string,
  ) {
    return this.supportService.closeAdminTicket(user, ticketId);
  }

  @Post("tickets/:ticketId/reopen")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  reopen(
    @CurrentUser() user: AuthenticatedUser,
    @Param("ticketId", ParseUUIDPipe) ticketId: string,
  ) {
    return this.supportService.reopenAdminTicket(user, ticketId);
  }
}
