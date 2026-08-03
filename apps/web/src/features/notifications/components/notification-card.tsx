import type { NotificationItem } from "@poyino/contracts";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { resolveNotificationCopy } from "../lib/resolve-notification-copy";

const CATEGORY_ICONS: Record<NotificationItem["category"], string> = {
  CANDIDATES: "👤",
  JOBS: "💼",
  INTERVIEWS: "🗓️",
  ORGANIZATION: "🏢",
  SYSTEM: "⚙️",
  AI: "✨",
};

type Props = {
  notification: NotificationItem;
  onOpen?: (notification: NotificationItem) => void;
  onDelete?: (notification: NotificationItem) => void;
  compact?: boolean;
};

export function NotificationCard({
  notification,
  onOpen,
  onDelete,
  compact = false,
}: Props) {
  const { t, locale } = useI18n();
  const relative = formatRelative(notification.createdAt, locale);
  const copy = resolveNotificationCopy(notification, t);

  const content = (
    <>
      <span className="notification-card-icon" aria-hidden>
        {CATEGORY_ICONS[notification.category]}
      </span>
      <span className="notification-card-body">
        <span
          className={[
            "notification-card-title",
            notification.isRead ? "" : "is-unread",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {copy.title}
        </span>
        <span className="notification-card-description">
          {copy.description}
        </span>
        <span className="notification-card-meta">{relative}</span>
      </span>
      {!notification.isRead ? (
        <span className="notification-card-dot" aria-hidden />
      ) : null}
    </>
  );

  return (
    <article
      className={[
        "notification-card",
        compact ? "is-compact" : "",
        notification.isRead ? "" : "is-unread",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {notification.actionUrl ? (
        <Link
          to={notification.actionUrl}
          className="notification-card-link"
          onClick={() => onOpen?.(notification)}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          className="notification-card-link"
          onClick={() => onOpen?.(notification)}
        >
          {content}
        </button>
      )}
      {onDelete ? (
        <button
          type="button"
          className="notification-card-delete"
          aria-label={t.notifications.delete}
          onClick={() => onDelete(notification)}
        >
          ×
        </button>
      ) : null}
    </article>
  );
}

function formatRelative(iso: string, locale: "fa" | "en") {
  const date = new Date(iso);
  const diffMs = date.getTime() - Date.now();
  const absSec = Math.round(Math.abs(diffMs) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale === "fa" ? "fa" : "en", {
    numeric: "auto",
  });

  if (absSec < 60) return rtf.format(Math.round(diffMs / 1000), "second");
  const absMin = Math.round(absSec / 60);
  if (absMin < 60) return rtf.format(Math.round(diffMs / 60_000), "minute");
  const absHour = Math.round(absMin / 60);
  if (absHour < 48) return rtf.format(Math.round(diffMs / 3_600_000), "hour");
  return rtf.format(Math.round(diffMs / 86_400_000), "day");
}
