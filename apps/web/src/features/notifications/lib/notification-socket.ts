import type { NotificationRealtimePayload } from "@poyino/contracts";
import { io, type Socket } from "socket.io-client";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

function socketBaseUrl() {
  try {
    const url = new URL(API_BASE_URL);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "http://localhost:3000";
  }
}

export type NotificationSocketHandlers = {
  onNotification?: (payload: NotificationRealtimePayload) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export function connectUserNotificationSocket(
  handlers: NotificationSocketHandlers,
): Socket {
  const socket = io(`${socketBaseUrl()}/notifications`, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => handlers.onConnect?.());
  socket.on("disconnect", () => handlers.onDisconnect?.());
  socket.on("notification.created", (payload: NotificationRealtimePayload) => {
    handlers.onNotification?.(payload);
  });

  return socket;
}

export function connectTrackingNotificationSocket(
  trackingToken: string,
  handlers: NotificationSocketHandlers,
): Socket {
  const socket = io(`${socketBaseUrl()}/notifications`, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    auth: { trackingToken },
    query: { trackingToken },
  });

  socket.on("connect", () => {
    socket.emit("subscribe", { trackingToken });
    handlers.onConnect?.();
  });
  socket.on("disconnect", () => handlers.onDisconnect?.());
  socket.on("notification.created", (payload: NotificationRealtimePayload) => {
    handlers.onNotification?.(payload);
  });

  return socket;
}
