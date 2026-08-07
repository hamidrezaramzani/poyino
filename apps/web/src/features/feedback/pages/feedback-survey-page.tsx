import {
  BETA_FEEDBACK_SURVEY_KEY,
  BETA_FEEDBACK_SURVEY_VERSION,
} from "@poyino/contracts";
import type { BetaFeedbackAnswersV1 } from "@poyino/contracts";
import { Button, EmptyState, Skeleton } from "@poyino/ui";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useAppConfig } from "../../../shared/config/app-config-provider";
import { FeedbackSurveyWizard } from "../components/feedback-survey-wizard";
import {
  getFeedbackEligibility,
  submitBetaFeedback,
} from "../services/feedback.service";

export function FeedbackSurveyPage() {
  const { t } = useI18n();
  const { isBeta } = useAppConfig();
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "done">(
    "loading",
  );
  const [submitting, setSubmitting] = useState(false);
  const [initialAnswers, setInitialAnswers] =
    useState<BetaFeedbackAnswersV1 | null>(null);
  const [eligible, setEligible] = useState(false);
  const [canParticipate, setCanParticipate] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await getFeedbackEligibility();
      setEligible(response.eligibility.eligible);
      setCanParticipate(
        response.eligibility.canSubmit || response.eligibility.canUpdate,
      );
      setInitialAnswers(response.eligibility.submission?.answers ?? null);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSubmit(answers: BetaFeedbackAnswersV1) {
    setSubmitting(true);
    try {
      await submitBetaFeedback({
        surveyKey: BETA_FEEDBACK_SURVEY_KEY,
        surveyVersion: BETA_FEEDBACK_SURVEY_VERSION,
        answers,
      });
      setStatus("done");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isBeta) {
    return (
      <EmptyState title={t.feedback.notEligibleTitle}>
        <p>{t.feedback.notEligibleBody}</p>
      </EmptyState>
    );
  }

  if (status === "loading") {
    return (
      <div className="feedback-page">
        <Skeleton height="2rem" width="40%" />
        <Skeleton height="16rem" />
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="feedback-page feedback-thanks">
        <h1>{t.feedback.thankYouTitle}</h1>
        <p>{t.feedback.thankYouBody}</p>
        <Link to="/dashboard">
          <Button type="button">{t.feedback.backToDashboard}</Button>
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <EmptyState title={t.feedback.loadFailed}>
        <Button type="button" onClick={() => void load()}>
          {t.feedback.retry}
        </Button>
      </EmptyState>
    );
  }

  if (!eligible || !canParticipate) {
    return (
      <EmptyState title={t.feedback.notEligibleTitle}>
        <p>{t.feedback.notEligibleBody}</p>
        <Link to="/dashboard">
          <Button type="button" variant="secondary">
            {t.feedback.backToDashboard}
          </Button>
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="feedback-page">
      <header className="feedback-page-header">
        <div>
          <h1>{t.feedback.title}</h1>
          <p>{t.feedback.description}</p>
        </div>
      </header>
      <FeedbackSurveyWizard
        initialAnswers={initialAnswers}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
