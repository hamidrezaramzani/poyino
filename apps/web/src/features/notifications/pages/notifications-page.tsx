import type { NotificationItem, NotificationReadFilter } from "@poyino/contracts";
import { Button, EmptyState, Skeleton, SkeletonText } from "@poyino/ui";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useNotifications } from "../hooks/use-notifications";
import {
  deleteNotification,
  listNotifications,
  markNotificationRead,
} from "../services/notifications.service";
import { NotificationCard } from "../components/notification-card";

export function NotificationsPage() {
  const { t } = useI18n();
  const { markAllRead, refresh } = useNotifications();
  const [filter, setFilter] = useState<NotificationReadFilter>("all");
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(
    async (options?: { cursor?: string; append?: boolean }) => {
      if (options?.append) {
        setLoadingMore(true);
      } else {
        setStatus("loading");
      }

      try {
        const response = await listNotifications({
          filter,
          cursor: options?.cursor,
          limit: 20,
        });
        setItems((current) =>
          options?.append
            ? [...current, ...response.notifications]
            : response.notifications,
        );
        setNextCursor(response.nextCursor);
        setStatus("ready");
      } catch {
        setStatus("error");
      } finally {
        setLoadingMore(false);
      }
    },
    [filter],
  );

  useEffect(() => {
    void load();
  }, [load]);

  async function handleOpen(notification: NotificationItem) {
    if (!notification.isRead) {
      const response = await markNotificationRead(notification.id);
      setItems((current) =>
        current.map((item) =>
          item.id === notification.id ? response.notification : item,
        ),
      );
      await refresh();
    }
  }

  async function handleDelete(notification: NotificationItem) {
    await deleteNotification(notification.id);
    setItems((current) =>
      current.filter((item) => item.id !== notification.id),
    );
    await refresh();
  }

  return (
    <div className="notifications-page">
      <header className="notifications-page-header">
        <div>
          <h1>{t.notifications.pageTitle}</h1>
          <p>{t.notifications.pageDescription}</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            void markAllRead().then(() => {
              setItems((current) =>
                current.map((item) => ({
                  ...item,
                  isRead: true,
                  readAt: item.readAt ?? new Date().toISOString(),
                })),
              );
            })
          }
        >
          {t.notifications.markAllRead}
        </Button>
      </header>

      <div className="notifications-tabs" role="tablist">
        {(
          [
            ["all", t.notifications.tabs.all],
            ["unread", t.notifications.tabs.unread],
            ["read", t.notifications.tabs.read],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            className={[
              "notifications-tab",
              filter === value ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {status === "loading" ? (
        <div className="notifications-list">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="notification-skeleton">
              <Skeleton height="1.25rem" width="35%" />
              <SkeletonText lines={2} style={{ marginTop: "0.75rem" }} />
            </div>
          ))}
        </div>
      ) : null}

      {status === "error" ? (
        <EmptyState title={t.notifications.loadFailed}>
          <Button type="button" onClick={() => void load()}>
            {t.notifications.retry}
          </Button>
        </EmptyState>
      ) : null}

      {status === "ready" && items.length === 0 ? (
        <EmptyState
          title={t.notifications.empty}
          description={t.notifications.emptyDescription}
        />
      ) : null}

      {status === "ready" && items.length > 0 ? (
        <div className="notifications-list">
          {items.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onOpen={(item) => void handleOpen(item)}
              onDelete={(item) => void handleDelete(item)}
            />
          ))}
          {nextCursor ? (
            <Button
              type="button"
              variant="secondary"
              disabled={loadingMore}
              onClick={() => void load({ cursor: nextCursor, append: true })}
            >
              {loadingMore
                ? t.notifications.loadingMore
                : t.notifications.loadMore}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
