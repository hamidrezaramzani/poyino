import type { Interview, InterviewResult } from "@poyino/contracts";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  FormField,
  LoadingButton,
  Select,
  Skeleton,
  SkeletonText,
  Textarea,
} from "@poyino/ui";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { formatDateTime } from "../../../shared/lib/format-date";
import { InterviewFormDialog } from "../../candidates/components/interview-form-dialog";
import { ConfirmDialog } from "../../candidates/components/confirm-dialog";
import { useInterviewProcess } from "../hooks/use-interview-process";


function statusVariant(status: Interview["status"]) {
  if (status === "COMPLETED") return "success" as const;
  if (status === "CANCELLED" || status === "NO_SHOW") return "danger" as const;
  if (status === "IN_PROGRESS") return "warning" as const;
  return "info" as const;
}

export function InterviewProcessPage() {
  const { t, locale } = useI18n();
  const details = useInterviewProcess();

  if (details.status === "loading") {
    return (
      <div className="interview-process-page">
        <Card>
          <Skeleton height="2rem" width="40%" />
          <SkeletonText lines={5} style={{ marginTop: "1rem" }} />
        </Card>
      </div>
    );
  }

  if (details.status === "error" || !details.process) {
    return (
      <Card>
        <EmptyState title={t.candidates.interviewsModule.process.loadFailed}>
          <Button type="button" onClick={() => void details.retry()}>
            {t.candidates.interviewsModule.process.retry}
          </Button>
        </EmptyState>
      </Card>
    );
  }

  const process = details.process;
  const canDecide =
    process.status === "INTERVIEWING" || process.status === "PASSED";

  return (
    <div className="interview-process-page">
      <div className="interview-process-header">
        <div>
          <Link
            to={`/jobs/${details.jobId}/candidates/${details.candidateId}`}
            className="dashboard-back-link"
          >
            {t.candidates.interviewsModule.process.backToProfile}
          </Link>
          <h1>{t.candidates.interviewsModule.process.title}</h1>
          <Badge variant="info">
            {t.candidates.interview.processStatuses[process.status]}
          </Badge>
        </div>
        <div className="dashboard-row-actions">
          <Button type="button" onClick={details.openCreate}>
            {t.candidates.interviewsModule.process.scheduleStage}
          </Button>
          {canDecide ? (
            <>
              <Button
                type="button"
                variant="secondary"
                disabled={details.actionLoading}
                onClick={() => void details.decide("HIRE")}
              >
                {t.candidates.interviewsModule.process.hire}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={details.actionLoading}
                onClick={() => void details.decide("REJECT")}
              >
                {t.candidates.interviewsModule.process.reject}
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <Card title={t.candidates.details.interviews.title}>
        {process.stages.length === 0 ? (
          <EmptyState title={t.candidates.interviewsModule.process.empty} />
        ) : (
          <div className="candidate-interviews-list">
            {process.stages.map((interview) => (
              <StageCard
                key={interview.id}
                interview={interview}
                locale={locale}
                onEdit={() => details.openEdit(interview)}
                onCancel={() => details.requestCancel(interview.id)}
                onComplete={() => details.requestComplete(interview.id)}
              />
            ))}
          </div>
        )}
      </Card>

      <ExpandableSection
        title={t.candidates.interviewsModule.ai.title}
        defaultOpen={Boolean(details.preparation)}
        badge={details.preparation ? "✓" : undefined}
      >
        {process.stages.length === 0 ? (
          <EmptyState title={t.candidates.interviewsModule.process.empty} />
        ) : (
          <>
            <FormField
              label={t.candidates.interviewsModule.ai.stageLabel}
              htmlFor="interview-ai-stage"
            >
              <Select
                id="interview-ai-stage"
                value={details.selectedInterviewId}
                onChange={(event) =>
                  details.selectInterviewForAi(event.target.value)
                }
                options={process.stages.map((stage) => ({
                  value: stage.id,
                  label: `${stage.name} · ${t.candidates.interview.types[stage.type]}${
                    stage.aiPreparation ? " ✓" : ""
                  }`,
                }))}
              />
            </FormField>
            <FormField
              label={t.candidates.interviewsModule.ai.promptLabel}
              htmlFor="interview-ai-prompt"
            >
              <Textarea
                id="interview-ai-prompt"
                value={details.aiPrompt}
                placeholder={t.candidates.interviewsModule.ai.promptPlaceholder}
                onChange={(event) => details.setAiPrompt(event.target.value)}
                maxLength={2000}
              />
            </FormField>
            <LoadingButton
              type="button"
              loading={details.aiLoading}
              disabled={!details.selectedInterviewId}
              loadingLabel={
                details.aiLoading
                  ? details.preparation
                    ? t.candidates.interviewsModule.ai.regenerating
                    : details.aiStep === 0
                      ? t.candidates.interviewsModule.ai.preparing
                      : details.aiStep === 1
                        ? t.candidates.interviewsModule.ai.generatingQuestions
                        : t.candidates.interviewsModule.ai.buildingChecklist
                  : t.candidates.interviewsModule.ai.generate
              }
              onClick={() => void details.runAi()}
            >
              {details.preparation
                ? t.candidates.interviewsModule.ai.regenerate
                : t.candidates.interviewsModule.ai.generate}
            </LoadingButton>
            {details.aiError ? (
              <p className="interview-ai-error">
                {t.candidates.interviewsModule.ai.failed}{" "}
                <button type="button" onClick={() => void details.runAi()}>
                  {t.candidates.interviewsModule.ai.retry}
                </button>
              </p>
            ) : null}
            {details.preparation ? (
              <div className="interview-ai-results">
                <section>
                  <h3>{t.candidates.details.ai.summary}</h3>
                  <p>{details.preparation.executiveSummary}</p>
                </section>
                <AiList
                  title={t.candidates.interviewsModule.ai.objectives}
                  items={details.preparation.interviewObjectives}
                />
                <AiList
                  title={t.candidates.interviewsModule.ai.technical}
                  items={details.preparation.technicalQuestions}
                />
                <AiList
                  title={t.candidates.interviewsModule.ai.behavioral}
                  items={details.preparation.behavioralQuestions}
                />
                <AiList
                  title={t.candidates.interviewsModule.ai.followUp}
                  items={details.preparation.followUpQuestions}
                />
                <AiList
                  title={t.candidates.interviewsModule.ai.strengths}
                  items={details.preparation.strengths}
                />
                <AiList
                  title={t.candidates.interviewsModule.ai.weaknesses}
                  items={details.preparation.weaknesses}
                />
                <AiList
                  title={t.candidates.interviewsModule.ai.missingSkills}
                  items={details.preparation.missingSkills}
                />
                <section>
                  <h3>{t.candidates.interviewsModule.ai.checklist}</h3>
                  <ul>
                    {details.preparation.evaluationChecklist.map((item) => (
                      <li key={item.label}>
                        <strong>{item.label}</strong>
                        <p>{item.explanation}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            ) : null}
          </>
        )}
      </ExpandableSection>

      <ExpandableSection
        title={t.candidates.interviewsModule.summary.title}
        description={t.candidates.interviewsModule.summary.description}
        defaultOpen={Boolean(details.summary)}
        badge={details.summary ? "✓" : undefined}
      >
        {process.stages.filter((stage) => stage.status === "COMPLETED")
          .length === 0 ? (
          <EmptyState
            title={t.candidates.interviewsModule.summary.emptyCompleted}
          />
        ) : (
          <>
            <LoadingButton
              type="button"
              loading={details.summaryLoading}
              loadingLabel={t.candidates.interviewsModule.summary.generating}
              onClick={() => void details.runSummary()}
            >
              {details.summary
                ? t.candidates.interviewsModule.summary.regenerate
                : t.candidates.interviewsModule.summary.generate}
            </LoadingButton>
            {details.summaryError ? (
              <p className="interview-ai-error">
                {t.candidates.interviewsModule.summary.failed}{" "}
                <button type="button" onClick={() => void details.runSummary()}>
                  {t.candidates.interviewsModule.summary.retry}
                </button>
              </p>
            ) : null}
            {details.summary ? (
              <div className="interview-ai-results interview-summary-results">
                <section>
                  <h3>
                    {t.candidates.interviewsModule.summary.executiveSummary}
                  </h3>
                  <p>{details.summary.executiveSummary}</p>
                </section>
                <section>
                  <h3>{t.candidates.interviewsModule.summary.timeline}</h3>
                  <ol className="interview-summary-timeline">
                    {details.summary.timelineSummary.map((item) => (
                      <li key={`${item.interviewName}-${item.interviewType}`}>
                        <strong>
                          {item.interviewName}
                          {item.interviewType ? ` · ${item.interviewType}` : ""}
                        </strong>
                        <p>{item.summary}</p>
                      </li>
                    ))}
                  </ol>
                </section>
                <section>
                  <h3>{t.candidates.interviewsModule.summary.consensus}</h3>
                  <p>{details.summary.consensus}</p>
                </section>
                <AiList
                  title={t.candidates.interviewsModule.summary.strengths}
                  items={details.summary.strengths}
                />
                <AiList
                  title={t.candidates.interviewsModule.summary.weaknesses}
                  items={details.summary.weaknesses}
                />
                <AiList
                  title={t.candidates.interviewsModule.summary.risks}
                  items={details.summary.risks}
                />
                <AiList
                  title={
                    t.candidates.interviewsModule.summary.outstandingQuestions
                  }
                  items={details.summary.outstandingQuestions}
                />
                <section>
                  <h3>
                    {t.candidates.interviewsModule.summary.suggestedNextStep}
                  </h3>
                  <p>{details.summary.suggestedNextStep}</p>
                  <p className="interview-summary-advisory">
                    {t.candidates.interviewsModule.summary.advisoryNote}
                  </p>
                </section>
              </div>
            ) : null}
          </>
        )}
      </ExpandableSection>

      <InterviewFormDialog
        open={details.dialog !== null}
        mode={details.dialog?.mode ?? "create"}
        interview={
          details.dialog?.mode === "edit" ? details.dialog.interview : null
        }
        recruiters={details.recruiters}
        loading={details.saving}
        onCancel={details.closeDialog}
        onSubmit={(input) => void details.saveStage(input)}
      />

      <ConfirmDialog
        open={details.pendingCancelId !== null}
        title={t.candidates.interview.cancelDialog.title}
        description={t.candidates.interview.cancelDialog.description}
        confirmLabel={t.candidates.interview.cancelDialog.confirm}
        confirmingLabel={t.candidates.interview.cancelDialog.confirming}
        cancelLabel={t.candidates.interview.cancelDialog.cancel}
        loading={details.actionLoading}
        onCancel={details.dismissCancel}
        onConfirm={() => void details.confirmCancel()}
      />

      <ConfirmDialog
        open={details.pendingCompleteId !== null}
        title={t.candidates.interview.completeDialog.title}
        description={t.candidates.interview.completeDialog.description}
        confirmLabel={t.candidates.interview.completeDialog.confirm}
        confirmingLabel={t.candidates.interview.completeDialog.confirming}
        cancelLabel={t.candidates.interview.completeDialog.cancel}
        loading={details.actionLoading}
        onCancel={details.dismissComplete}
        onConfirm={() => void details.confirmComplete()}
      >
        <FormField
          label={t.candidates.interview.completeDialog.resultLabel}
          htmlFor="complete-result"
        >
          <Select
            id="complete-result"
            value={details.completeResult}
            onChange={(event) =>
              details.setCompleteResult(event.target.value as InterviewResult)
            }
            options={(["PASSED", "FAILED", "PENDING"] as const).map(
              (value) => ({
                value,
                label: t.candidates.interview.results[value],
              }),
            )}
          />
        </FormField>
        <Textarea
          value={details.completeNotes}
          placeholder={t.candidates.interview.completeDialog.notesPlaceholder}
          onChange={(event) => details.setCompleteNotes(event.target.value)}
          maxLength={5000}
        />
      </ConfirmDialog>
    </div>
  );
}

function StageCard({
  interview,
  locale,
  onEdit,
  onCancel,
  onComplete,
}: {
  interview: Interview;
  locale: string;
  onEdit: () => void;
  onCancel: () => void;
  onComplete: () => void;
}) {
  const { t } = useI18n();
  const editable =
    interview.status === "SCHEDULED" || interview.status === "IN_PROGRESS";

  return (
    <div className="candidate-interview-card">
      <div className="candidate-interview-card-header">
        <div className="candidate-interview-card-title">
          <strong>{interview.name}</strong>
          <Badge variant="info">
            {t.candidates.interview.types[interview.type]}
          </Badge>
          <Badge variant={statusVariant(interview.status)}>
            {t.candidates.interview.statuses[interview.status]}
          </Badge>
        </div>
        <span className="candidate-interview-card-date">
          {formatDateTime(interview.scheduledAt, locale)}
        </span>
      </div>
      {interview.recruiterEmail ? (
        <p className="candidate-interview-card-detail">
          {interview.recruiterEmail}
        </p>
      ) : null}
      {interview.location ? (
        <p className="candidate-interview-card-detail">{interview.location}</p>
      ) : null}
      {interview.meetingUrl ? (
        <a
          href={interview.meetingUrl}
          target="_blank"
          rel="noreferrer"
          className="candidate-interview-card-detail"
        >
          {t.candidates.details.interviews.joinAction}
        </a>
      ) : null}
      {interview.internalNotes ? (
        <p className="candidate-interview-card-notes">
          {interview.internalNotes}
        </p>
      ) : null}
      {interview.candidateNotes ? (
        <p className="candidate-interview-card-notes">
          {interview.candidateNotes}
        </p>
      ) : null}
      {editable ? (
        <div className="dashboard-row-actions">
          <Button type="button" variant="secondary" onClick={onEdit}>
            {t.candidates.details.interviews.editAction}
          </Button>
          <Button type="button" variant="secondary" onClick={onComplete}>
            {t.candidates.details.interviews.completeAction}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t.candidates.details.interviews.cancelAction}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function ExpandableSection({
  title,
  description,
  defaultOpen = false,
  badge,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  badge?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  return (
    <details
      className="interview-expandable-card"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="interview-expandable-summary">
        <span className="interview-expandable-summary-text">
          <span className="interview-expandable-title">{title}</span>
          {badge ? (
            <span className="interview-expandable-badge" aria-hidden="true">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="interview-expandable-chevron" aria-hidden="true" />
      </summary>
      <div className="interview-expandable-body">
        {description ? (
          <p className="dashboard-page-label">{description}</p>
        ) : null}
        {children}
      </div>
    </details>
  );
}

function AiList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
