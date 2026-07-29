import { Alert, Button } from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";

type DashboardErrorStateProps = {
  message?: string;
  onRetry: () => void;
};

export function DashboardErrorState({
  message,
  onRetry,
}: DashboardErrorStateProps) {
  const { t } = useI18n();

  return (
    <Alert variant="error" title={t.dashboard.error.title}>
      <p style={{ margin: "0 0 1rem" }}>
        {message ?? t.dashboard.error.description}
      </p>
      <Button type="button" onClick={onRetry}>
        {t.dashboard.error.retry}
      </Button>
    </Alert>
  );
}
