import type {
  NotificationCategory,
  NotificationPreferenceItem,
} from "@poyino/contracts";
import { Button, Card, Skeleton, SkeletonText, Switch } from "@poyino/ui";
import { useEffect, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import {
  getNotificationPreferences,
  resetNotificationPreferences,
  updateNotificationPreferences,
} from "../services/notifications.service";

export function NotificationPreferencesPage() {
  const { t } = useI18n();
  const [preferences, setPreferences] = useState<NotificationPreferenceItem[]>(
    [],
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const response = await getNotificationPreferences();
        setPreferences(response.preferences);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    })();
  }, []);

  async function persist(next: NotificationPreferenceItem[]) {
    setSaving(true);
    try {
      const response = await updateNotificationPreferences({
        preferences: next
          .filter((item) => !item.mandatory)
          .map((item) => ({
            category: item.category,
            inAppEnabled: item.inAppEnabled,
            emailEnabled: item.emailEnabled,
          })),
      });
      setPreferences(response.preferences);
    } finally {
      setSaving(false);
    }
  }

  function updateChannel(
    category: NotificationCategory,
    channel: "inAppEnabled" | "emailEnabled",
    value: boolean,
  ) {
    const next = preferences.map((item) =>
      item.category === category ? { ...item, [channel]: value } : item,
    );
    setPreferences(next);
    void persist(next);
  }

  async function handleReset() {
    setSaving(true);
    try {
      const response = await resetNotificationPreferences();
      setPreferences(response.preferences);
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") {
    return (
      <Card>
        <Skeleton height="1.5rem" width="40%" />
        <SkeletonText lines={5} style={{ marginTop: "1rem" }} />
      </Card>
    );
  }

  if (status === "error") {
    return <Card title={t.notifications.preferencesLoadFailed} />;
  }

  return (
    <div className="notification-preferences-page">
      <header className="notifications-page-header">
        <div>
          <h1>{t.notifications.preferencesTitle}</h1>
          <p>{t.notifications.preferencesDescription}</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={saving}
          onClick={() => void handleReset()}
        >
          {t.notifications.resetPreferences}
        </Button>
      </header>

      <div className="notification-preferences-list">
        {preferences.map((item) => (
          <Card
            key={item.category}
            title={t.notifications.categories[item.category]}
            description={
              item.mandatory
                ? t.notifications.mandatoryHint
                : t.notifications.categoryHints[item.category]
            }
          >
            <div className="notification-preference-row">
              <span>{t.notifications.channels.inApp}</span>
              <Switch
                checked={item.inAppEnabled}
                disabled={item.mandatory || saving}
                onChange={(checked) =>
                  updateChannel(item.category, "inAppEnabled", checked)
                }
                aria-label={`${t.notifications.categories[item.category]} ${t.notifications.channels.inApp}`}
              />
            </div>
            <div className="notification-preference-row">
              <span>{t.notifications.channels.email}</span>
              <Switch
                checked={item.emailEnabled}
                disabled={item.mandatory || saving}
                onChange={(checked) =>
                  updateChannel(item.category, "emailEnabled", checked)
                }
                aria-label={`${t.notifications.categories[item.category]} ${t.notifications.channels.email}`}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
