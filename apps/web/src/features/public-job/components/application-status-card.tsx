import type { ApplicationStatus } from "@poyino/contracts";
import { Alert, Badge, Card } from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { safeFormatDateTime } from "../../../shared/lib/format-date";

type ApplicationStatusCardProps = {
  status: ApplicationStatus;
  updatedAt: string;
  timezone: string;
};

function statusVariant(
  status: ApplicationStatus,
): "neutral" | "info" | "success" | "warning" | "danger" {
  switch (status) {
    case "HIRED":
      return "success";
    case "REJECTED":
      return "danger";
    case "INTERVIEW_SCHEDULED":
    case "INTERVIEW_PASSED":
      return "info";
    case "REVIEWING":
      return "warning";
    default:
      return "neutral";
  }
}

function alertVariant(
  status: ApplicationStatus,
): "info" | "success" | "error" {
  if (status === "HIRED") {
    return "success";
  }
  if (status === "REJECTED") {
    return "error";
  }
  return "info";
}

export function ApplicationStatusCard({
  status,
  updatedAt,
  timezone,
}: ApplicationStatusCardProps) {
  const { t, locale } = useI18n();

  return (
    <Card title={t.publicJob.tracking.statusTitle}>
      <div className="job-details-title-row" style={{ marginBottom: "1rem" }}>
        <Badge variant={statusVariant(status)}>
          {t.publicJob.tracking.statusLabels[status]}
        </Badge>
      </div>
      <Alert variant={alertVariant(status)}>
        {t.publicJob.tracking.statusDescriptions[status]}
      </Alert>
      <p className="job-details-meta">
        {t.publicJob.tracking.lastUpdated}{" "}
        {formatDateTime(updatedAt, locale, timezone)}
      </p>
    </Card>
  );
}

function formatDateTime(value: string, locale: string, timeZone: string) {
  return safeFormatDateTime(value, locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  });
}
