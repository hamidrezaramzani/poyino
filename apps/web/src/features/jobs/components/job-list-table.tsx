import type { JobListItem, JobStatus } from "@poyino/contracts";
import {
  Badge,
  Button,
  EmptyState,
  Pagination,
  Skeleton,
  Table,
  TableSection,
  type TableColumn,
} from "@poyino/ui";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useCan } from "../../../shared/permissions/can";
import { useJobList } from "../hooks/use-job-list";

export function JobListTable() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const list = useJobList();
  const canCreate = useCan("jobs:create");
  const canUpdate = useCan("jobs:update");

  const columns: Array<TableColumn<JobListItem>> = [
    {
      key: "title",
      header: t.jobs.list.columns.title,
      sortable: true,
      render: (job) => (
        <Link to={`/jobs/${job.id}`} className="job-list-title-link">
          {job.title}
        </Link>
      ),
    },
    {
      key: "status",
      header: t.jobs.list.columns.status,
      sortable: true,
      render: (job) => (
        <div className="job-list-status-cell">
          <Badge variant={statusVariant(job.status)}>
            {t.dashboard.jobStatus[job.status]}
          </Badge>
          {job.isExpired ? (
            <Badge variant="warning">{t.jobs.details.expiredBadge}</Badge>
          ) : null}
        </div>
      ),
    },
    {
      key: "candidateCount",
      header: t.jobs.list.columns.candidateCount,
      sortable: true,
      render: (job) => job.candidateCount,
    },
    {
      key: "createdAt",
      header: t.jobs.list.columns.createdAt,
      sortable: true,
      render: (job) => formatDate(job.createdAt, locale),
    },
    {
      key: "actions",
      header: t.jobs.list.columns.actions,
      render: (job) => (
        <div className="dashboard-row-actions">
          <Link to={`/jobs/${job.id}`}>{t.jobs.list.actions.details}</Link>
          {canUpdate ? (
            <Link to={`/jobs/${job.id}/edit`}>{t.jobs.list.actions.edit}</Link>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <TableSection
      title={t.jobs.list.title}
      description={t.jobs.list.description}
      actions={
        canCreate ? (
          <Button type="button" onClick={() => navigate("/jobs/create")}>
            {t.jobs.list.create}
          </Button>
        ) : undefined
      }
    >
      {list.status === "loading" ? (
        <div className="dashboard-table-skeleton">
          <Skeleton height="2.5rem" />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
        </div>
      ) : list.status === "error" ? (
        <EmptyState title={t.jobs.list.loadFailed}>
          <Button type="button" onClick={() => void list.retry()}>
            {t.jobs.list.retry}
          </Button>
        </EmptyState>
      ) : list.jobs.length === 0 ? (
        <EmptyState title={t.jobs.list.empty}>
          {canCreate ? (
            <Button type="button" onClick={() => navigate("/jobs/create")}>
              {t.jobs.list.create}
            </Button>
          ) : null}
        </EmptyState>
      ) : (
        <>
          <Table
            columns={columns}
            rows={list.jobs}
            getRowKey={(job) => job.id}
            caption={t.jobs.list.title}
            sortBy={list.sortBy}
            sortOrder={list.sortOrder}
            onSortChange={list.changeSort}
          />
          <Pagination
            page={list.pagination.page}
            totalPages={list.pagination.totalPages}
            totalItems={list.pagination.totalItems}
            pageSize={list.pagination.pageSize}
            previousLabel={t.jobs.list.pagination.previous}
            nextLabel={t.jobs.list.pagination.next}
            summaryLabel={t.jobs.list.pagination.summary}
            onPageChange={list.changePage}
          />
        </>
      )}
    </TableSection>
  );
}

function statusVariant(
  status: JobStatus,
): "neutral" | "success" | "warning" | "info" {
  if (status === "PUBLISHED") {
    return "success";
  }
  if (status === "DRAFT") {
    return "warning";
  }
  return "neutral";
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
