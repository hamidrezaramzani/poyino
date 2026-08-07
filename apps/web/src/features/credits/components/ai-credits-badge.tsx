import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useCan } from "../../../shared/permissions/can";
import { useAiCredits } from "../hooks/use-ai-credits";

type AiCreditsBadgeProps = {
  compact?: boolean;
  className?: string;
};

export function AiCreditsBadge({
  compact = false,
  className = "",
}: AiCreditsBadgeProps) {
  const { t } = useI18n();
  const canManage = useCan("credits:manage");
  const { status, remaining, exhausted, low, canView } = useAiCredits();

  if (!canView || status === "idle" || status === "error") {
    return null;
  }

  if (status === "loading" || remaining == null) {
    return (
      <span
        className={["ai-credits-badge", "is-loading", className]
          .filter(Boolean)
          .join(" ")}
        aria-busy="true"
      >
        {t.credits.loading}
      </span>
    );
  }

  const tone = exhausted ? "exhausted" : low ? "low" : "ok";
  const label = exhausted
    ? t.credits.exhaustedBadge
    : low
      ? t.credits.lowRemaining.replace("{count}", String(remaining))
      : t.credits.remaining.replace("{count}", String(remaining));

  const content = (
    <span
      className={["ai-credits-badge", `is-${tone}`, className]
        .filter(Boolean)
        .join(" ")}
      title={label}
    >
      {compact ? (
        <span className="ai-credits-badge-value">{remaining}</span>
      ) : (
        <span className="ai-credits-badge-label">{label}</span>
      )}
    </span>
  );

  if (canManage) {
    return (
      <Link to="/settings/ai-credits" className="ai-credits-badge-link">
        {content}
      </Link>
    );
  }

  return content;
}
