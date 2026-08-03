import type {
  DashboardJobStatus,
  DashboardRecentJob,
} from "@poyino/contracts";
import {
  Badge,
  Button,
  EmptyState,
  Skeleton,
  Table,
  TableSection,
  type TableColumn,
} from "@poyino/ui";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { formatDate } from "../../../shared/lib/format-date";

type RecentJobsTableProps = {
  jobs: DashboardRecentJob[];
  loading: boolean;
};

export function RecentJobsTable({ jobs, loading }: RecentJobsTableProps) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  const columns: Array<TableColumn<DashboardRecentJob>> = [
    {
      key: "title",
      header: t.dashboard.jobs.columns.title,
      render: (job) => job.title,
    },
    {
      key: "status",
      header: t.dashboard.jobs.columns.status,
      render: (job) => (
        <Badge variant={jobStatusVariant(job.status)}>
          {t.dashboard.jobStatus[job.status]}
        </Badge>
      ),
    },
    {
      key: "publishedAt",
      header: t.dashboard.jobs.columns.publishedAt,
      render: (job) => formatNullableDate(job.publishedAt, locale),
    },
    {
      key: "candidateCount",
      header: t.dashboard.jobs.columns.candidateCount,
      render: (job) => job.candidateCount,
    },
    {
      key: "actions",
      header: t.dashboard.jobs.columns.actions,
      render: (job) => (
        <div className="dashboard-row-actions">
          <Link to={`/jobs/${job.id}`}>{t.dashboard.jobs.view}</Link>
          <Link to={`/jobs/${job.id}/edit`}>{t.dashboard.jobs.edit}</Link>
        </div>
      ),
    },
  ];

  return (
    <TableSection
      title={t.dashboard.jobs.title}
      description={t.dashboard.jobs.description}
    >
      {loading ? (
        <div className="dashboard-table-skeleton">
          <Skeleton height="2.5rem" />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState title={t.dashboard.jobs.empty}>
          <Button type="button" onClick={() => navigate("/jobs/create")}>
            {t.dashboard.jobs.create}
          </Button>
        </EmptyState>
      ) : (
        <Table
          columns={columns}
          rows={jobs}
          getRowKey={(job) => job.id}
          caption={t.dashboard.jobs.title}
        />
      )}
    </TableSection>
  );
}

function jobStatusVariant(
  status: DashboardJobStatus,
): "neutral" | "success" | "warning" | "info" {
  if (status === "PUBLISHED") {
    return "success";
  }
  if (status === "DRAFT") {
    return "warning";
  }
  return "neutral";
}

function formatNullableDate(value: string | null, locale: string) {
  if (!value) {
    return "—";
  }
  return formatDate(value, locale);
}
