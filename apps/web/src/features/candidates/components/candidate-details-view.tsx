import type {
  CandidateNote,
  DashboardCandidateStatus,
  Interview,
} from "@poyino/contracts";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  LoadingButton,
  Select,
  Skeleton,
  Textarea,
} from "@poyino/ui";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useCandidateDetails } from "../hooks/use-candidate-details";
import { ConfirmDialog } from "./confirm-dialog";
import { InterviewFormDialog } from "./interview-form-dialog";

const STATUSES: DashboardCandidateStatus[] = [
  "APPLIED",
  "REVIEWING",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_PASSED",
  "REJECTED",
  "HIRED",
];

export function CandidateDetailsView() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const details = useCandidateDetails();

  if (details.status === "loading") {
    return <CandidateDetailsSkeleton />;
  }

  if (details.status === "error" || !details.candidate || !details.job) {
    return (
      <Card title={t.candidates.details.title}>
        <p>
          {details.notFound
            ? t.candidates.details.notFound
            : t.candidates.details.loadFailed}
        </p>
        {!details.notFound ? (
          <Button type="button" onClick={() => void details.retry()}>
            {t.candidates.details.retry}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => navigate(`/jobs/${details.jobId}/candidates`)}
          >
            {t.candidates.details.backToList}
          </Button>
        )}
      </Card>
    );
  }

  const { candidate, job, jobId } = details;

  return (
    <div className="candidate-profile-layout">
      <Card>
        <div className="candidate-profile-header">
          <div className="candidate-profile-identity">
            <Avatar name={candidate.fullName} size={52} />
            <div>
              <h1>{candidate.fullName}</h1>
              <p className="candidate-profile-meta">
                {[candidate.email, candidate.phone].filter(Boolean).join(" · ")}
              </p>
              <p className="candidate-profile-meta">
                <Link to={`/jobs/${jobId}`}>{job.title}</Link>
                {" · "}
                {formatDate(candidate.appliedAt, locale)}
              </p>
            </div>
          </div>
          <div className="candidate-profile-actions">
            <Select
              value={candidate.status}
              disabled={details.statusUpdating}
              onChange={(event) =>
                void details.changeStatus(
                  event.target.value as DashboardCandidateStatus,
                )
              }
              options={STATUSES.map((value) => ({
                value,
                label: t.dashboard.candidateStatus[value],
              }))}
            />
            <Button type="button" onClick={details.openCreateInterview}>
              {t.candidates.details.actions.scheduleInterview}
            </Button>
            {candidate.resume ? (
              <a
                href={details.resumeDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="candidates-name-link"
              >
                {t.candidates.details.actions.downloadResume}
              </a>
            ) : null}
          </div>
        </div>
      </Card>

      <Card title={t.candidates.details.ai.title}>
        {!candidate.jobMatchAnalysis ? (
          <EmptyState title={t.candidates.details.ai.empty} />
        ) : (
          <div className="candidate-ai-summary">
            <div className="candidate-ai-score-row">
              <Badge variant={aiScoreVariant(candidate.jobMatchAnalysis.matchScore)}>
                {candidate.jobMatchAnalysis.matchScore}
              </Badge>
              <span>{t.candidates.details.ai.matchScore}</span>
            </div>
            {candidate.jobMatchAnalysis.executiveSummary ? (
              <p className="candidate-ai-summary-text">
                {candidate.jobMatchAnalysis.executiveSummary}
              </p>
            ) : null}
            <div className="candidate-ai-columns">
              {candidate.jobMatchAnalysis.strengths.length > 0 ? (
                <div>
                  <h4>{t.candidates.details.ai.strengths}</h4>
                  <ul>
                    {candidate.jobMatchAnalysis.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {candidate.jobMatchAnalysis.weaknesses.length > 0 ? (
                <div>
                  <h4>{t.candidates.details.ai.weaknesses}</h4>
                  <ul>
                    {candidate.jobMatchAnalysis.weaknesses.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            {candidate.jobMatchAnalysis.missingSkills.length > 0 ? (
              <div className="candidate-ai-block">
                <h4>{t.candidates.details.ai.missingSkills}</h4>
                <div className="job-details-skills">
                  {candidate.jobMatchAnalysis.missingSkills.map((skill) => (
                    <Badge key={skill} variant="warning">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
            {candidate.jobMatchAnalysis.interviewQuestions.length > 0 ? (
              <div className="candidate-ai-block">
                <h4>{t.candidates.details.ai.interviewQuestions}</h4>
                <ol>
                  {candidate.jobMatchAnalysis.interviewQuestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        )}
      </Card>

      <div className="candidate-profile-grid">
        <Card title={t.candidates.details.resume.title}>
          {!candidate.resume ? (
            <EmptyState title={t.candidates.details.resume.empty} />
          ) : (
            <div className="candidate-resume">
              <a
                href={details.resumeDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="candidates-name-link"
              >
                {t.candidates.details.resume.download}
              </a>
              <iframe
                src={details.resumeDownloadUrl}
                title={candidate.resume.fileName}
                className="candidate-resume-frame"
              />
            </div>
          )}
        </Card>

        <Card title={t.candidates.details.profile.title}>
          <InfoRow label={t.candidates.details.profile.email} value={candidate.email} />
          <InfoRow label={t.candidates.details.profile.phone} value={candidate.phone} />
          <InfoRow
            label={t.candidates.details.profile.currentPosition}
            value={candidate.currentPosition ?? t.candidates.details.emptyValue}
          />
          <InfoRow
            label={t.candidates.details.profile.yearsExperience}
            value={
              candidate.yearsExperience === null
                ? t.candidates.details.emptyValue
                : String(candidate.yearsExperience)
            }
          />
          <InfoRow
            label={t.candidates.details.profile.education}
            value={candidate.education ?? t.candidates.details.emptyValue}
          />
          {candidate.skills.length > 0 ? (
            <div className="candidate-profile-skills">
              <span>{t.candidates.details.profile.skills}</span>
              <div className="job-details-skills">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="info">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {candidate.experience ? (
            <div className="candidate-profile-text-block">
              <span>{t.candidates.details.profile.experience}</span>
              <p>{candidate.experience}</p>
            </div>
          ) : null}
          {(candidate.linkedin || candidate.portfolio || candidate.website) ? (
            <div className="candidate-profile-links">
              <span>{t.candidates.details.profile.links}</span>
              <div className="candidate-profile-links-list">
                {candidate.linkedin ? (
                  <a href={candidate.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                ) : null}
                {candidate.portfolio ? (
                  <a href={candidate.portfolio} target="_blank" rel="noreferrer">
                    Portfolio
                  </a>
                ) : null}
                {candidate.website ? (
                  <a href={candidate.website} target="_blank" rel="noreferrer">
                    Website
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </Card>
      </div>

      <Card title={t.candidates.details.interviews.title}>
        {candidate.interviews.length === 0 ? (
          <EmptyState title={t.candidates.details.interviews.empty} />
        ) : (
          <div className="candidate-interviews-list">
            {candidate.interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onEdit={() => details.openEditInterview(interview)}
                onCancel={() => details.requestCancelInterview(interview.id)}
                onComplete={() => details.requestCompleteInterview(interview.id)}
              />
            ))}
          </div>
        )}
      </Card>

      <Card title={t.candidates.details.notes.title}>
        <Textarea
          value={details.noteDraft}
          onChange={(event) => details.setNoteDraft(event.target.value)}
          placeholder={t.candidates.details.notes.placeholder}
          maxLength={5000}
        />
        <div className="candidate-notes-add-actions">
          <LoadingButton
            type="button"
            loading={details.addingNote}
            loadingLabel={t.candidates.details.notes.adding}
            disabled={!details.noteDraft.trim()}
            onClick={() => void details.addNote()}
          >
            {t.candidates.details.notes.add}
          </LoadingButton>
        </div>
        {candidate.notes.length === 0 ? (
          <EmptyState title={t.candidates.details.notes.empty} />
        ) : (
          <div className="candidate-notes-list">
            {candidate.notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                editing={details.editingNoteId === note.id}
                editingBody={details.editingNoteBody}
                loading={details.noteActionLoading}
                locale={locale}
                onStartEdit={() => details.startEditNote(note)}
                onCancelEdit={details.cancelEditNote}
                onChangeEditingBody={details.setEditingNoteBody}
                onSaveEdit={() => void details.saveEditNote()}
                onDelete={() => details.requestDeleteNote(note.id)}
              />
            ))}
          </div>
        )}
      </Card>

      <Card title={t.candidates.details.timeline.title}>
        {candidate.timeline.length === 0 ? (
          <EmptyState title={t.candidates.details.timeline.empty} />
        ) : (
          <ol className="candidate-timeline">
            {candidate.timeline.map((event) => (
              <li key={event.id} className="candidate-timeline-item">
                <span className="candidate-timeline-marker" aria-hidden />
                <div>
                  <p className="candidate-timeline-description">
                    {t.candidates.details.timeline.events[event.type]}
                  </p>
                  <p className="candidate-timeline-meta">
                    {formatDateTime(event.createdAt, locale)}
                    {event.actorEmail ? ` · ${event.actorEmail}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <InterviewFormDialog
        open={details.interviewDialog !== null}
        mode={details.interviewDialog?.mode ?? "create"}
        interview={
          details.interviewDialog?.mode === "edit"
            ? details.interviewDialog.interview
            : null
        }
        loading={details.interviewSaving}
        onCancel={details.closeInterviewDialog}
        onSubmit={(input) => void details.saveInterview(input)}
      />

      <ConfirmDialog
        open={details.pendingCancelInterviewId !== null}
        title={t.candidates.interview.cancelDialog.title}
        description={t.candidates.interview.cancelDialog.description}
        confirmLabel={t.candidates.interview.cancelDialog.confirm}
        confirmingLabel={t.candidates.interview.cancelDialog.confirming}
        cancelLabel={t.candidates.interview.cancelDialog.cancel}
        loading={details.interviewActionLoading}
        danger
        onCancel={details.dismissCancelInterview}
        onConfirm={() => void details.confirmCancelInterview()}
      />

      <ConfirmDialog
        open={details.pendingCompleteInterviewId !== null}
        title={t.candidates.interview.completeDialog.title}
        description={t.candidates.interview.completeDialog.description}
        confirmLabel={t.candidates.interview.completeDialog.confirm}
        confirmingLabel={t.candidates.interview.completeDialog.confirming}
        cancelLabel={t.candidates.interview.completeDialog.cancel}
        loading={details.interviewActionLoading}
        onCancel={details.dismissCompleteInterview}
        onConfirm={() => void details.confirmCompleteInterview()}
      >
        <Textarea
          value={details.completeNotes}
          onChange={(event) => details.setCompleteNotes(event.target.value)}
          placeholder={t.candidates.interview.completeDialog.notesPlaceholder}
          maxLength={5000}
          style={{ marginTop: "0.75rem" }}
        />
      </ConfirmDialog>

      <ConfirmDialog
        open={details.pendingDeleteNoteId !== null}
        title={t.candidates.details.notes.deleteConfirm.title}
        description={t.candidates.details.notes.deleteConfirm.description}
        confirmLabel={t.candidates.details.notes.deleteConfirm.confirm}
        confirmingLabel={t.candidates.details.notes.deleteConfirm.confirming}
        cancelLabel={t.candidates.details.notes.deleteConfirm.cancel}
        loading={details.noteActionLoading}
        danger
        onCancel={details.cancelDeleteNote}
        onConfirm={() => void details.confirmDeleteNote()}
      />
    </div>
  );
}

function InterviewCard({
  interview,
  onEdit,
  onCancel,
  onComplete,
}: {
  interview: Interview;
  onEdit: () => void;
  onCancel: () => void;
  onComplete: () => void;
}) {
  const { t, locale } = useI18n();
  const isScheduled = interview.status === "SCHEDULED";

  return (
    <div className="candidate-interview-card">
      <div className="candidate-interview-card-header">
        <div className="candidate-interview-card-title">
          <Badge variant="info">{t.candidates.interview.types[interview.type]}</Badge>
          <Badge variant={interviewStatusVariant(interview.status)}>
            {t.candidates.interview.statuses[interview.status]}
          </Badge>
        </div>
        <span className="candidate-interview-card-date">
          {formatDateTime(interview.scheduledAt, locale)}
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
      {interview.notes ? (
        <p className="candidate-interview-card-notes">{interview.notes}</p>
      ) : null}
      {isScheduled ? (
        <div className="dashboard-row-actions">
          <Button type="button" variant="secondary" onClick={onEdit}>
            {t.candidates.details.interviews.editAction}
          </Button>
          <Button type="button" variant="secondary" onClick={onComplete}>
            {t.candidates.details.interviews.completeAction}
          </Button>
          <Button type="button" variant="danger" onClick={onCancel}>
            {t.candidates.details.interviews.cancelAction}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function NoteItem({
  note,
  editing,
  editingBody,
  loading,
  locale,
  onStartEdit,
  onCancelEdit,
  onChangeEditingBody,
  onSaveEdit,
  onDelete,
}: {
  note: CandidateNote;
  editing: boolean;
  editingBody: string;
  loading: boolean;
  locale: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onChangeEditingBody: (value: string) => void;
  onSaveEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useI18n();

  if (editing) {
    return (
      <div className="candidate-note-item">
        <Textarea
          value={editingBody}
          onChange={(event) => onChangeEditingBody(event.target.value)}
          maxLength={5000}
        />
        <div className="dashboard-row-actions">
          <Button type="button" variant="secondary" onClick={onCancelEdit}>
            {t.candidates.details.notes.cancel}
          </Button>
          <LoadingButton
            type="button"
            loading={loading}
            disabled={!editingBody.trim()}
            onClick={onSaveEdit}
          >
            {t.candidates.details.notes.save}
          </LoadingButton>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-note-item">
      <p className="candidate-note-body">{note.body}</p>
      <div className="candidate-note-footer">
        <span className="candidate-note-meta">
          {note.authorEmail} · {formatDateTime(note.createdAt, locale)}
          {note.updatedAt !== note.createdAt
            ? ` · ${t.candidates.details.notes.editedLabel}`
            : ""}
        </span>
        <div className="dashboard-row-actions">
          <button type="button" className="candidate-note-action" onClick={onStartEdit}>
            {t.candidates.details.notes.edit}
          </button>
          <button type="button" className="candidate-note-action" onClick={onDelete}>
            {t.candidates.details.notes.delete}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="job-details-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CandidateDetailsSkeleton() {
  return (
    <div className="candidate-profile-layout">
      <Card>
        <Skeleton height={32} width="40%" />
        <Skeleton height={20} width="60%" style={{ marginTop: "0.75rem" }} />
      </Card>
      <Skeleton height={160} />
      <div className="candidate-profile-grid">
        <Skeleton height={220} />
        <Skeleton height={220} />
      </div>
      <Skeleton height={180} />
      <Skeleton height={180} />
    </div>
  );
}

function aiScoreVariant(score: number): "success" | "warning" | "neutral" {
  if (score >= 90) {
    return "success";
  }
  if (score >= 70) {
    return "warning";
  }
  return "neutral";
}

function interviewStatusVariant(
  status: Interview["status"],
): "neutral" | "success" | "warning" | "danger" | "info" {
  if (status === "COMPLETED") {
    return "success";
  }
  if (status === "CANCELLED") {
    return "danger";
  }
  return "info";
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    calendar: locale === "fa" ? "persian" : undefined,
  }).format(new Date(value));
}

function formatDateTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    calendar: locale === "fa" ? "persian" : undefined,
  }).format(new Date(value));
}
