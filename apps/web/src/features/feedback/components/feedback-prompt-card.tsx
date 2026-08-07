import type { BetaFeedbackEligibility } from "@poyino/contracts";
import { Button, EmptyState, Skeleton } from "@poyino/ui";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useCan } from "../../../shared/permissions/can";
import { useAppConfig } from "../../../shared/config/app-config-provider";
import { getFeedbackEligibility } from "../services/feedback.service";

const PROMPT_DISMISS_KEY = "poyino.feedback.prompt.dismissed";

export function FeedbackPromptCard() {
  const { t } = useI18n();
  const { isBeta } = useAppConfig();
  const canSubmit = useCan("feedback:submit");
  const [eligibility, setEligibility] = useState<BetaFeedbackEligibility | null>(
    null,
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [dismissed, setDismissed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(PROMPT_DISMISS_KEY) === "1",
  );

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
    if (!isBeta || !canSubmit) return;
    void load();
  }, [canSubmit, isBeta, load]);

  if (!isBeta || !canSubmit || dismissed) {
    return null;
  }

  if (status === "loading") {
    return <Skeleton height="6rem" borderRadius="1rem" />;
  }

  if (status === "error" || !eligibility) {
    return null;
  }

  if (!eligibility.eligible || eligibility.hasSubmission || !eligibility.canSubmit) {
    return null;
  }

  return (
    <section className="feedback-prompt" aria-label={t.feedback.promptTitle}>
      <div>
        <h2>{t.feedback.promptTitle}</h2>
        <p>{t.feedback.promptBody}</p>
      </div>
      <div className="feedback-prompt-actions">
        <Link to="/dashboard/feedback">
          <Button type="button">{t.feedback.promptCta}</Button>
        </Link>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            window.localStorage.setItem(PROMPT_DISMISS_KEY, "1");
            setDismissed(true);
          }}
        >
          {t.feedback.promptDismiss}
        </Button>
      </div>
    </section>
  );
}

export function FeedbackPromptFallback() {
  const { t } = useI18n();
  return (
    <EmptyState title={t.feedback.loadFailed}>
      <span />
    </EmptyState>
  );
}
