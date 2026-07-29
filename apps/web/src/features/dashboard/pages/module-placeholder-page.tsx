import { Card } from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";

type ModulePlaceholderPageProps = {
  title: string;
  description?: string;
};

export function ModulePlaceholderPage({
  title,
  description,
}: ModulePlaceholderPageProps) {
  const { t } = useI18n();

  return (
    <Card title={title} description={description ?? t.dashboard.placeholder}>
      <p style={{ margin: 0, color: "#64748b" }}>{t.dashboard.placeholderHint}</p>
    </Card>
  );
}
