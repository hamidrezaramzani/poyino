import type { AiCreditFeature } from "@poyino/contracts";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Skeleton,
  Table,
  type TableColumn,
} from "@poyino/ui";
import type { AiCreditUsageItem } from "@poyino/contracts";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { formatDate } from "../../../shared/lib/format-date";
import { PermissionGate } from "../../../shared/permissions/permission-gate";
import { AiCreditsBadge } from "../components/ai-credits-badge";
import { useAiCreditsAdmin } from "../hooks/use-ai-credits-admin";

export function AiCreditsSettingsPage() {
  const { t, locale } = useI18n();
  const admin = useAiCreditsAdmin();

  return (
    <PermissionGate permission="credits:manage" fallback="message">
      <div className="ai-credits-settings">
        <Card
          title={t.credits.settingsTitle}
          description={t.credits.settingsDescription}
        >
          {admin.status === "loading" && !admin.credits ? (
            <>
              <Skeleton height={28} width="40%" />
              <Skeleton height={80} style={{ marginTop: "1rem" }} />
            </>
          ) : admin.status === "error" ? (
            <>
              <p>{admin.error ?? t.credits.loadFailed}</p>
              <Button type="button" onClick={admin.retry}>
                {t.settings.retry}
              </Button>
            </>
          ) : (
            <>
              <div className="ai-credits-settings-summary">
                <AiCreditsBadge />
                {admin.credits?.low ? (
                  <p className="ai-credits-warning">
                    {t.credits.lowWarning.replace(
                      "{count}",
                      String(admin.credits.remaining),
                    )}
                  </p>
                ) : null}
                {admin.credits?.remaining === 0 ? (
                  <p className="ai-credits-warning">
                    {t.credits.emptyDescription}
                  </p>
                ) : null}
              </div>

              <h3 className="settings-section-title">
                {t.credits.breakdownTitle}
              </h3>
              {admin.breakdown.length === 0 ? (
                <EmptyState title={t.credits.breakdownEmpty} />
              ) : (
                <ul className="ai-credits-breakdown">
                  {admin.breakdown.map((item) => (
                    <li key={item.feature}>
                      <span>{featureLabel(item.feature, t)}</span>
                      <strong>
                        {t.credits.creditsUsed.replace(
                          "{count}",
                          String(item.creditsUsed),
                        )}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Card>

        <Card title={t.credits.historyTitle}>
          {admin.status === "loading" && admin.items.length === 0 ? (
            <>
              <Skeleton height={44} />
              <Skeleton height={44} style={{ marginTop: "0.75rem" }} />
            </>
          ) : admin.items.length === 0 ? (
            <EmptyState title={t.credits.historyEmpty} />
          ) : (
            <>
              <Table
                columns={historyColumns(t, locale)}
                rows={admin.items}
                getRowKey={(item) => item.id}
              />
              {admin.totalPages > 1 ? (
                <div className="ai-credits-pagination">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={admin.page <= 1}
                    onClick={() => admin.goToPage(admin.page - 1)}
                  >
                    {t.credits.prevPage}
                  </Button>
                  <span>
                    {admin.page} / {admin.totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={admin.page >= admin.totalPages}
                    onClick={() => admin.goToPage(admin.page + 1)}
                  >
                    {t.credits.nextPage}
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </Card>
      </div>
    </PermissionGate>
  );
}

function featureLabel(
  feature: AiCreditFeature,
  t: ReturnType<typeof useI18n>["t"],
) {
  return t.credits.features[feature];
}

function historyColumns(
  t: ReturnType<typeof useI18n>["t"],
  locale: "fa" | "en",
): Array<TableColumn<AiCreditUsageItem>> {
  return [
    {
      key: "createdAt",
      header: t.credits.columns.createdAt,
      render: (item) => formatDate(item.createdAt, locale),
    },
    {
      key: "type",
      header: t.credits.columns.type,
      render: (item) => (
        <Badge>{t.credits.types[item.type] ?? item.type}</Badge>
      ),
    },
    {
      key: "feature",
      header: t.credits.columns.feature,
      render: (item) =>
        item.feature ? t.credits.features[item.feature] : "—",
    },
    {
      key: "amount",
      header: t.credits.columns.amount,
      render: (item) => item.amount,
    },
    {
      key: "balanceAfter",
      header: t.credits.columns.balanceAfter,
      render: (item) => item.balanceAfter,
    },
    {
      key: "user",
      header: t.credits.columns.user,
      render: (item) => item.userEmail ?? t.credits.systemUser,
    },
  ];
}
