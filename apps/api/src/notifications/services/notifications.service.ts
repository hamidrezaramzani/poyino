import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { ListNotificationsQuery } from "@poyino/contracts";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { PrismaService } from "../../prisma/prisma.service";
import { mapNotification } from "../lib/map-notification";

const RETENTION_DAYS = 90;

@Injectable()
export class NotificationsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, query: ListNotificationsQuery) {
    await this.archiveExpired(user.id);

    let cursorCreatedAt: Date | undefined;
    if (query.cursor) {
      const cursorNotification = await this.prisma.notification.findUnique({
        where: { id: query.cursor },
        select: { createdAt: true, userId: true },
      });
      if (cursorNotification?.userId === user.id) {
        cursorCreatedAt = cursorNotification.createdAt;
      }
    }

    const where = {
      userId: user.id,
      archivedAt: null,
      ...(query.filter === "unread" ? { isRead: false } : {}),
      ...(query.filter === "read" ? { isRead: true } : {}),
      ...(cursorCreatedAt ? { createdAt: { lt: cursorCreatedAt } } : {}),
    };

    const [notifications, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: query.limit + 1,
      }),
      this.prisma.notification.count({
        where: { userId: user.id, isRead: false, archivedAt: null },
      }),
    ]);

    const hasMore = notifications.length > query.limit;
    const page = hasMore ? notifications.slice(0, query.limit) : notifications;

    return {
      success: true as const,
      notifications: page.map(mapNotification),
      unreadCount,
      nextCursor: hasMore ? page[page.length - 1]?.id ?? null : null,
    };
  }

  async unreadCount(user: AuthenticatedUser) {
    await this.archiveExpired(user.id);
    const unreadCount = await this.prisma.notification.count({
      where: { userId: user.id, isRead: false, archivedAt: null },
    });
    return { success: true as const, unreadCount };
  }

  async markRead(user: AuthenticatedUser, notificationId: string) {
    const notification = await this.requireOwned(user.id, notificationId);
    if (notification.isRead) {
      return {
        success: true as const,
        notification: mapNotification(notification),
      };
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });

    return {
      success: true as const,
      notification: mapNotification(updated),
    };
  }

  async markAllRead(user: AuthenticatedUser) {
    const result = await this.prisma.notification.updateMany({
      where: { userId: user.id, isRead: false, archivedAt: null },
      data: { isRead: true, readAt: new Date() },
    });

    return {
      success: true as const,
      updatedCount: result.count,
    };
  }

  async remove(user: AuthenticatedUser, notificationId: string) {
    await this.requireOwned(user.id, notificationId);
    await this.prisma.notification.delete({ where: { id: notificationId } });
    return { success: true as const };
  }

  async listForApplication(applicationId: string, limit = 30) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        applicationId,
        archivedAt: null,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return {
      success: true as const,
      notifications: notifications.map(mapNotification),
    };
  }

  private async requireOwned(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId, archivedAt: null },
    });

    if (!notification) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "NOTIFICATION_NOT_FOUND",
            message: "اعلان یافت نشد.",
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return notification;
  }

  private async archiveExpired(userId: string) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
    await this.prisma.notification.updateMany({
      where: {
        userId,
        archivedAt: null,
        createdAt: { lt: cutoff },
      },
      data: { archivedAt: new Date() },
    });
  }
}
