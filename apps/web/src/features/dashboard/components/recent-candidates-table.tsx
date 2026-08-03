import type {
  DashboardCandidateStatus,
  DashboardRecentCandidate,
} from "@poyino/contracts";
import {
  Avatar,
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

type RecentCandidatesTableProps = {
  candidates: DashboardRecentCandidate[];
  loading: boolean;
};

export function RecentCandidatesTable({
  candidates,
  loading,
}: RecentCandidatesTableProps) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  const columns: Array<TableColumn<DashboardRecentCandidate>> = [
    {
      key: "fullName",
      header: t.dashboard.candidates.columns.name,
      render: (candidate) => (
        <Link
          to={`/jobs/${candidate.jobId}/candidates/${candidate.id}`}
          className="dashboard-candidate-name"
        >
          <Avatar name={candidate.fullName} size={32} />
          <span>{candidate.fullName}</span>
        </Link>
      ),
    },
    {
      key: "jobTitle",
      header: t.dashboard.candidates.columns.job,
      render: (candidate) => (
        <Link to={`/jobs/${candidate.jobId}`}>{candidate.jobTitle}</Link>
      ),
    },
    {
      key: "aiScore",
      header: t.dashboard.candidates.columns.aiScore,
      render: (candidate) =>
        candidate.aiScore === null ? (
          <span className="dashboard-analyzing">
            {t.dashboard.candidates.analyzing}
          </span>
        ) : (
          <Badge variant={aiScoreVariant(candidate.aiScore)}>
            {candidate.aiScore}
          </Badge>
        ),
    },
    {
      key: "status",
      header: t.dashboard.candidates.columns.status,
      render: (candidate) => (
        <Badge variant={candidateStatusVariant(candidate.status)}>
          {t.dashboard.candidateStatus[candidate.status]}
        </Badge>
      ),
    },
    {
      key: "submittedAt",
      header: t.dashboard.candidates.columns.appliedAt,
      render: (candidate) => formatDate(candidate.submittedAt, locale),
    },
    {
      key: "actions",
      header: t.dashboard.candidates.columns.actions,
      render: (candidate) => (
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            navigate(`/jobs/${candidate.jobId}/candidates/${candidate.id}`)
          }
          style={{ padding: "0.45rem 0.75rem", fontSize: "0.85rem" }}
        >
          {t.dashboard.candidates.view}
        </Button>
      ),
    },
  ];

  return (
    <TableSection
      title={t.dashboard.candidates.title}
      description={t.dashboard.candidates.description}
      actions={
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/candidates")}
        >
          {t.dashboard.candidates.viewAll}
        </Button>
      }
    >
      {loading ? (
        <div className="dashboard-table-skeleton">
          <Skeleton height="2.5rem" />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
          <Skeleton height="3rem" style={{ marginTop: "0.5rem" }} />
        </div>
      ) : candidates.length === 0 ? (
        <EmptyState title={t.dashboard.candidates.empty} />
      ) : (
        <Table
          columns={columns}
          rows={candidates}
          getRowKey={(candidate) => candidate.id}
          caption={t.dashboard.candidates.title}
        />
      )}
    </TableSection>
  );
}

function aiScoreVariant(
  score: number,
): "success" | "warning" | "danger" {
  if (score >= 80) {
    return "success";
  }
  if (score >= 60) {
    return "warning";
  }
  return "danger";
}

function candidateStatusVariant(
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

