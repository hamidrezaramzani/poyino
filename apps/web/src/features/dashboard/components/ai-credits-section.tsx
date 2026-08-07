import type { DashboardAiCredits } from "@poyino/contracts";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useCan } from "../../../shared/permissions/can";

type AiCreditsSectionProps = {
  aiCredits: DashboardAiCredits | null;
  loading: boolean;
};

export function AiCreditsSection({
  aiCredits,
  loading,
}: AiCreditsSectionProps) {
  const { t } = useI18n();
  const canManage = useCan("credits:manage");

  if (loading && !aiCredits) {
    return (
      <section className="ai-credits-dashboard-card" aria-busy="true">
        <h2 className="dashboard-section-title">{t.credits.dashboardTitle}</h2>
        <p>{t.credits.loading}</p>
      </section>
    );
  }

  if (!aiCredits) {
    return null;
  }

  const exhausted = aiCredits.remaining === 0;
  const message = exhausted
    ? t.credits.emptyDescription
    : aiCredits.low
      ? t.credits.lowRemaining.replace(
          "{count}",
          String(aiCredits.remaining),
        )
      : t.credits.remaining.replace("{count}", String(aiCredits.remaining));

  return (
    <section
      className={[
        "ai-credits-dashboard-card",
        exhausted ? "is-exhausted" : aiCredits.low ? "is-low" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={t.credits.dashboardTitle}
    >
      <h2 className="dashboard-section-title">{t.credits.dashboardTitle}</h2>
      <p className="ai-credits-dashboard-value">{message}</p>
      {canManage ? (
        <Link to="/settings/ai-credits" className="ai-credits-dashboard-link">
          {t.credits.viewUsage}
        </Link>
      ) : null}
    </section>
  );
}
