import type { BetaFeedbackResponse } from "@poyino/contracts";
import { Button, EmptyState, Skeleton } from "@poyino/ui";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { formatDate } from "../../../shared/lib/format-date";
import { getAdminFeedback } from "../services/feedback.service";

export function AdminFeedbackDetailsPage() {
  const { t, locale } = useI18n();
  const { responseId = "" } = useParams();
  const [response, setResponse] = useState<BetaFeedbackResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const load = useCallback(async () => {
    if (!responseId) return;
    setStatus("loading");
    try {
      const result = await getAdminFeedback(responseId);
      setResponse(result.response);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [responseId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === "loading") {
    return <Skeleton height="20rem" />;
  }

  if (status === "error" || !response) {
    return (
      <EmptyState title={t.feedback.loadFailed}>
        <Button type="button" onClick={() => void load()}>
          {t.feedback.retry}
        </Button>
      </EmptyState>
    );
  }

  const { answers } = response;

  return (
    <div className="feedback-admin-details">
      <Link to="/admin/feedback" className="feedback-back-link">
        {t.feedback.backToList}
      </Link>
      <header className="feedback-page-header">
        <div>
          <h1>{response.organizationName ?? response.organizationId}</h1>
          <p>
            {t.feedback.submittedBy}:{" "}
            {response.submittedByEmail ?? response.submittedByUserId}
          </p>
          <p>
            {t.feedback.submittedAt}:{" "}
            {formatDate(response.submittedAt, locale, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p>
            {t.feedback.productVersion}: {response.productVersion ?? "—"}
          </p>
        </div>
      </header>

      <dl className="feedback-answer-list">
        <div>
          <dt>{t.feedback.questions.satisfaction}</dt>
          <dd>{answers.satisfaction}/10</dd>
        </div>
        <div>
          <dt>{t.feedback.questions.timeReduction}</dt>
          <dd>{t.feedback.options.timeReduction[answers.timeReduction]}</dd>
        </div>
        <div>
          <dt>{t.feedback.questions.mostValuableFeature}</dt>
          <dd>
            {t.feedback.options.valuableFeature[answers.mostValuableFeature]}
          </dd>
        </div>
        <div>
          <dt>{t.feedback.questions.needsImprovement}</dt>
          <dd>{answers.needsImprovement || "—"}</dd>
        </div>
        <div>
          <dt>{t.feedback.questions.aiRecommendationsHelp}</dt>
          <dd>{t.feedback.options.aiHelp[answers.aiRecommendationsHelp]}</dd>
        </div>
        <div>
          <dt>{t.feedback.questions.confusingAspects}</dt>
          <dd>{answers.confusingAspects || "—"}</dd>
        </div>
        <div>
          <dt>{t.feedback.questions.missingFeature}</dt>
          <dd>{answers.missingFeature || "—"}</dd>
        </div>
        <div>
          <dt>{t.feedback.questions.disappointmentIfGone}</dt>
          <dd>{answers.disappointmentIfGone}/10</dd>
        </div>
        <div>
          <dt>{t.feedback.questions.willingnessToPay}</dt>
          <dd>
            {t.feedback.options.willingnessToPay[answers.willingnessToPay]}
          </dd>
        </div>
        <div>
          <dt>{t.feedback.questions.additionalComments}</dt>
          <dd>{answers.additionalComments || "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
