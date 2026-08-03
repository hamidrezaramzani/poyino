import type {
  CreateInterviewInput,
  Interview,
  InterviewType,
} from "@poyino/contracts";
import {
  Button,
  DateTimePicker,
  Form,
  FormField,
  Input,
  LoadingButton,
  Select,
  Textarea,
} from "@poyino/ui";
import { useEffect, useState, type FormEvent } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import {
  defaultStageName,
  type RecruiterOption,
} from "../../interviews/services/interviews.service";

const INTERVIEW_TYPES: InterviewType[] = [
  "HR",
  "TECHNICAL",
  "TEAM_LEAD",
  "MANAGER",
  "FINAL",
  "CUSTOM",
];

type InterviewFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  interview?: Interview | null;
  recruiters?: RecruiterOption[];
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (input: CreateInterviewInput) => void;
};

export function InterviewFormDialog({
  open,
  mode,
  interview = null,
  recruiters = [],
  loading = false,
  onCancel,
  onSubmit,
}: InterviewFormDialogProps) {
  const { t, locale } = useI18n();
  const [name, setName] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [type, setType] = useState<InterviewType>("HR");
  const [recruiterUserId, setRecruiterUserId] = useState("");
  const [location, setLocation] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [candidateNotes, setCandidateNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (interview) {
      setName(interview.name);
      setScheduledAt(toLocalInputValue(interview.scheduledAt));
      setType(interview.type);
      setRecruiterUserId(interview.recruiterUserId ?? "");
      setLocation(interview.location ?? "");
      setMeetingUrl(interview.meetingUrl ?? "");
      setInternalNotes(interview.internalNotes ?? "");
      setCandidateNotes(interview.candidateNotes ?? "");
    } else {
      setName(defaultStageName("HR"));
      setScheduledAt(toLocalInputValue(new Date().toISOString()));
      setType("HR");
      setRecruiterUserId("");
      setLocation("");
      setMeetingUrl("");
      setInternalNotes("");
      setCandidateNotes("");
    }
    setError("");
  }, [open, interview]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setError(t.candidates.interview.form.errors.nameRequired);
      return;
    }
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
      name: name.trim(),
      scheduledAt: scheduledDate.toISOString(),
      type,
      recruiterUserId: recruiterUserId || null,
      location: location.trim() || null,
      meetingUrl: meetingUrl.trim() || null,
      internalNotes: internalNotes.trim() || null,
      candidateNotes: candidateNotes.trim() || null,
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
            label={t.candidates.interview.form.nameLabel}
            htmlFor="interview-name"
            required
            error={error || undefined}
          >
            <Input
              id="interview-name"
              value={name}
              placeholder={t.candidates.interview.form.namePlaceholder}
              onChange={(event) => setName(event.target.value)}
              maxLength={120}
              required
            />
          </FormField>
          <FormField
            label={t.candidates.interview.form.dateTimeLabel}
            htmlFor="interview-scheduled-at"
            required
          >
            <DateTimePicker
              id="interview-scheduled-at"
              value={scheduledAt}
              locale={locale}
              onChange={setScheduledAt}
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
              onChange={(event) => {
                const next = event.target.value as InterviewType;
                setType(next);
                if (!interview) setName(defaultStageName(next));
              }}
              options={INTERVIEW_TYPES.map((value) => ({
                value,
                label: t.candidates.interview.types[value],
              }))}
            />
          </FormField>
          <FormField
            label={t.candidates.interview.form.recruiterLabel}
            htmlFor="interview-recruiter"
          >
            <Select
              id="interview-recruiter"
              value={recruiterUserId}
              onChange={(event) => setRecruiterUserId(event.target.value)}
              options={[
                {
                  value: "",
                  label: t.candidates.interview.form.recruiterNone,
                },
                ...recruiters.map((user) => ({
                  value: user.id,
                  label: user.email,
                })),
              ]}
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
            label={t.candidates.interview.form.internalNotesLabel}
            htmlFor="interview-internal-notes"
          >
            <Textarea
              id="interview-internal-notes"
              value={internalNotes}
              placeholder={t.candidates.interview.form.internalNotesPlaceholder}
              onChange={(event) => setInternalNotes(event.target.value)}
              maxLength={5000}
            />
          </FormField>
          <FormField
            label={t.candidates.interview.form.candidateNotesLabel}
            htmlFor="interview-candidate-notes"
          >
            <Textarea
              id="interview-candidate-notes"
              value={candidateNotes}
              placeholder={
                t.candidates.interview.form.candidateNotesPlaceholder
              }
              onChange={(event) => setCandidateNotes(event.target.value)}
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
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}
