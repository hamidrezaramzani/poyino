import type {
  CandidateNote,
  DashboardCandidateStatus,
  Interview,
  JobMatchAnalysis,
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
  SkeletonText,
  Textarea,
} from "@poyino/ui";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { formatDate, formatDateTime } from "../../../shared/lib/format-date";
import { useCan } from "../../../shared/permissions/can";
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

const SKILL_GROUP_RULES: Array<{ key: string; patterns: RegExp[] }> = [
  {
    key: "backend",
    patterns: [
      /node/i,
      /python/i,
      /java(?!script)/i,
      /\bgo\b/i,
      /golang/i,
      /rust/i,
      /\.net/i,
      /dotnet/i,
      /django/i,
      /spring/i,
      /rails/i,
      /graphql/i,
      /rest/i,
      /express/i,
      /nestjs/i,
      /fastapi/i,
    ],
  },
  {
    key: "frontend",
    patterns: [
      /react/i,
      /vue/i,
      /angular/i,
      /next\.?js/i,
      /svelte/i,
      /typescript/i,
      /javascript/i,
      /html/i,
      /css/i,
      /tailwind/i,
    ],
  },
  {
    key: "database",
    patterns: [
      /sql/i,
      /postgres/i,
      /mysql/i,
      /mongo/i,
      /redis/i,
      /elasticsearch/i,
      /prisma/i,
    ],
  },
  {
    key: "cloud",
    patterns: [/aws/i, /gcp/i, /azure/i, /cloud/i, /s3/i, /lambda/i],
  },
  {
    key: "devops",
    patterns: [
      /docker/i,
      /kubernetes/i,
      /k8s/i,
      /ci\/?cd/i,
      /terraform/i,
      /jenkins/i,
      /github actions/i,
    ],
  },
  {
    key: "languages",
    patterns: [
      /english/i,
      /persian/i,
      /farsi/i,
      /german/i,
      /french/i,
      /spanish/i,
      /arabic/i,
    ],
  },
];

