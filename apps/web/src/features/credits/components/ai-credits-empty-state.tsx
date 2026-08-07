import { EmptyState } from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";

type AiCreditsEmptyStateProps = {
  className?: string;
};

export function AiCreditsEmptyState({
  className = "",
}: AiCreditsEmptyStateProps) {
  const { t } = useI18n();

  return (
    <div className={["ai-credits-empty", className].filter(Boolean).join(" ")}>
      <EmptyState
        title={t.credits.emptyTitle}
        description={t.credits.emptyDescription}
      />
    </div>
  );
}
