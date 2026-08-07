import { randomUUID } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import {
  MAX_SUPPORT_ATTACHMENT_BYTES,
  NotificationEventName,
  SupportErrorCode,
  type CreateSupportTicketInput,
  type ListSupportTicketsQuery,
  type ReplySupportTicketInput,
  type SupportAttachmentInput,
} from "@poyino/contracts";
import type {
  Prisma,
  SupportMessageAuthorType,
  SupportTicketStatus,
} from "@prisma/client";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { DomainEventPublisher } from "../../notifications/services/domain-event.publisher";
import { RecipientResolverService } from "../../notifications/services/recipient-resolver.service";
import { PrismaService } from "../../prisma/prisma.service";
import { StorageService } from "../../storage/storage.service";
import {
  supportAttachmentException,
  supportClosedException,
  supportForbiddenException,
  supportInvalidStatusException,
  supportNotFoundException,
} from "../support.errors";

const ticketInclude = {
  organization: { select: { id: true, name: true } },
  createdByUser: { select: { id: true, email: true } },
  assignedToUser: { select: { id: true, email: true } },
  messages: {
    orderBy: { createdAt: "asc" as const },
    include: {
      authorUser: { select: { id: true, email: true } },
      attachments: {
        include: {
          file: {
            select: {
              id: true,
              originalName: true,
              mimeType: true,
              sizeBytes: true,
              publicUrl: true,
              createdAt: true,
            },
          },
        },
      },
    },
  },
  _count: { select: { messages: true } },
} satisfies Prisma.SupportTicketInclude;

type TicketWithRelations = Prisma.SupportTicketGetPayload<{
  include: typeof ticketInclude;
}>;

