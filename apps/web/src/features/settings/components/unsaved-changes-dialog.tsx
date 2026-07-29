import { Button } from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";

type UnsavedChangesDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function UnsavedChangesDialog({
  open,
  onCancel,
  onConfirm,
}: UnsavedChangesDialogProps) {
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
        aria-labelledby="unsaved-dialog-title"
        aria-describedby="unsaved-dialog-description"
      >
        <h2 id="unsaved-dialog-title">{t.settings.unsaved.title}</h2>
        <p id="unsaved-dialog-description">{t.settings.unsaved.description}</p>
        <div className="dashboard-dialog-actions">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t.settings.unsaved.stay}
          </Button>
          <Button type="button" onClick={onConfirm}>
            {t.settings.unsaved.leave}
          </Button>
        </div>
      </div>
    </div>
  );
}
