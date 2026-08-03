import { Inject, Injectable, Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { createHash } from "node:crypto";
import type { Server, Socket } from "socket.io";
import { SESSION_COOKIE_NAME } from "../../authentication/authentication.constants";
import { AuthenticationService } from "../../authentication/services/authentication.service";
import { PrismaService } from "../../prisma/prisma.service";
import type { NotificationRealtimePayload } from "@poyino/contracts";

type SocketData = {
  userId?: string;
  applicationId?: string;
};

@WebSocketGateway({
  namespace: "/notifications",
  cors: {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  },
})
@Injectable()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const sessionToken = readCookie(
        client.handshake.headers.cookie,
        SESSION_COOKIE_NAME,
      );

      if (sessionToken) {
        const user =
          await this.authenticationService.resolveSessionUser(sessionToken);
        if (user) {
          const data = client.data as SocketData;
          data.userId = user.id;
          await client.join(userRoom(user.id));
          this.logger.debug(`User ${user.id} connected to notifications`);
          return;
        }
      }

      const trackingToken =
        typeof client.handshake.auth?.trackingToken === "string"
          ? client.handshake.auth.trackingToken
          : typeof client.handshake.query?.trackingToken === "string"
            ? client.handshake.query.trackingToken
            : undefined;

      if (trackingToken) {
        const application = await this.prisma.application.findUnique({
          where: { trackingTokenHash: hashToken(trackingToken) },
          select: { id: true },
        });
        if (application) {
          const data = client.data as SocketData;
          data.applicationId = application.id;
          await client.join(applicationRoom(application.id));
          this.logger.debug(
            `Tracking client connected for application ${application.id}`,
          );
          return;
        }
      }

      client.disconnect(true);
    } catch (error) {
      this.logger.warn(`Socket connection failed: ${String(error)}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const data = client.data as SocketData;
    this.logger.debug(
      `Socket disconnected user=${data.userId ?? "n/a"} application=${data.applicationId ?? "n/a"}`,
    );
  }

  @SubscribeMessage("subscribe")
  async handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { trackingToken?: string } | undefined,
  ) {
    if (body?.trackingToken) {
      const application = await this.prisma.application.findUnique({
        where: { trackingTokenHash: hashToken(body.trackingToken) },
        select: { id: true },
      });
      if (!application) {
        return { success: false };
      }
      const data = client.data as SocketData;
      data.applicationId = application.id;
      await client.join(applicationRoom(application.id));
      return { success: true };
    }

    return { success: Boolean((client.data as SocketData).userId) };
  }

  emitToUser(userId: string, payload: NotificationRealtimePayload) {
    this.server.to(userRoom(userId)).emit("notification.created", payload);
  }

  emitToApplication(
    applicationId: string,
    payload: NotificationRealtimePayload,
  ) {
    this.server
      .to(applicationRoom(applicationId))
      .emit("notification.created", payload);
  }
}

function userRoom(userId: string) {
  return `user:${userId}`;
}

function applicationRoom(applicationId: string) {
  return `application:${applicationId}`;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function readCookie(header: string | undefined, name: string) {
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