export function CandidateDetailsView() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const details = useCandidateDetails();
  const canUpdateCandidate = useCan("candidates:update");
  const canScheduleInterview = useCan("interviews:schedule");
  const canGenerateAi = useCan("ai:generate");
  const canCompleteInterview = useCan("interviews:complete");
  const canAddNotes = useCan("interviews:notes");

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
  const match = candidate.jobMatchAnalysis;
  const score = candidate.aiScore ?? match?.matchScore ?? null;
  const aiPending =
    candidate.aiAnalysisStatus === "PENDING" || details.aiRerunLoading;
  const canRerunAi =
    canGenerateAi && !match && !aiPending && !details.aiRerunLoading;
  const recommendation = recommendationFromScore(score);
  const interviewsChronological = [...candidate.interviews].sort(
    (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  );
  const activityChronological = [...candidate.timeline].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const skillGroups = groupSkills(candidate.skills);
  const missing = new Set(
    (match?.missingSkills ?? []).map((item) => item.toLowerCase()),
  );
  const matchedSkillCount = candidate.skills.filter(
    (skill) => !missing.has(skill.toLowerCase()),
  ).length;

  return (
    <div className="candidate-profile-layout candidate-ats-layout">
      {/* Section 1 — Sticky hero */}
      <header className="candidate-ats-hero" aria-label={candidate.fullName}>
        <div className="candidate-ats-hero-main">
          <Avatar name={candidate.fullName} size={56} />
          <div className="candidate-ats-hero-identity">
            <h1>{candidate.fullName}</h1>
            <div className="candidate-ats-hero-meta">
              <Badge variant={statusBadgeVariant(candidate.status)}>
                {t.dashboard.candidateStatus[candidate.status]}
              </Badge>
              {candidate.interviewProcessStatus ? (
                <Badge variant="info">
                  {
                    t.candidates.interview.processStatuses[
                      candidate.interviewProcessStatus
                    ]
                  }
                </Badge>
              ) : null}
              <span>
                <Link to={`/jobs/${jobId}`}>{job.title}</Link>
              </span>
              <span>
                {t.candidates.details.profile.appliedAt}:{" "}
                {formatDate(candidate.appliedAt, locale)}
              </span>
            </div>
          </div>
        </div>

        <div className="candidate-ats-hero-actions" role="toolbar">
          {canUpdateCandidate ? (
            <Select
              aria-label={t.candidates.details.actions.moveStage}
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
          ) : null}
          {canScheduleInterview ? (
            <Button type="button" onClick={details.openCreateInterview}>
              {t.candidates.details.actions.scheduleInterview}
            </Button>
          ) : null}
          {canRerunAi ? (
            <LoadingButton
              type="button"
              variant="secondary"
              loading={details.aiRerunLoading}
              loadingLabel={t.candidates.details.actions.rerunAiAnalyzing}
              onClick={() => void details.rerunAiAnalysis()}
            >
              {t.candidates.details.actions.rerunAiAnalysis}
            </LoadingButton>
          ) : null}
          {canUpdateCandidate && candidate.status !== "REJECTED" ? (
            <Button
              type="button"
              variant="danger"
              disabled={details.statusUpdating}
              onClick={() => void details.changeStatus("REJECTED")}
            >
              {t.candidates.details.actions.reject}
            </Button>
          ) : null}
          {canUpdateCandidate && candidate.status !== "HIRED" ? (
            <Button
              type="button"
              variant="secondary"
              disabled={details.statusUpdating}
              onClick={() => void details.changeStatus("HIRED")}
            >
              {t.candidates.details.actions.hire}
            </Button>
          ) : null}
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
          <Link
            to={`/jobs/${jobId}/candidates/${details.candidateId}/interviews`}
            className="candidates-name-link"
          >
            {t.candidates.details.interviews.manageButton}
          </Link>
        </div>
      </header>

      {/* Section 2 — Dashboard cards */}
      <section aria-labelledby="candidate-dashboard-heading">
        <h2 id="candidate-dashboard-heading" className="candidate-ats-sr-only">
          {t.candidates.details.dashboard.title}
        </h2>
        <div className="candidate-ats-metrics">
          <article className="candidate-ats-metric candidate-ats-metric-score">
            <p className="candidate-ats-metric-label">
              {t.candidates.details.ai.matchScore}
            </p>
            {aiPending ? (
              <div className="candidate-ats-metric-skeleton" aria-busy="true">
                <Skeleton height="2.25rem" width="45%" />
                <Skeleton
                  height="0.9rem"
                  width="70%"
                  style={{ marginTop: "0.65rem" }}
                />
                <p className="candidate-ats-metric-hint">
                  {t.candidates.details.ai.analyzing}
                </p>
              </div>
            ) : (
              <>
                <p className="candidate-ats-metric-value">
                  {score == null
                    ? t.candidates.details.emptyValue
                    : `${score}%`}
                </p>
                <p className="candidate-ats-metric-hint">
                  {t.candidates.details.ai.recommendations[recommendation]}
                </p>
              </>
            )}
          </article>
          <MetricCard
            label={t.candidates.details.dashboard.experience}
            value={
              aiPending && candidate.yearsExperience == null
                ? null
                : candidate.yearsExperience == null
                  ? t.candidates.details.emptyValue
                  : String(candidate.yearsExperience)
            }
            loading={aiPending && candidate.yearsExperience == null}
          />
          <MetricCard
            label={t.candidates.details.dashboard.matchedSkills}
            value={String(matchedSkillCount)}
            loading={aiPending}
          />
          <MetricCard
            label={t.candidates.details.dashboard.interviewCount}
            value={String(candidate.interviews.length)}
          />
          <MetricCard
            label={t.candidates.details.dashboard.currentStage}
            value={
              candidate.interviewProcessStatus
                ? t.candidates.interview.processStatuses[
                    candidate.interviewProcessStatus
                  ]
                : t.dashboard.candidateStatus[candidate.status]
            }
          />
          <MetricCard
            label={t.candidates.details.dashboard.applicationStatus}
            value={t.dashboard.candidateStatus[candidate.status]}
          />
        </div>
      </section>

      {/* Section 3 — AI Summary */}
      <Card title={t.candidates.details.ai.title}>
        {aiPending ? (
          <AiAnalysisSkeleton hint={t.candidates.details.ai.analyzingHint} />
        ) : !match ? (
          <EmptyState
            title={t.candidates.details.ai.empty}
            description={
              canGenerateAi
                ? t.candidates.details.ai.analyzingHint
                : undefined
            }
          >
            {canGenerateAi ? (
              <LoadingButton
                type="button"
                loading={details.aiRerunLoading}
                loadingLabel={t.candidates.details.actions.rerunAiAnalyzing}
                onClick={() => void details.rerunAiAnalysis()}
              >
                {t.candidates.details.actions.rerunAiAnalysis}
              </LoadingButton>
            ) : null}
          </EmptyState>
        ) : (
          <AiSummaryPanel
            match={match}
            recommendation={recommendation}
            score={score}
          />
        )}
      </Card>

      {/* Section 4 — Overview */}
      <Card title={t.candidates.details.profile.title}>
        <div className="candidate-ats-overview">
          <div className="candidate-ats-overview-identity">
            <Avatar name={candidate.fullName} size={72} />
            <div>
              <strong>{candidate.fullName}</strong>
              <p className="candidate-profile-meta">
                {candidate.currentPosition ?? t.candidates.details.emptyValue}
              </p>
            </div>
          </div>
          <div className="candidate-ats-overview-grid">
            <InfoRow
              label={t.candidates.details.profile.email}
              value={candidate.email}
            />
            <InfoRow
              label={t.candidates.details.profile.phone}
              value={candidate.phone}
            />
            <InfoRow
              label={t.candidates.details.profile.yearsExperience}
              value={
                candidate.yearsExperience == null
                  ? t.candidates.details.emptyValue
                  : String(candidate.yearsExperience)
              }
            />
            <InfoRow
              label={t.candidates.details.profile.education}
              value={candidate.education ?? t.candidates.details.emptyValue}
            />
          </div>
          {(candidate.linkedin || candidate.portfolio || candidate.website) ? (
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
          ) : null}
        </div>
      </Card>

      {/* Section 5 — Skills */}
      <Card title={t.candidates.details.profile.skills}>
        {candidate.skills.length === 0 ? (
          <EmptyState title={t.candidates.details.emptyValue} />
        ) : (
          <div className="candidate-ats-skill-groups">
            {skillGroups.map((group) => (
              <div key={group.key} className="candidate-ats-skill-group">
                <h3>{t.candidates.details.skillGroups[group.key]}</h3>
                <div className="job-details-skills">
                  {group.skills.map((skill) => (
                    <Badge key={skill} variant="info">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Section 6 — Resume */}
      <Card title={t.candidates.details.resume.title}>
        {!candidate.resume ? (
          <EmptyState title={t.candidates.details.resume.empty} />
        ) : (
          <div className="candidate-resume">
            <div className="candidate-ats-resume-toolbar">
              <a
                href={details.resumeDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="candidates-name-link"
              >
                {t.candidates.details.resume.download}
              </a>
            </div>
            <iframe
              src={details.resumeDownloadUrl}
              title={candidate.resume.fileName}
              className="candidate-resume-frame"
            />
          </div>
        )}
        {(candidate.experience || candidate.education) ? (
          <div className="candidate-ats-extracted">
            <h3>{t.candidates.details.resume.extractedText}</h3>
            {candidate.experience ? (
              <div className="candidate-profile-text-block">
                <span>{t.candidates.details.profile.experience}</span>
                <p>{candidate.experience}</p>
              </div>
            ) : null}
            {candidate.education ? (
              <div className="candidate-profile-text-block">
                <span>{t.candidates.details.profile.education}</span>
                <p>{candidate.education}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Card>

      {/* Section 7 — HR Notes */}
      <Card title={t.candidates.details.notes.title}>
        {canAddNotes ? (
          <>
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
          </>
        ) : null}
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

      {/* Section 8 — Interview Timeline */}
      <Card title={t.candidates.details.interviews.title}>
        {candidate.interviewProcessStatus ? (
          <p className="candidate-interview-process-status">
            {t.candidates.details.interviews.processStatus}:{" "}
            <Badge variant="info">
              {
                t.candidates.interview.processStatuses[
                  candidate.interviewProcessStatus
                ]
              }
            </Badge>
          </p>
        ) : null}
        {interviewsChronological.length === 0 ? (
          <EmptyState title={t.candidates.details.interviews.empty} />
        ) : (
          <ol className="candidate-ats-interview-timeline">
            {interviewsChronological.map((interview, index) => (
              <li key={interview.id}>
                <ExpandableInterviewCard
                  interview={interview}
                  isLast={index === interviewsChronological.length - 1}
                  onEdit={
                    canScheduleInterview
                      ? () => details.openEditInterview(interview)
                      : undefined
                  }
                  onCancel={
                    canScheduleInterview
                      ? () => details.requestCancelInterview(interview.id)
                      : undefined
                  }
                  onComplete={
                    canCompleteInterview
                      ? () => details.requestCompleteInterview(interview.id)
                      : undefined
                  }
                />
              </li>
            ))}
          </ol>
        )}
      </Card>

      {/* Section 9 — Activity Timeline */}
      <Card title={t.candidates.details.timeline.title}>
        {activityChronological.length === 0 ? (
          <EmptyState title={t.candidates.details.timeline.empty} />
        ) : (
          <ol className="candidate-timeline">
            {activityChronological.map((event) => (
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

function AiSummaryPanel({
  match,
  recommendation,
  score,
}: {
  match: JobMatchAnalysis;
  recommendation: RecommendationKey;
  score: number | null;
}) {
  const { t } = useI18n();

  return (
    <div className="candidate-ai-summary">
      <div className="candidate-ats-recommendation">
        <Badge variant={recommendationBadgeVariant(recommendation)}>
          {t.candidates.details.ai.recommendations[recommendation]}
        </Badge>
        {score != null ? (
          <span className="candidate-ats-recommendation-score">
            {score}%
          </span>
        ) : null}
      </div>
      {match.executiveSummary ? (
        <p className="candidate-ai-summary-text">{match.executiveSummary}</p>
      ) : null}
      <div className="candidate-ai-columns">
        <div>
          <h4>{t.candidates.details.ai.strengths}</h4>
          {match.strengths.length > 0 ? (
            <ul>
              {match.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="candidate-profile-meta">
              {t.candidates.details.emptyValue}
            </p>
          )}
        </div>
        <div>
          <h4>{t.candidates.details.ai.weaknesses}</h4>
          {match.weaknesses.length > 0 ? (
            <ul>
              {match.weaknesses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="candidate-profile-meta">
              {t.candidates.details.emptyValue}
            </p>
          )}
        </div>
      </div>
      <div className="candidate-ai-block">
        <h4>{t.candidates.details.ai.missingSkills}</h4>
        {match.missingSkills.length > 0 ? (
          <div className="job-details-skills">
            {match.missingSkills.map((skill) => (
              <Badge key={skill} variant="warning">
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="candidate-profile-meta">
            {t.candidates.details.emptyValue}
          </p>
        )}
      </div>
      {match.interviewQuestions.length > 0 ? (
        <div className="candidate-ai-block">
          <h4>{t.candidates.details.ai.interviewQuestions}</h4>
          <ol>
            {match.interviewQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

function AiAnalysisSkeleton({ hint }: { hint: string }) {
  return (
    <div className="candidate-ai-summary candidate-ai-summary-skeleton" aria-busy="true">
      <div className="candidate-ats-recommendation">
        <Skeleton height="1.6rem" width="8rem" borderRadius="999px" />
        <Skeleton height="1.25rem" width="3rem" />
      </div>
      <SkeletonText lines={3} style={{ marginTop: "0.75rem" }} />
      <div className="candidate-ai-columns" style={{ marginTop: "1rem" }}>
        <div>
          <Skeleton height="1rem" width="40%" />
          <Skeleton height="0.85rem" width="90%" style={{ marginTop: "0.7rem" }} />
          <Skeleton height="0.85rem" width="80%" style={{ marginTop: "0.45rem" }} />
          <Skeleton height="0.85rem" width="85%" style={{ marginTop: "0.45rem" }} />
        </div>
        <div>
          <Skeleton height="1rem" width="45%" />
          <Skeleton height="0.85rem" width="88%" style={{ marginTop: "0.7rem" }} />
          <Skeleton height="0.85rem" width="75%" style={{ marginTop: "0.45rem" }} />
          <Skeleton height="0.85rem" width="82%" style={{ marginTop: "0.45rem" }} />
        </div>
      </div>
      <div className="candidate-ai-block" style={{ marginTop: "1rem" }}>
        <Skeleton height="1rem" width="50%" />
        <div className="job-details-skills" style={{ marginTop: "0.75rem" }}>
          <Skeleton height="1.6rem" width="4.5rem" borderRadius="999px" />
          <Skeleton height="1.6rem" width="5.5rem" borderRadius="999px" />
          <Skeleton height="1.6rem" width="4rem" borderRadius="999px" />
        </div>
      </div>
      <p className="candidate-ats-metric-hint" style={{ marginTop: "1rem" }}>
        {hint}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  loading = false,
}: {
  label: string;
  value: string | null;
  loading?: boolean;
}) {
  return (
    <article className="candidate-ats-metric">
      <p className="candidate-ats-metric-label">{label}</p>
      {loading ? (
        <Skeleton height="1.5rem" width="40%" style={{ marginTop: "0.35rem" }} />
      ) : (
        <p className="candidate-ats-metric-value candidate-ats-metric-value-sm">
          {value}
        </p>
      )}
    </article>
  );
}

function ExpandableInterviewCard({
  interview,
  isLast,
  onEdit,
  onCancel,
  onComplete,
}: {
  interview: Interview;
  isLast: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
}) {
  const { t, locale } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const editable =
    interview.status === "DRAFT" ||
    interview.status === "SCHEDULED" ||
    interview.status === "WAITING_CANDIDATE_CONFIRMATION" ||
    interview.status === "ACCEPTED" ||
    interview.status === "RESCHEDULE_REQUESTED" ||
    interview.status === "DECLINED" ||
    interview.status === "IN_PROGRESS";
  const hasActions = Boolean(onEdit || onCancel || onComplete);

  return (
    <div className="candidate-ats-interview-step">
      <div className="candidate-ats-interview-rail" aria-hidden>
        <span className="candidate-ats-interview-dot" />
        {!isLast ? <span className="candidate-ats-interview-line" /> : null}
      </div>
      <div className="candidate-interview-card">
        <button
          type="button"
          className="candidate-ats-interview-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          <div className="candidate-interview-card-header">
            <div className="candidate-interview-card-title">
              <strong>{interview.name}</strong>
              <Badge variant="info">
                {t.candidates.interview.types[interview.type]}
              </Badge>
              <Badge variant={interviewStatusVariant(interview.status)}>
                {t.candidates.interview.statuses[interview.status]}
              </Badge>
            </div>
            <span className="candidate-interview-card-date">
              {formatDateTime(interview.scheduledAt, locale)}
            </span>
          </div>
        </button>

        {expanded ? (
          <div className="candidate-ats-interview-expanded">
            {interview.result ? (
              <InfoRow
                label={t.candidates.details.interviews.decision}
                value={t.candidates.interview.results[interview.result]}
              />
            ) : null}
            <InfoRow
              label={t.candidates.details.interviews.statusLabel}
              value={t.candidates.interview.statuses[interview.status]}
            />
            {interview.location ? (
              <p className="candidate-interview-card-detail">
                {interview.location}
              </p>
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
            {interview.internalNotes ? (
              <div className="candidate-profile-text-block">
                <span>{t.candidates.details.interviews.notes}</span>
                <p>{interview.internalNotes}</p>
              </div>
            ) : null}
            {interview.candidateNotes ? (
              <div className="candidate-profile-text-block">
                <span>{t.candidates.details.interviews.candidateNotes}</span>
                <p>{interview.candidateNotes}</p>
              </div>
            ) : null}
            {interview.responseMessage ? (
              <div className="candidate-profile-text-block">
                <span>{t.candidates.details.interviews.response}</span>
                <p>{interview.responseMessage}</p>
              </div>
            ) : null}
            {interview.proposedScheduledAt ? (
              <InfoRow
                label={t.candidates.details.interviews.proposedTime}
                value={formatDateTime(interview.proposedScheduledAt, locale)}
              />
            ) : null}
            {interview.aiPreparation ? (
              <div className="candidate-profile-text-block">
                <span>{t.candidates.details.interviews.summary}</span>
                <p>{interview.aiPreparation.executiveSummary}</p>
              </div>
            ) : null}
            {interview.aiPreparation?.technicalQuestions?.length ||
            interview.aiPreparation?.behavioralQuestions?.length ? (
              <div className="candidate-ai-block">
                <h4>{t.candidates.details.interviews.questions}</h4>
                <ul>
                  {[
                    ...(interview.aiPreparation.technicalQuestions ?? []),
                    ...(interview.aiPreparation.behavioralQuestions ?? []),
                  ]
                    .slice(0, 6)
                    .map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                </ul>
              </div>
            ) : null}
            {editable && hasActions ? (
              <div className="dashboard-row-actions">
                {onEdit ? (
                  <Button type="button" variant="secondary" onClick={onEdit}>
                    {t.candidates.details.interviews.editAction}
                  </Button>
                ) : null}
                {onComplete ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onComplete}
                  >
                    {t.candidates.details.interviews.completeAction}
                  </Button>
                ) : null}
                {onCancel ? (
                  <Button type="button" variant="danger" onClick={onCancel}>
                    {t.candidates.details.interviews.cancelAction}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
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
          <button
            type="button"
            className="candidate-note-action"
            onClick={onStartEdit}
          >
            {t.candidates.details.notes.edit}
          </button>
          <button
            type="button"
            className="candidate-note-action"
            onClick={onDelete}
          >
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
    <div className="candidate-profile-layout candidate-ats-layout">
      <Card>
        <Skeleton height={56} width="50%" />
        <Skeleton height={28} width="70%" style={{ marginTop: "0.85rem" }} />
      </Card>
      <div className="candidate-ats-metrics">
        <Skeleton height={140} />
        <Skeleton height={100} />
        <Skeleton height={100} />
        <Skeleton height={100} />
      </div>
      <Skeleton height={220} />
      <Skeleton height={180} />
    </div>
  );
}

type RecommendationKey =
  | "highlyRecommended"
  | "recommended"
  | "moderate"
  | "notRecommended"
  | "unavailable";

type SkillGroupKey =
  | "backend"
  | "frontend"
  | "database"
  | "cloud"
  | "devops"
  | "languages"
  | "other";

function recommendationFromScore(score: number | null): RecommendationKey {
  if (score == null) return "unavailable";
  if (score >= 80) return "highlyRecommended";
  if (score >= 60) return "recommended";
  if (score >= 40) return "moderate";
  return "notRecommended";
}

function recommendationBadgeVariant(
  key: RecommendationKey,
): "success" | "info" | "warning" | "danger" | "neutral" {
  if (key === "highlyRecommended" || key === "recommended") return "success";
  if (key === "moderate") return "warning";
  if (key === "notRecommended") return "danger";
  return "neutral";
}

function statusBadgeVariant(
  status: DashboardCandidateStatus,
): "success" | "info" | "warning" | "danger" | "neutral" {
  if (status === "HIRED" || status === "INTERVIEW_PASSED") return "success";
  if (status === "REJECTED") return "danger";
  if (status === "INTERVIEW_SCHEDULED") return "warning";
  if (status === "REVIEWING") return "info";
  return "neutral";
}

function interviewStatusVariant(
  status: Interview["status"],
): "neutral" | "success" | "warning" | "danger" | "info" {
  if (status === "COMPLETED" || status === "ACCEPTED") return "success";
  if (
    status === "CANCELLED" ||
    status === "NO_SHOW" ||
    status === "DECLINED"
  ) {
    return "danger";
  }
  if (
    status === "IN_PROGRESS" ||
    status === "RESCHEDULE_REQUESTED" ||
    status === "WAITING_CANDIDATE_CONFIRMATION"
  ) {
    return "warning";
  }
  return "info";
}

function groupSkills(skills: string[]) {
  const buckets = new Map<SkillGroupKey, string[]>();
  for (const skill of skills) {
    const matched = SKILL_GROUP_RULES.find((rule) =>
      rule.patterns.some((pattern) => pattern.test(skill)),
    );
    const key = (matched?.key ?? "other") as SkillGroupKey;
    const list = buckets.get(key) ?? [];
    list.push(skill);
    buckets.set(key, list);
  }
  const order: SkillGroupKey[] = [
    "backend",
    "frontend",
    "database",
    "cloud",
    "devops",
    "languages",
    "other",
  ];
  return order
    .filter((key) => (buckets.get(key)?.length ?? 0) > 0)
    .map((key) => ({ key, skills: buckets.get(key) ?? [] }));
}
