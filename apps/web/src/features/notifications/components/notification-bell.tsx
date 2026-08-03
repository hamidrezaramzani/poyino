import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useNotifications } from "../hooks/use-notifications";
import { NotificationCard } from "./notification-card";

export function NotificationBell() {
  const { t } = useI18n();
  const { unreadCount, recent, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const badgeLabel =
    unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <div className="notification-bell" ref={rootRef}>
      <button
        type="button"
        className="notification-bell-trigger"
        aria-label={t.notifications.bellLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden>🔔</span>
        {badgeLabel ? (
          <span className="notification-bell-badge">{badgeLabel}</span>
        ) : null}
      </button>

      {open ? (
        <div
          className="notification-dropdown"
          role="dialog"
          aria-label={t.notifications.dropdownTitle}
        >
          <div className="notification-dropdown-header">
            <strong>{t.notifications.dropdownTitle}</strong>
            {unreadCount > 0 ? (
              <button
                type="button"
                className="notification-dropdown-action"
                onClick={() => void markAllRead()}
              >
                {t.notifications.markAllRead}
              </button>
            ) : null}
          </div>

          <div className="notification-dropdown-list">
            {recent.length === 0 ? (
              <p className="notification-empty">{t.notifications.empty}</p>
            ) : (
              recent.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  compact
                  onOpen={(item) => {
                    if (!item.isRead) {
                      void markRead(item.id);
                    }
                    setOpen(false);
                  }}
                />
              ))
            )}
          </div>

          <div className="notification-dropdown-footer">
            <Link
              to="/dashboard/notifications"
              className="notification-dropdown-view-all"
              onClick={() => setOpen(false)}
            >
              {t.notifications.viewAll}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
