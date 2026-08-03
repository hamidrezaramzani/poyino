import type { DashboardCandidateStatus, OrgCandidateListItem } from "@poyino/contracts";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Pagination,
  Select,
  Skeleton,
  Table,
  TableSection,
  type TableColumn,
} from "@poyino/ui";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { formatDate } from "../../../shared/lib/format-date";
import { useOrgCandidates } from "../hooks/use-org-candidates";

const STATUSES: DashboardCandidateStatus[] = [
  "APPLIED",
  "REVIEWING",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_PASSED",
  "REJECTED",
  "HIRED",
];

export function OrgCandidatesView() {
  const { t, locale } = useI18n();
  const list = useOrgCandidates();

  const columns: Array<TableColumn<OrgCandidateListItem>> = [
    {
      key: "fullName",
      header: t.candidates.org.columns.name,
      sortable: true,
      render: (candidate) => (
        <Link
          to={`/jobs/${candidate.jobId}/candidates/${candidate.id}`}
          className="candidates-name-link"
        >
          {candidate.fullName}
        </Link>
      ),
    },
    {
      key: "jobTitle",
      header: t.candidates.org.columns.job,
      render: (candidate) => (
        <Link to={`/jobs/${candidate.jobId}`}>{candidate.jobTitle}</Link>
      ),
    },
    {
      key: "aiScore",
      header: t.candidates.org.columns.aiScore,
      sortable: true,
      render: (candidate) =>
        candidate.aiScore === null ? (
          "—"
        ) : (
          <Badge variant={aiScoreVariant(candidate.aiScore)}>
            {candidate.aiScore}
          </Badge>
        ),
    },
    {
      key: "status",
      header: t.candidates.org.columns.status,
      render: (candidate) => (
        <Badge variant={statusVariant(candidate.status)}>
          {t.dashboard.candidateStatus[candidate.status]}
        </Badge>
      ),
    },
    {
      key: "appliedAt",
      header: t.candidates.org.columns.appliedAt,
      sortable: true,
      render: (candidate) => formatDate(candidate.appliedAt, locale),
    },
    {
      key: "actions",
      header: t.candidates.org.columns.actions,
      render: (candidate) => (
        <Link
          to={`/jobs/${candidate.jobId}/candidates/${candidate.id}`}
          className="candidates-name-link"
        >
          {t.candidates.org.actions.view}
        </Link>
      ),
    },
  ];

  return (
    <TableSection
      title={t.candidates.org.title}
      description={t.candidates.org.description}
    >
      <div className="candidates-filters">
        <Input
          value={list.searchInput}
          onChange={(event) => list.setSearchInput(event.target.value)}
          placeholder={t.candidates.list.searchPlaceholder}
          className="candidates-search-input"
        />
        <Select
          value={list.filters.status}
          onChange={(event) =>
            list.changeStatus(event.target.value as DashboardCandidateStatus | "")
          }
          options={STATUSES.map((value) => ({
            value,
            label: t.dashboard.candidateStatus[value],
          }))}
          placeholder={t.candidates.list.filters.allStatuses}
        />
      </div>

      {list.status === "loading" ? (
        <div className="dashboard-table-skeleton">
          <Skeleton height="2.5rem" />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
        </div>
      ) : list.status === "error" ? (
        <EmptyState title={t.candidates.org.loadFailed}>
          <Button type="button" onClick={() => void list.retry()}>
            {t.candidates.org.retry}
          </Button>
        </EmptyState>
      ) : list.items.length === 0 ? (
        <EmptyState title={t.candidates.org.empty} />
      ) : (
        <>
          <Table
            columns={columns}
            rows={list.items}
            getRowKey={(candidate) => candidate.id}
            caption={t.candidates.org.title}
            sortBy={list.sortBy}
            sortOrder={list.sortOrder}
            onSortChange={list.changeSort}
          />
          <Pagination
            page={list.pagination.page}
            totalPages={list.pagination.totalPages}
            totalItems={list.pagination.totalItems}
            pageSize={list.pagination.pageSize}
            previousLabel={t.candidates.org.pagination.previous}
            nextLabel={t.candidates.org.pagination.next}
            summaryLabel={t.candidates.org.pagination.summary}
            onPageChange={list.changePage}
          />
        </>
      )}
    </TableSection>
  );
}

function aiScoreVariant(score: number): "success" | "warning" | "neutral" {
  if (score >= 90) {
    return "success";
  }
  if (score >= 70) {
    return "warning";
  }
  return "neutral";
}

function statusVariant(
  status: DashboardCandidateStatus,
): "neutral" | "success" | "warning" | "danger" | "info" {
  if (status === "HIRED") {
    return "success";
  }
  if (status === "REJECTED") {
    return "danger";
  }
  if (status === "INTERVIEW_SCHEDULED" || status === "INTERVIEW_PASSED") {
    return "info";
  }
  if (status === "REVIEWING") {
    return "warning";
  }
  return "neutral";
}