@Injectable()
export class SupportService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StorageService) private readonly storageService: StorageService,
    @Inject(DomainEventPublisher)
    private readonly domainEvents: DomainEventPublisher,
    @Inject(RecipientResolverService)
    private readonly recipients: RecipientResolverService,
  ) {}

  async createTicket(user: AuthenticatedUser, input: CreateSupportTicketInput) {
    const ticketId = randomUUID();
    const messageId = randomUUID();
    const now = new Date();

    const attachments = await this.uploadAttachments(
      user.organizationId,
      input.attachments,
    );

    const ticket = await this.prisma.$transaction(async (tx) => {
      const created = await tx.supportTicket.create({
        data: {
          id: ticketId,
          organizationId: user.organizationId,
          createdByUserId: user.id,
          subject: input.subject.trim(),
          category: input.category,
          priority: input.priority,
          status: "WAITING_FOR_ADMIN",
          lastMessageAt: now,
        },
      });

      await tx.supportMessage.create({
        data: {
          id: messageId,
          ticketId: created.id,
          authorUserId: user.id,
          authorType: "CUSTOMER",
          content: input.message.trim(),
        },
      });

      if (attachments.length > 0) {
        await tx.supportAttachment.createMany({
          data: attachments.map((file) => ({
            id: randomUUID(),
            ticketId: created.id,
            messageId,
            fileId: file.id,
            organizationId: user.organizationId,
          })),
        });
      }

      await tx.supportAuditEvent.create({
        data: {
          id: randomUUID(),
          ticketId: created.id,
          actorUserId: user.id,
          action: "TICKET_CREATED",
          toStatus: "WAITING_FOR_ADMIN",
          metadata: {
            subject: created.subject,
            category: created.category,
            priority: created.priority,
          },
        },
      });

      return tx.supportTicket.findUniqueOrThrow({
        where: { id: created.id },
        include: ticketInclude,
      });
    });

    const platformAdminIds = await this.recipients.resolvePlatformAdmins({
      excludeUserId: user.id,
    });

    if (platformAdminIds.length > 0) {
      this.domainEvents.publishNamed(
        NotificationEventName.SUPPORT_TICKET_CREATED,
        {
          organizationId: user.organizationId,
          triggeredBy: user.id,
          resourceType: "support_ticket",
          resourceId: ticket.id,
          targetUserIds: platformAdminIds,
          metadata: {
            ticketId: ticket.id,
            subject: ticket.subject,
            organizationName: user.organizationName,
            category: ticket.category,
            priority: ticket.priority,
          },
        },
      );
    }

    return {
      success: true as const,
      ticket: this.mapTicketDetails(ticket),
    };
  }

  async listOrgTickets(
    user: AuthenticatedUser,
    query: ListSupportTicketsQuery,
  ) {
    return this.listTickets(query, { organizationId: user.organizationId });
  }

  async listAdminTickets(query: ListSupportTicketsQuery) {
    return this.listTickets(query, {
      organizationId: query.organizationId,
      includeOrganizationName: true,
    });
  }

  async getOrgTicket(user: AuthenticatedUser, ticketId: string) {
    const ticket = await this.findTicketOrThrow(ticketId);
    if (ticket.organizationId !== user.organizationId) {
      throw supportNotFoundException();
    }
    return {
      success: true as const,
      ticket: this.mapTicketDetails(ticket),
    };
  }

  async getAdminTicket(ticketId: string) {
    const ticket = await this.findTicketOrThrow(ticketId);
    return {
      success: true as const,
      ticket: this.mapTicketDetails(ticket, true),
    };
  }

  async replyAsCustomer(
    user: AuthenticatedUser,
    ticketId: string,
    input: ReplySupportTicketInput,
  ) {
    const ticket = await this.findTicketOrThrow(ticketId);
    if (ticket.organizationId !== user.organizationId) {
      throw supportNotFoundException();
    }
    this.assertCanReply(ticket.status);

    return this.addReply({
      ticket,
      user,
      input,
      authorType: "CUSTOMER",
      nextStatus: "WAITING_FOR_ADMIN",
      notifyAdminReply: false,
    });
  }

  async replyAsAdmin(
    user: AuthenticatedUser,
    ticketId: string,
    input: ReplySupportTicketInput,
  ) {
    const ticket = await this.findTicketOrThrow(ticketId);
    this.assertCanReply(ticket.status);

    const result = await this.addReply({
      ticket,
      user,
      input,
      authorType: "PLATFORM_ADMIN",
      nextStatus: "WAITING_FOR_CUSTOMER",
      notifyAdminReply: true,
      setFirstResponse: !ticket.firstResponseAt,
    });

    return result;
  }

  async closeOrgTicket(user: AuthenticatedUser, ticketId: string) {
    const ticket = await this.findTicketOrThrow(ticketId);
    if (ticket.organizationId !== user.organizationId) {
      throw supportNotFoundException();
    }
    if (
      ticket.createdByUserId !== user.id &&
      user.role !== "OWNER" &&
      user.role !== "ADMINISTRATOR"
    ) {
      throw supportForbiddenException(
        "You can only close tickets you created.",
      );
    }
    if (ticket.status === "CLOSED") {
      throw supportInvalidStatusException("Ticket is already closed.");
    }
    return this.changeStatus(user, ticket, "CLOSED", "CLOSED");
  }

  async reopenOrgTicket(user: AuthenticatedUser, ticketId: string) {
    const ticket = await this.findTicketOrThrow(ticketId);
    if (ticket.organizationId !== user.organizationId) {
      throw supportNotFoundException();
    }
    if (ticket.status !== "CLOSED" && ticket.status !== "RESOLVED") {
      throw supportInvalidStatusException(
        "Only resolved or closed tickets can be reopened.",
      );
    }
    return this.changeStatus(user, ticket, "OPEN", "REOPENED");
  }

  async assignToMe(user: AuthenticatedUser, ticketId: string) {
    const ticket = await this.findTicketOrThrow(ticketId);
    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.supportTicket.update({
        where: { id: ticket.id },
        data: { assignedToUserId: user.id },
      });
      await tx.supportAuditEvent.create({
        data: {
          id: randomUUID(),
          ticketId: ticket.id,
          actorUserId: user.id,
          action: "ASSIGNED",
          metadata: { assignedToUserId: user.id },
        },
      });
      return tx.supportTicket.findUniqueOrThrow({
        where: { id: ticket.id },
        include: ticketInclude,
      });
    });

    return {
      success: true as const,
      ticket: this.mapTicketDetails(updated, true),
    };
  }

  async resolveTicket(user: AuthenticatedUser, ticketId: string) {
    const ticket = await this.findTicketOrThrow(ticketId);
    if (ticket.status === "RESOLVED") {
      throw supportInvalidStatusException("Ticket is already resolved.");
    }
    if (ticket.status === "CLOSED") {
      throw supportInvalidStatusException("Closed tickets cannot be resolved.");
    }
    return this.changeStatus(user, ticket, "RESOLVED", "RESOLVED", true);
  }

  async closeAdminTicket(user: AuthenticatedUser, ticketId: string) {
    const ticket = await this.findTicketOrThrow(ticketId);
    if (ticket.status === "CLOSED") {
      throw supportInvalidStatusException("Ticket is already closed.");
    }
    return this.changeStatus(user, ticket, "CLOSED", "CLOSED", true);
  }

  async reopenAdminTicket(user: AuthenticatedUser, ticketId: string) {
    const ticket = await this.findTicketOrThrow(ticketId);
    if (ticket.status !== "CLOSED" && ticket.status !== "RESOLVED") {
      throw supportInvalidStatusException(
        "Only resolved or closed tickets can be reopened.",
      );
    }
    return this.changeStatus(user, ticket, "OPEN", "REOPENED", true);
  }

  async getAdminStats() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [openTickets, waitingForReply, resolvedToday, responseSamples] =
      await Promise.all([
        this.prisma.supportTicket.count({
          where: {
            status: { in: ["OPEN", "WAITING_FOR_ADMIN", "WAITING_FOR_CUSTOMER"] },
          },
        }),
        this.prisma.supportTicket.count({
          where: { status: "WAITING_FOR_ADMIN" },
        }),
        this.prisma.supportTicket.count({
          where: {
            status: "RESOLVED",
            resolvedAt: { gte: startOfDay },
          },
        }),
        this.prisma.supportTicket.findMany({
          where: { firstResponseAt: { not: null } },
          select: { createdAt: true, firstResponseAt: true },
          take: 500,
          orderBy: { createdAt: "desc" },
        }),
      ]);

    let averageResponseTimeMinutes: number | null = null;
    if (responseSamples.length > 0) {
      const totalMs = responseSamples.reduce((sum, ticket) => {
        if (!ticket.firstResponseAt) {
          return sum;
        }
        return sum + (ticket.firstResponseAt.getTime() - ticket.createdAt.getTime());
      }, 0);
      averageResponseTimeMinutes = Math.round(
        totalMs / responseSamples.length / 60_000,
      );
    }

    return {
      success: true as const,
      stats: {
        openTickets,
        waitingForReply,
        resolvedToday,
        averageResponseTimeMinutes,
      },
    };
  }

  async getOrgStats(organizationId: string) {
    const [openTickets, resolvedTickets, latestAdminMessage] =
      await Promise.all([
        this.prisma.supportTicket.count({
          where: {
            organizationId,
            status: {
              in: ["OPEN", "WAITING_FOR_ADMIN", "WAITING_FOR_CUSTOMER"],
            },
          },
        }),
        this.prisma.supportTicket.count({
          where: {
            organizationId,
            status: { in: ["RESOLVED", "CLOSED"] },
          },
        }),
        this.prisma.supportMessage.findFirst({
          where: {
            authorType: "PLATFORM_ADMIN",
            ticket: { organizationId },
          },
          orderBy: { createdAt: "desc" },
          select: { createdAt: true },
        }),
      ]);

    return {
      openTickets,
      resolvedTickets,
      latestReplyAt: latestAdminMessage?.createdAt.toISOString() ?? null,
    };
  }

  private async listTickets(
    query: ListSupportTicketsQuery,
    options: {
      organizationId?: string;
      includeOrganizationName?: boolean;
    },
  ) {
    const where: Prisma.SupportTicketWhereInput = {};

    if (options.organizationId) {
      where.organizationId = options.organizationId;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.priority) {
      where.priority = query.priority;
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { subject: { contains: term, mode: "insensitive" } },
        { createdByUser: { email: { contains: term, mode: "insensitive" } } },
        ...(options.includeOrganizationName
          ? [
              {
                organization: {
                  name: { contains: term, mode: "insensitive" as const },
                },
              },
            ]
          : []),
      ];
    }

    const skip = (query.page - 1) * query.pageSize;
    const [total, tickets] = await Promise.all([
      this.prisma.supportTicket.count({ where }),
      this.prisma.supportTicket.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: query.pageSize,
        include: {
          organization: { select: { id: true, name: true } },
          createdByUser: { select: { id: true, email: true } },
          assignedToUser: { select: { id: true, email: true } },
          _count: { select: { messages: true } },
        },
      }),
    ]);

    return {
      success: true as const,
      tickets: tickets.map((ticket) => ({
        id: ticket.id,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        organizationId: ticket.organizationId,
        ...(options.includeOrganizationName
          ? { organizationName: ticket.organization.name }
          : {}),
        createdByUserId: ticket.createdByUserId,
        createdByEmail: ticket.createdByUser.email,
        assignedToUserId: ticket.assignedToUserId,
        assignedToEmail: ticket.assignedToUser?.email ?? null,
        lastMessageAt: ticket.lastMessageAt.toISOString(),
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString(),
        messageCount: ticket._count.messages,
      })),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  private async addReply(input: {
    ticket: TicketWithRelations;
    user: AuthenticatedUser;
    input: ReplySupportTicketInput;
    authorType: SupportMessageAuthorType;
    nextStatus: SupportTicketStatus;
    notifyAdminReply: boolean;
    setFirstResponse?: boolean;
  }) {
    const messageId = randomUUID();
    const now = new Date();
    const attachments = await this.uploadAttachments(
      input.ticket.organizationId,
      input.input.attachments,
    );

    const fromStatus = input.ticket.status;
    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.supportMessage.create({
        data: {
          id: messageId,
          ticketId: input.ticket.id,
          authorUserId: input.user.id,
          authorType: input.authorType,
          content: input.input.message.trim(),
        },
      });

      if (attachments.length > 0) {
        await tx.supportAttachment.createMany({
          data: attachments.map((file) => ({
            id: randomUUID(),
            ticketId: input.ticket.id,
            messageId,
            fileId: file.id,
            organizationId: input.ticket.organizationId,
          })),
        });
      }

      await tx.supportTicket.update({
        where: { id: input.ticket.id },
        data: {
          status: input.nextStatus,
          lastMessageAt: now,
          ...(input.setFirstResponse ? { firstResponseAt: now } : {}),
          ...(input.authorType === "PLATFORM_ADMIN" &&
          !input.ticket.assignedToUserId
            ? { assignedToUserId: input.user.id }
            : {}),
        },
      });

      await tx.supportAuditEvent.create({
        data: {
          id: randomUUID(),
          ticketId: input.ticket.id,
          actorUserId: input.user.id,
          action: "TICKET_REPLIED",
          fromStatus,
          toStatus: input.nextStatus,
        },
      });

      if (fromStatus !== input.nextStatus) {
        await tx.supportAuditEvent.create({
          data: {
            id: randomUUID(),
            ticketId: input.ticket.id,
            actorUserId: input.user.id,
            action: "STATUS_CHANGED",
            fromStatus,
            toStatus: input.nextStatus,
          },
        });
      }

      return tx.supportTicket.findUniqueOrThrow({
        where: { id: input.ticket.id },
        include: ticketInclude,
      });
    });

    if (input.notifyAdminReply) {
      const targetUserIds = [
        ...new Set(
          [
            input.ticket.createdByUserId,
            ...(await this.recipients.resolveAdministrators(
              input.ticket.organizationId,
              { excludeUserId: input.user.id },
            )),
          ].filter((id) => id !== input.user.id),
        ),
      ];

      if (targetUserIds.length > 0) {
        this.domainEvents.publishNamed(
          NotificationEventName.SUPPORT_TICKET_ADMIN_REPLIED,
          {
            organizationId: input.ticket.organizationId,
            triggeredBy: input.user.id,
            resourceType: "support_ticket",
            resourceId: input.ticket.id,
            targetUserIds,
            metadata: {
              ticketId: input.ticket.id,
              subject: input.ticket.subject,
            },
          },
        );
      }
    }

    return {
      success: true as const,
      ticket: this.mapTicketDetails(
        updated,
        input.authorType === "PLATFORM_ADMIN",
      ),
    };
  }

  private async changeStatus(
    user: AuthenticatedUser,
    ticket: TicketWithRelations,
    nextStatus: SupportTicketStatus,
    auditAction: "CLOSED" | "RESOLVED" | "REOPENED",
    includeOrgName = false,
  ) {
    const fromStatus = ticket.status;
    const now = new Date();
    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.supportTicket.update({
        where: { id: ticket.id },
        data: {
          status: nextStatus,
          ...(nextStatus === "RESOLVED"
            ? { resolvedAt: now, closedAt: null }
            : {}),
          ...(nextStatus === "CLOSED" ? { closedAt: now } : {}),
          ...(nextStatus === "OPEN"
            ? { resolvedAt: null, closedAt: null }
            : {}),
        },
      });

      await tx.supportAuditEvent.create({
        data: {
          id: randomUUID(),
          ticketId: ticket.id,
          actorUserId: user.id,
          action: auditAction,
          fromStatus,
          toStatus: nextStatus,
        },
      });

      return tx.supportTicket.findUniqueOrThrow({
        where: { id: ticket.id },
        include: ticketInclude,
      });
    });

    return {
      success: true as const,
      ticket: this.mapTicketDetails(updated, includeOrgName),
    };
  }

  private async findTicketOrThrow(ticketId: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: ticketInclude,
    });
    if (!ticket) {
      throw supportNotFoundException();
    }
    return ticket;
  }

  private assertCanReply(status: SupportTicketStatus) {
    if (status === "CLOSED") {
      throw supportClosedException();
    }
  }

  private async uploadAttachments(
    organizationId: string,
    attachments: SupportAttachmentInput[] | undefined,
  ) {
    if (!attachments?.length) {
      return [] as Array<{ id: string }>;
    }

    const uploaded: Array<{ id: string }> = [];
    for (const attachment of attachments) {
      let buffer: Buffer;
      try {
        buffer = Buffer.from(attachment.contentBase64, "base64");
      } catch {
        throw supportAttachmentException(
          SupportErrorCode.ATTACHMENT_INVALID_TYPE,
          "Invalid attachment payload.",
        );
      }

      if (buffer.byteLength === 0 || buffer.byteLength > MAX_SUPPORT_ATTACHMENT_BYTES) {
        throw supportAttachmentException(
          SupportErrorCode.ATTACHMENT_TOO_LARGE,
          `Attachments must be between 1 byte and ${MAX_SUPPORT_ATTACHMENT_BYTES} bytes.`,
        );
      }

      const file = await this.storageService.upload({
        organizationId,
        folder: "attachments",
        scope: "support",
        buffer,
        originalName: attachment.fileName,
        mimeType: attachment.mimeType,
      });
      uploaded.push({ id: file.id });
    }

    return uploaded;
  }

  private mapTicketDetails(ticket: TicketWithRelations, includeOrgName = false) {
    return {
      id: ticket.id,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      organizationId: ticket.organizationId,
      ...(includeOrgName
        ? { organizationName: ticket.organization.name }
        : {}),
      createdByUserId: ticket.createdByUserId,
      createdByEmail: ticket.createdByUser.email,
      assignedToUserId: ticket.assignedToUserId,
      assignedToEmail: ticket.assignedToUser?.email ?? null,
      firstResponseAt: ticket.firstResponseAt?.toISOString() ?? null,
      resolvedAt: ticket.resolvedAt?.toISOString() ?? null,
      closedAt: ticket.closedAt?.toISOString() ?? null,
      lastMessageAt: ticket.lastMessageAt.toISOString(),
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      messageCount: ticket._count.messages,
      messages: ticket.messages
        .filter((message) => !message.isInternal)
        .map((message) => ({
          id: message.id,
          authorType: message.authorType,
          authorUserId: message.authorUserId,
          authorEmail: message.authorUser?.email ?? null,
          content: message.content,
          isInternal: message.isInternal,
          createdAt: message.createdAt.toISOString(),
          attachments: message.attachments.map((attachment) => ({
            id: attachment.id,
            fileId: attachment.fileId,
            fileName: attachment.file.originalName,
            mimeType: attachment.file.mimeType,
            sizeBytes: attachment.file.sizeBytes,
            url: attachment.file.publicUrl,
            createdAt: attachment.file.createdAt.toISOString(),
          })),
        })),
    };
  }
}
