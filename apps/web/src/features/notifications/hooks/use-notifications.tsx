import type { NotificationItem, NotificationRealtimePayload } from "@poyino/contracts";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
  type PropsWithChildren,
} from "react";
import { connectUserNotificationSocket } from "../lib/notification-socket";
import { playNotificationSound } from "../lib/play-notification-sound";
import {
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notifications.service";

type NotificationsContextValue = {
  unreadCount: number;
  recent: NotificationItem[];
  connected: boolean;
  refresh: () => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  prependNotification: (notification: NotificationItem) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

export function NotificationsProvider({ children }: PropsWithChildren) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recent, setRecent] = useState<NotificationItem[]>([]);
  const [connected, setConnected] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [countResponse, listResponse] = await Promise.all([
        getUnreadCount(),
        listNotifications({ filter: "all", limit: 8 }),
      ]);
      setUnreadCount(countResponse.unreadCount);
      setRecent(listResponse.notifications);
    } catch {
      // Keep last known state on transient failures.
    }
  }, []);

  const onRealtime = useEffectEvent((payload: NotificationRealtimePayload) => {
    playNotificationSound();
    setRecent((current) => {
      const withoutDup = current.filter(
        (item) => item.id !== payload.notification.id,
      );
      return [payload.notification, ...withoutDup].slice(0, 8);
    });
    if (typeof payload.unreadCount === "number") {
      setUnreadCount(payload.unreadCount);
    } else {
      setUnreadCount((count) => count + 1);
    }
  });

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const socket = connectUserNotificationSocket({
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onNotification: (payload) => onRealtime(payload),
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const markRead = useCallback(async (notificationId: string) => {
    const response = await markNotificationRead(notificationId);
    setRecent((current) =>
      current.map((item) =>
        item.id === notificationId ? response.notification : item,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead();
    setRecent((current) =>
      current.map((item) => ({
        ...item,
        isRead: true,
        readAt: item.readAt ?? new Date().toISOString(),
      })),
    );
    setUnreadCount(0);
  }, []);

  const prependNotification = useCallback((notification: NotificationItem) => {
    setRecent((current) =>
      [notification, ...current.filter((item) => item.id !== notification.id)].slice(
        0,
        8,
      ),
    );
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        unreadCount,
        recent,
        connected,
        refresh,
        markRead,
        markAllRead,
        prependNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const value = useContext(NotificationsContext);
  if (!value) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return value;
}
