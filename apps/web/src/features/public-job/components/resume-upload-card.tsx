import { Alert, Button, ProgressBar } from "@poyino/ui";
import type { ChangeEvent, DragEvent } from "react";
import { useRef, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";

type ResumeUploadCardProps = {
  fileName: string | null;
  uploadProgress: number | null;
  disabled?: boolean;
  error?: string | null;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
};

const MAX_BYTES = 10 * 1024 * 1024;

export function ResumeUploadCard({
  fileName,
  uploadProgress,
  disabled,
  error,
  onFileSelected,
  onRemove,
}: ResumeUploadCardProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateAndSelect = (file: File | undefined) => {
    setLocalError(null);
    if (!file) {
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setLocalError(t.publicJob.apply.errors.unsupportedFile);
      return;
    }

    if (file.size > MAX_BYTES) {
      setLocalError(t.publicJob.apply.errors.fileTooLarge);
      return;
    }

    onFileSelected(file);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    validateAndSelect(file);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (disabled) {
      return;
    }
    validateAndSelect(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="public-job-upload-card">
      <div
        className={`public-job-upload-dropzone${dragActive ? " is-active" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) {
            setDragActive(true);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          disabled={disabled}
          onChange={onInputChange}
        />
        {fileName ? (
          <div className="public-job-upload-file">
            <div>
              <strong>{fileName}</strong>
              <p>{t.publicJob.apply.resumeSelected}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              disabled={disabled || uploadProgress != null}
              onClick={onRemove}
            >
              {t.publicJob.apply.removeResume}
            </Button>
          </div>
        ) : (
          <div className="public-job-upload-empty">
            <p>{t.publicJob.apply.uploadHint}</p>
            <Button
              type="button"
              variant="secondary"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
            >
              {t.publicJob.apply.chooseFile}
            </Button>
          </div>
        )}
      </div>

      {uploadProgress != null ? (
        <ProgressBar
          value={uploadProgress}
          label={t.publicJob.apply.uploading}
        />
      ) : null}

      {localError || error ? (
        <Alert variant="error">{localError ?? error}</Alert>
      ) : null}
    </div>
  );
}
