import type { NotificationItem } from "@poyino/contracts";
import { Card, EmptyState, Skeleton, SkeletonText } from "@poyino/ui";
import { useEffect, useEffectEvent, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { connectTrackingNotificationSocket } from "../lib/notification-socket";
import { playNotificationSound } from "../lib/play-notification-sound";
import { listTrackingNotifications } from "../services/notifications.service";
import { NotificationCard } from "./notification-card";

type Props = {
  token: string;
};

export function TrackingNotificationsPanel({ token }: Props) {
  const { t } = useI18n();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  const onRealtime = useEffectEvent((notification: NotificationItem) => {
    playNotificationSound();
    setItems((current) =>
      [notification, ...current.filter((item) => item.id !== notification.id)].slice(
        0,
        30,
      ),
    );
  });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await listTrackingNotifications(token);
        if (!cancelled) {
          setItems(response.notifications);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    const socket = connectTrackingNotificationSocket(token, {
      onNotification: (payload) => onRealtime(payload.notification),
    });
    return () => {
      socket.disconnect();
    };
  }, [token]);

  return (
    <Card title={t.notifications.trackingTitle}>
      {status === "loading" ? (
        <>
          <Skeleton height="1.25rem" width="40%" />
          <SkeletonText lines={3} style={{ marginTop: "0.75rem" }} />
        </>
      ) : null}

      {status === "error" ? (
        <EmptyState title={t.notifications.loadFailed} />
      ) : null}

      {status === "ready" && items.length === 0 ? (
        <EmptyState
          title={t.notifications.empty}
          description={t.notifications.trackingEmptyDescription}
        />
      ) : null}

      {status === "ready" && items.length > 0 ? (
        <div className="notifications-list is-tracking">
          {items.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              compact
            />
          ))}
        </div>
      ) : null}
    </Card>
  );
}
