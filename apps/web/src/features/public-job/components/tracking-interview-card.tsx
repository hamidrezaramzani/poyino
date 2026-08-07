import type { PublicInterview } from "@poyino/contracts";
import {
  Alert,
  Button,
  DateTimePicker,
  FormField,
  Textarea,
} from "@poyino/ui";
import { useState } from "react";
import { ApiRequestError } from "../../../shared/api/api-client";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { formatDateTime } from "../../../shared/lib/format-date";
import {
  acceptInterview,
  declineInterview,
  requestInterviewReschedule,
} from "../services/public-job.service";

type TrackingInterviewCardProps = {
  token: string;
  interview: PublicInterview;
  timezone: string;
  onUpdated: (interview: PublicInterview) => void;
};

type ResponseMode = "idle" | "reschedule" | "decline";

export function TrackingInterviewCard({
  token,
  interview,
  timezone,
  onUpdated,
}: TrackingInterviewCardProps) {
  const { t, locale } = useI18n();
  const [mode, setMode] = useState<ResponseMode>("idle");
  const [message, setMessage] = useState("");
  const [proposedAt, setProposedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setMode("idle");
    setMessage("");
    setProposedAt("");
    setError(null);
  };

  const resolveError = (err: unknown) => {
    if (err instanceof ApiRequestError) {
      if (err.code === "INTERVIEW_IN_PAST") {
        return t.publicJob.tracking.interviewResponse.errors.inPast;
      }
      if (err.code === "INTERVIEW_NOT_RESPONDABLE") {
        return t.publicJob.tracking.interviewResponse.errors.notRespondable;
      }
      if (err.code === "RESCHEDULE_DETAILS_REQUIRED") {
        return t.publicJob.tracking.interviewResponse.errors.rescheduleRequired;
      }
    }
    return t.publicJob.tracking.interviewResponse.errors.unexpected;
  };

  const onAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await acceptInterview(token, interview.id);
      onUpdated(result.interview);
      resetForm();
    } catch (err) {
      setError(resolveError(err));
    } finally {
      setLoading(false);
    }
  };

  const onSubmitReschedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestInterviewReschedule(token, interview.id, {
        message: message.trim() || null,
        proposedScheduledAt: proposedAt
          ? new Date(proposedAt).toISOString()
          : null,
      });
      onUpdated(result.interview);
      resetForm();
    } catch (err) {
      setError(resolveError(err));
    } finally {
      setLoading(false);
    }
  };

  const onSubmitDecline = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await declineInterview(token, interview.id, {
        message: message.trim() || null,
      });
      onUpdated(result.interview);
      resetForm();
    } catch (err) {
      setError(resolveError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-interview-card">
      <div className="candidate-interview-card-header">
        <div className="candidate-interview-card-title">
          <strong>{interview.name}</strong>
          <span>{t.candidates.interview.types[interview.type]}</span>
          <span>{t.candidates.interview.statuses[interview.status]}</span>
        </div>
        <span className="candidate-interview-card-date">
          {formatDateTime(interview.scheduledAt, locale, {
            timeZone: timezone,
          })}
        </span>
      </div>

      {interview.location ? (
        <p className="candidate-interview-card-detail">{interview.location}</p>
      ) : null}

      {interview.meetingUrl ? (
        <a
          href={interview.meetingUrl}
          target="_blank"
          rel="noreferrer"
          className="candidates-name-link"
        >
          {t.candidates.details.interviews.joinAction}
        </a>
      ) : null}

      {interview.candidateNotes ? (
        <p className="candidate-interview-card-notes">
          {interview.candidateNotes}
        </p>
      ) : null}

      {interview.responseMessage ? (
        <p className="candidate-interview-card-notes">
          {t.publicJob.tracking.interviewResponse.yourMessage}:{" "}
          {interview.responseMessage}
        </p>
      ) : null}

      {interview.proposedScheduledAt ? (
        <p className="candidate-interview-card-detail">
          {t.publicJob.tracking.interviewResponse.proposedTime}:{" "}
          {formatDateTime(interview.proposedScheduledAt, locale, {
            timeZone: timezone,
          })}
        </p>
      ) : null}

      {interview.canRespond && mode === "idle" ? (
        <div className="dashboard-row-actions">
          <Button
            type="button"
            disabled={loading}
            onClick={() => void onAccept()}
          >
            {loading
              ? t.publicJob.tracking.interviewResponse.accepting
              : t.publicJob.tracking.interviewResponse.accept}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => setMode("reschedule")}
          >
            {t.publicJob.tracking.interviewResponse.requestReschedule}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={loading}
            onClick={() => setMode("decline")}
          >
            {t.publicJob.tracking.interviewResponse.decline}
          </Button>
        </div>
      ) : null}

      {mode === "reschedule" ? (
        <div className="public-job-interview-response-form">
          <FormField
            label={t.publicJob.tracking.interviewResponse.messageLabel}
            htmlFor={`reschedule-message-${interview.id}`}
          >
            <Textarea
              id={`reschedule-message-${interview.id}`}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={
                t.publicJob.tracking.interviewResponse.reschedulePlaceholder
              }
              rows={3}
            />
          </FormField>
          <FormField
            label={t.publicJob.tracking.interviewResponse.proposedTimeLabel}
            htmlFor={`reschedule-proposed-${interview.id}`}
          >
            <DateTimePicker
              id={`reschedule-proposed-${interview.id}`}
              value={proposedAt}
              locale={locale}
              onChange={setProposedAt}
            />
          </FormField>
          <div className="dashboard-row-actions">
            <Button
              type="button"
              disabled={loading}
              onClick={() => void onSubmitReschedule()}
            >
              {loading
                ? t.publicJob.tracking.interviewResponse.submitting
                : t.publicJob.tracking.interviewResponse.submitReschedule}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={resetForm}
            >
              {t.publicJob.tracking.interviewResponse.cancel}
            </Button>
          </div>
        </div>
      ) : null}

      {mode === "decline" ? (
        <div className="public-job-interview-response-form">
          <FormField
            label={t.publicJob.tracking.interviewResponse.messageLabel}
            htmlFor={`decline-message-${interview.id}`}
          >
            <Textarea
              id={`decline-message-${interview.id}`}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={
                t.publicJob.tracking.interviewResponse.declinePlaceholder
              }
              rows={3}
            />
          </FormField>
          <div className="dashboard-row-actions">
            <Button
              type="button"
              variant="danger"
              disabled={loading}
              onClick={() => void onSubmitDecline()}
            >
              {loading
                ? t.publicJob.tracking.interviewResponse.submitting
                : t.publicJob.tracking.interviewResponse.submitDecline}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={resetForm}
            >
              {t.publicJob.tracking.interviewResponse.cancel}
            </Button>
          </div>
        </div>
      ) : null}

      {error ? <Alert variant="error">{error}</Alert> : null}
    </div>
  );
}
