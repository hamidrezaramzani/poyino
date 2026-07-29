import { Button } from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";

type LogoutConfirmDialogProps = {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function LogoutConfirmDialog({
  open,
  loading = false,
  onCancel,
  onConfirm,
}: LogoutConfirmDialogProps) {
  const { t } = useI18n();

  if (!open) {
    return null;
  }

  return (
    <div className="dashboard-dialog-backdrop" role="presentation">
      <div
        className="dashboard-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <h2 id="logout-dialog-title">{t.dashboard.logout.title}</h2>
        <p id="logout-dialog-description">{t.dashboard.logout.description}</p>
        <div className="dashboard-dialog-actions">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            {t.dashboard.logout.cancel}
          </Button>
          <Button type="button" onClick={onConfirm} disabled={loading}>
            {loading ? t.dashboard.logout.confirming : t.dashboard.logout.confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}
