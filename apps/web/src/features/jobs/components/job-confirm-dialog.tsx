import { Button, LoadingButton } from "@poyino/ui";

type JobConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmingLabel: string;
  cancelLabel: string;
  loading?: boolean;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function JobConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmingLabel,
  cancelLabel,
  loading = false,
  danger = false,
  onCancel,
  onConfirm,
}: JobConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="dashboard-dialog-backdrop" role="presentation">
      <div
        className="dashboard-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="job-confirm-dialog-title"
        aria-describedby="job-confirm-dialog-description"
      >
        <h2 id="job-confirm-dialog-title">{title}</h2>
        <p id="job-confirm-dialog-description">{description}</p>
        <div className="dashboard-dialog-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <LoadingButton
            type="button"
            variant={danger ? "danger" : "primary"}
            loading={loading}
            loadingLabel={confirmingLabel}
            onClick={onConfirm}
          >
            {confirmLabel}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
