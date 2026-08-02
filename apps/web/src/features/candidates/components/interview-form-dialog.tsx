import type { CreateInterviewInput, Interview, InterviewType } from "@poyino/contracts";
import {
  Button,
  Form,
  FormField,
  Input,
  LoadingButton,
  Select,
  Textarea,
} from "@poyino/ui";
import { useEffect, useState, type FormEvent } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";

const INTERVIEW_TYPES: InterviewType[] = ["HR", "TECHNICAL", "MANAGER", "FINAL"];

type InterviewFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  interview?: Interview | null;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (input: CreateInterviewInput) => void;
};

export function InterviewFormDialog({
  open,
  mode,
  interview = null,
  loading = false,
  onCancel,
  onSubmit,
}: InterviewFormDialogProps) {
  const { t } = useI18n();
  const [scheduledAt, setScheduledAt] = useState("");
  const [type, setType] = useState<InterviewType>("HR");
  const [location, setLocation] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }
    if (interview) {
      setScheduledAt(toLocalInputValue(interview.scheduledAt));
      setType(interview.type);
      setLocation(interview.location ?? "");
      setMeetingUrl(interview.meetingUrl ?? "");
      setNotes(interview.notes ?? "");
    } else {
      setScheduledAt(toLocalInputValue(new Date().toISOString()));
      setType("HR");
      setLocation("");
      setMeetingUrl("");
      setNotes("");
    }
    setError("");
  }, [open, interview]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!scheduledAt) {
      setError(t.candidates.interview.form.errors.scheduledAtRequired);
      return;
    }

    const scheduledDate = new Date(scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) {
      setError(t.candidates.interview.form.errors.scheduledAtRequired);
      return;
    }

    if (meetingUrl.trim() && !/^https?:\/\/.+/i.test(meetingUrl.trim())) {
      setError(t.candidates.interview.form.errors.meetingUrlInvalid);
      return;
    }

    setError("");
    onSubmit({
      scheduledAt: scheduledDate.toISOString(),
      type,
      location: location.trim() || null,
      meetingUrl: meetingUrl.trim() || null,
      notes: notes.trim() || null,
    });
  };

  return (
    <div className="dashboard-dialog-backdrop" role="presentation">
      <div
        className="dashboard-dialog candidates-interview-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="interview-dialog-title"
      >
        <h2 id="interview-dialog-title">
          {mode === "create"
            ? t.candidates.interview.form.createTitle
            : t.candidates.interview.form.editTitle}
        </h2>
        <Form onSubmit={handleSubmit}>
          <FormField
            label={t.candidates.interview.form.dateTimeLabel}
            htmlFor="interview-scheduled-at"
            required
            error={error || undefined}
          >
            <Input
              id="interview-scheduled-at"
              type="datetime-local"
              value={scheduledAt}
              onChange={(event) => setScheduledAt(event.target.value)}
              required
            />
          </FormField>
          <FormField
            label={t.candidates.interview.form.typeLabel}
            htmlFor="interview-type"
            required
          >
            <Select
              id="interview-type"
              value={type}
              onChange={(event) => setType(event.target.value as InterviewType)}
              options={INTERVIEW_TYPES.map((value) => ({
                value,
                label: t.candidates.interview.types[value],
              }))}
            />
          </FormField>
          <FormField
            label={t.candidates.interview.form.locationLabel}
            htmlFor="interview-location"
          >
            <Input
              id="interview-location"
              value={location}
              placeholder={t.candidates.interview.form.locationPlaceholder}
              onChange={(event) => setLocation(event.target.value)}
              maxLength={255}
            />
          </FormField>
          <FormField
            label={t.candidates.interview.form.meetingUrlLabel}
            htmlFor="interview-meeting-url"
          >
            <Input
              id="interview-meeting-url"
              value={meetingUrl}
              placeholder={t.candidates.interview.form.meetingUrlPlaceholder}
              onChange={(event) => setMeetingUrl(event.target.value)}
              maxLength={500}
            />
          </FormField>
          <FormField
            label={t.candidates.interview.form.notesLabel}
            htmlFor="interview-notes"
          >
            <Textarea
              id="interview-notes"
              value={notes}
              placeholder={t.candidates.interview.form.notesPlaceholder}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={5000}
            />
          </FormField>
          <div className="dashboard-dialog-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              {t.candidates.interview.form.cancel}
            </Button>
            <LoadingButton
              type="submit"
              loading={loading}
              loadingLabel={t.candidates.interview.form.saving}
            >
              {t.candidates.interview.form.save}
            </LoadingButton>
          </div>
        </Form>
      </div>
    </div>
  );
}

function toLocalInputValue(isoValue: string) {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}
