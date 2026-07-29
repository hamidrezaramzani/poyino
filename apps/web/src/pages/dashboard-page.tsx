import { Card } from "@poyino/ui";
import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n/i18n-provider";

export function DashboardPage() {
  const { t } = useI18n();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <Card title={t.dashboard.title} description={t.dashboard.description}>
        <p style={{ marginTop: 0, color: "#64748b" }}>{t.dashboard.welcome}</p>
        <p style={{ marginBottom: 0 }}>
          <Link to="/">{t.dashboard.homeLink}</Link>
        </p>
      </Card>
    </main>
  );
}
