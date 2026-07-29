import {
  Button,
  Card,
  Divider,
  LoadingButton,
  Skeleton,
  Switch,
} from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useNotificationSettingsForm } from "../hooks/use-notification-settings-form";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

export function NotificationSettingsForm() {
  const { t } = useI18n();
  const form = useNotificationSettingsForm();

  if (form.loadStatus === "loading") {
    return (
      <Card title={t.settings.notifications.title}>
        <Skeleton height={56} />
        <Skeleton height={56} style={{ marginTop: "1rem" }} />
        <Skeleton height={56} style={{ marginTop: "1rem" }} />
      </Card>
    );
  }

  if (form.loadStatus === "error") {
    return (
      <Card title={t.settings.notifications.title}>
        <p>{t.settings.errors.loadFailed}</p>
        <Button type="button" onClick={() => void form.retry()}>
          {t.settings.retry}
        </Button>
      </Card>
    );
  }

  const items = [
    {
      key: "newCandidateEmail" as const,
      title: t.settings.notifications.newCandidateTitle,
      description: t.settings.notifications.newCandidateDescription,
    },
    {
      key: "candidateStatusEmail" as const,
      title: t.settings.notifications.candidateStatusTitle,
      description: t.settings.notifications.candidateStatusDescription,
    },
    {
      key: "interviewReminderEmail" as const,
      title: t.settings.notifications.interviewReminderTitle,
      description: t.settings.notifications.interviewReminderDescription,
    },
    {
      key: "jobExpirationEmail" as const,
      title: t.settings.notifications.jobExpirationTitle,
      description: t.settings.notifications.jobExpirationDescription,
    },
    {
      key: "jobPublishedEmail" as const,
      title: t.settings.notifications.jobPublishedTitle,
      description: t.settings.notifications.jobPublishedDescription,
    },
  ];

  return (
    <>
      <Card
        title={t.settings.notifications.title}
        description={t.settings.notifications.description}
      >
        <div className="settings-notification-list">
          {items.map((item, index) => (
            <div key={item.key}>
              {index > 0 ? <Divider /> : null}
              <div className="settings-notification-item">
                <div>
                  <h3 id={`notification-${item.key}`}>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <Switch
                  checked={form.values[item.key]}
                  disabled={form.isSubmitting}
                  aria-labelledby={`notification-${item.key}`}
                  onChange={(checked) => form.setToggle(item.key, checked)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="settings-actions">
          <Button
            type="button"
            variant="secondary"
            disabled={!form.isDirty || form.isSubmitting}
            onClick={form.reset}
          >
            {t.settings.reset}
          </Button>
          <LoadingButton
            type="button"
            loading={form.isSubmitting}
            loadingLabel={t.settings.saving}
            disabled={!form.isDirty}
            onClick={() => void form.submit()}
          >
            {t.settings.save}
          </LoadingButton>
        </div>
      </Card>

      <UnsavedChangesDialog
        open={form.unsaved.dialogOpen}
        onCancel={form.unsaved.cancelLeave}
        onConfirm={form.unsaved.confirmLeave}
      />
    </>
  );
}
