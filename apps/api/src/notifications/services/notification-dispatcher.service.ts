import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { DOMAIN_NOTIFICATION_EVENT } from "@poyino/contracts";
import { PrismaService } from "../../prisma/prisma.service";
import { EVENT_CATALOG } from "../catalog/event-catalog";
import { NotificationGateway } from "../gateways/notification.gateway";
import { mapNotification, type MappedNotification } from "../lib/map-notification";
import type { DomainNotificationEvent } from "../types/domain-event";
import { PreferenceResolverService } from "./preference-resolver.service";

@Injectable()
export class NotificationDispatcherService {
  private readonly logger = new Logger(NotificationDispatcherService.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(PreferenceResolverService)
    private readonly preferenceResolver: PreferenceResolverService,
    @Inject(NotificationGateway) private readonly gateway: NotificationGateway,
  ) {}

  @OnEvent(DOMAIN_NOTIFICATION_EVENT, { async: true })
  async handleDomainEvent(event: DomainNotificationEvent) {
    try {
      await this.dispatch(event);
    } catch (error) {
      this.logger.warn(
        `Failed to dispatch notification event ${event.event}: ${String(error)}`,
      );
    }
  }

  async dispatch(event: DomainNotificationEvent) {
    const catalog = EVENT_CATALOG[event.event];
    if (!catalog) {
      this.logger.warn(`No catalog entry for event ${event.event}`);
      return;
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: event.organizationId },
      select: { language: true },
    });
    const locale = organization?.language === "en" ? "en" : "fa";
    const metadata = event.metadata ?? {};
    const title = catalog.resolveTitle(metadata, locale);
    const description = catalog.resolveDescription(metadata, locale);
    const actionUrl = catalog.resolveActionUrl?.(metadata) ?? null;
    const mandatory = Boolean(catalog.mandatory);

    const userIds = [...new Set(event.targetUserIds ?? [])].filter(Boolean);
    for (const userId of userIds) {
      const channels = await this.preferenceResolver.resolveChannels(
        userId,
        catalog.category,
        mandatory,
      );

      if (!channels.inApp && !channels.email) {
        continue;
      }

      if (channels.inApp) {
        const notification = await this.createNotification({
          event,
          recipientKey: `user:${userId}`,
          userId,
          applicationId: null,
          category: catalog.category,
          priority: catalog.priority,
          title,
          description,
          actionUrl,
          mandatory,
          metadata,
        });

        if (notification) {
          await this.logDelivery(notification.id, event, userId, "IN_APP");
          const unreadCount = await this.prisma.notification.count({
            where: {
              userId,
              isRead: false,
              archivedAt: null,
            },
          });
          this.gateway.emitToUser(userId, {
            notification: mapNotification(notification),
            unreadCount,
          });
        }
      }

      if (channels.email) {
        // Email queue is logged for MVP; actual send can plug into EmailModule later.
        await this.logDelivery(null, event, userId, "EMAIL", {
          pending: true,
          title,
          description,
        });
      }
    }

    const shouldNotifyCandidate =
      Boolean(event.includeCandidate ?? catalog.notifyCandidate) &&
      Boolean(event.applicationId);

    if (shouldNotifyCandidate && event.applicationId) {
      const candidateTitle =
        event.event === "candidate.status_changed" ||
        event.event === "candidate.hired" ||
        event.event === "candidate.rejected" ||
        event.event === "interview.created" ||
        event.event === "interview.updated" ||
        event.event === "interview.cancelled"
          ? title
          : title;
      const candidateDescription = description;

      const notification = await this.createNotification({
        event,
        recipientKey: `application:${event.applicationId}`,
        userId: null,
        applicationId: event.applicationId,
        category: catalog.category,
        priority: catalog.priority,
        title: candidateTitle,
        description: candidateDescription,
        actionUrl: null,
        mandatory: true,
        metadata,
      });

      if (notification) {
        await this.logDelivery(notification.id, event, null, "IN_APP");
        this.gateway.emitToApplication(event.applicationId, {
          notification: mapNotification(notification),
        });
      }
    }
  }

  private async createNotification(input: {
    event: DomainNotificationEvent;
    recipientKey: string;
    userId: string | null;
    applicationId: string | null;
    category: MappedNotification["category"];
    priority: MappedNotification["priority"];
    title: string;
    description: string;
    actionUrl: string | null;
    mandatory: boolean;
    metadata: Record<string, unknown>;
  }) {
    try {
      return await this.prisma.notification.create({
        data: {
          eventId: input.event.eventId,
          eventName: input.event.event,
          organizationId: input.event.organizationId,
          userId: input.userId,
          applicationId: input.applicationId,
          recipientKey: input.recipientKey,
          category: input.category,
          title: input.title.slice(0, 200),
          description: input.description.slice(0, 500),
          actionUrl: input.actionUrl,
          priority: input.priority,
          isMandatory: input.mandatory,
          metadata: input.metadata as object,
        },
      });
    } catch (error) {
      // Unique (eventId, recipientKey) — idempotent skip
      if (
        typeof error === "object" &&
        error &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        return null;
      }
      throw error;
    }
  }

  private async logDelivery(
    notificationId: string | null,
    event: DomainNotificationEvent,
    userId: string | null,
    channel: "IN_APP" | "EMAIL",
    options?: { pending?: boolean; title?: string; description?: string },
  ) {
    if (!notificationId && channel === "EMAIL") {
      // Create a lightweight in-app-less delivery log via a stub notification is avoided.
      // For email-only, skip persistent log without notificationId in MVP.
      this.logger.debug(
        `Queued email for event ${event.event} user=${userId ?? "n/a"} title=${options?.title ?? ""}`,
      );
      return;
    }

    if (!notificationId) {
      return;
    }

    await this.prisma.notificationDelivery.create({
      data: {
        notificationId,
        organizationId: event.organizationId,
        userId,
        channel,
        status: options?.pending ? "PENDING" : "DELIVERED",
        attemptNumber: 1,
      },
    });
  }
}
