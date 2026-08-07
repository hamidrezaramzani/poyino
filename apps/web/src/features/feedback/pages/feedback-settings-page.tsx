import type { BetaFeedbackEligibility } from "@poyino/contracts";
import { Button, EmptyState, Skeleton } from "@poyino/ui";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useCan } from "../../../shared/permissions/can";
import { useAppConfig } from "../../../shared/config/app-config-provider";
import { getFeedbackEligibility } from "../services/feedback.service";
import { formatDate } from "../../../shared/lib/format-date";

export function FeedbackSettingsPage() {
  const { t, locale } = useI18n();
  const { isBeta } = useAppConfig();
  const canSubmit = useCan("feedback:submit");
  const [eligibility, setEligibility] = useState<BetaFeedbackEligibility | null>(
    null,
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await getFeedbackEligibility();
      setEligibility(response.eligibility);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!isBeta) {
    return (
      <EmptyState title={t.feedback.notEligibleTitle}>
        <p>{t.feedback.notEligibleBody}</p>
      </EmptyState>
    );
  }

  if (status === "loading") {
    return <Skeleton height="8rem" />;
  }

  if (status === "error" || !eligibility) {
    return (
      <EmptyState title={t.feedback.loadFailed}>
        <Button type="button" onClick={() => void load()}>
          {t.feedback.retry}
        </Button>
      </EmptyState>
    );
  }

  const ctaLabel = eligibility.hasSubmission
    ? t.feedback.updateSurvey
    : t.feedback.openSurvey;

  return (
    <div className="feedback-settings">
      <h2>{t.feedback.title}</h2>
      <p>{t.feedback.description}</p>
      {eligibility.hasSubmission && eligibility.submission ? (
        <p className="feedback-settings-meta">
          {t.feedback.submittedAt}:{" "}
          {formatDate(eligibility.submission.updatedAt, locale, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      ) : null}
      {!eligibility.eligible ? (
        <p>{t.feedback.notEligibleBody}</p>
      ) : canSubmit && (eligibility.canSubmit || eligibility.canUpdate) ? (
        <Link to="/dashboard/feedback">
          <Button type="button">{ctaLabel}</Button>
        </Link>
      ) : (
        <p>{t.feedback.notEligibleBody}</p>
      )}
    </div>
  );
}
