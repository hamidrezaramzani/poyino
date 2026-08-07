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
  CreateSupportTicketSchema,
  ListSupportTicketsQuerySchema,
  ReplySupportTicketSchema,
  type CreateSupportTicketInput,
  type ListSupportTicketsQuery,
  type ReplySupportTicketInput,
} from "@poyino/contracts";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { RequirePermission } from "../../authentication/decorators/require-permission.decorator";
import { PermissionsGuard } from "../../authentication/guards/permissions.guard";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { SupportService } from "../services/support.service";

@Controller("support/tickets")
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class SupportController {
  constructor(
    @Inject(SupportService) private readonly supportService: SupportService,
  ) {}

  @Post()
  @RequirePermission("support:create")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateSupportTicketSchema))
    body: CreateSupportTicketInput,
  ) {
    return this.supportService.createTicket(user, body);
  }

  @Get()
  @RequirePermission("support:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(ListSupportTicketsQuerySchema))
    query: ListSupportTicketsQuery,
  ) {
    return this.supportService.listOrgTickets(user, query);
  }

  @Get(":ticketId")
  @RequirePermission("support:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  get(
    @CurrentUser() user: AuthenticatedUser,
    @Param("ticketId", ParseUUIDPipe) ticketId: string,
  ) {
    return this.supportService.getOrgTicket(user, ticketId);
  }

  @Post(":ticketId/messages")
  @RequirePermission("support:reply")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  reply(
    @CurrentUser() user: AuthenticatedUser,
    @Param("ticketId", ParseUUIDPipe) ticketId: string,
    @Body(new ZodValidationPipe(ReplySupportTicketSchema))
    body: ReplySupportTicketInput,
  ) {
    return this.supportService.replyAsCustomer(user, ticketId, body);
  }

  @Post(":ticketId/close")
  @RequirePermission("support:reply")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  close(
    @CurrentUser() user: AuthenticatedUser,
    @Param("ticketId", ParseUUIDPipe) ticketId: string,
  ) {
    return this.supportService.closeOrgTicket(user, ticketId);
  }

  @Post(":ticketId/reopen")
  @RequirePermission("support:reply")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  reopen(
    @CurrentUser() user: AuthenticatedUser,
    @Param("ticketId", ParseUUIDPipe) ticketId: string,
  ) {
    return this.supportService.reopenOrgTicket(user, ticketId);
  }
}
