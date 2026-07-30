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
        aria-labelledby="create-job-unsaved-title"
        aria-describedby="create-job-unsaved-description"
      >
        <h2 id="create-job-unsaved-title">{t.jobs.create.unsaved.title}</h2>
        <p id="create-job-unsaved-description">
          {t.jobs.create.unsaved.description}
        </p>
        <div className="dashboard-dialog-actions">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t.jobs.create.unsaved.stay}
          </Button>
          <Button type="button" onClick={onConfirm}>
            {t.jobs.create.unsaved.leave}
          </Button>
        </div>
      </div>
    </div>
  );
}
