import type {
  CandidateExperienceLevel,
  CandidateListItem,
  DashboardCandidateStatus,
  ListCandidatesDateRange,
} from "@poyino/contracts";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Pagination,
  Select,
  Skeleton,
  StatisticCard,
  Table,
  TableSection,
  type TableColumn,
} from "@poyino/ui";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useCandidateList } from "../hooks/use-candidate-list";

const EXPERIENCE_LEVELS: CandidateExperienceLevel[] = ["JUNIOR", "MID", "SENIOR"];
const DATE_RANGES: ListCandidatesDateRange[] = [
  "TODAY",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "CUSTOM",
];
const STATUSES: DashboardCandidateStatus[] = [
  "APPLIED",
  "REVIEWING",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_PASSED",
  "REJECTED",
  "HIRED",
];

export function CandidateListView() {
  const { t, locale } = useI18n();
  const list = useCandidateList();

  const columns: Array<TableColumn<CandidateListItem>> = [
    {
      key: "fullName",
      header: t.candidates.list.columns.name,
      sortable: true,
      render: (candidate) => (
        <Link
          to={`/jobs/${list.jobId}/candidates/${candidate.id}`}
          className="candidates-name-link"
        >
          {candidate.fullName}
        </Link>
      ),
    },
    {
      key: "currentPosition",
      header: t.candidates.list.columns.position,
      render: (candidate) => candidate.currentPosition ?? "—",
    },
    {
      key: "aiScore",
      header: t.candidates.list.columns.aiScore,
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
      key: "yearsExperience",
      header: t.candidates.list.columns.experience,
      render: (candidate) =>
        candidate.yearsExperience === null ? "—" : candidate.yearsExperience,
    },
    {
      key: "skills",
      header: t.candidates.list.columns.skills,
      render: (candidate) => (
        <div className="candidates-skill-tags">
          {candidate.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="info">
              {skill}
            </Badge>
          ))}
          {candidate.skills.length > 3 ? (
            <span className="candidates-skill-more">
              +{candidate.skills.length - 3}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "status",
      header: t.candidates.list.columns.status,
      render: (candidate) => (
        <Badge variant={statusVariant(candidate.status)}>
          {t.dashboard.candidateStatus[candidate.status]}
        </Badge>
      ),
    },
    {
      key: "appliedAt",
      header: t.candidates.list.columns.appliedAt,
      sortable: true,
      render: (candidate) => formatDate(candidate.appliedAt, locale),
    },
    {
      key: "actions",
      header: t.candidates.list.columns.actions,
      render: (candidate) => (
        <Link
          to={`/jobs/${list.jobId}/candidates/${candidate.id}`}
          className="candidates-name-link"
        >
          {t.candidates.list.actions.view}
        </Link>
      ),
    },
  ];

  return (
    <div className="candidates-list-layout">
      <div className="candidates-stats-grid">
        <StatisticCard
          label={t.candidates.list.stats.total}
          value={list.stats?.total ?? 0}
          loading={list.status === "loading"}
        />
        <StatisticCard
          label={t.candidates.list.stats.reviewing}
          value={list.stats?.reviewing ?? 0}
          loading={list.status === "loading"}
        />
        <StatisticCard
          label={t.candidates.list.stats.interviewScheduled}
          value={list.stats?.interviewScheduled ?? 0}
          loading={list.status === "loading"}
        />
        <StatisticCard
          label={t.candidates.list.stats.hired}
          value={list.stats?.hired ?? 0}
          loading={list.status === "loading"}
        />
        <StatisticCard
          label={t.candidates.list.stats.rejected}
          value={list.stats?.rejected ?? 0}
          loading={list.status === "loading"}
        />
      </div>

      <TableSection
        title={list.jobTitle || t.candidates.list.title}
        description={t.candidates.list.description}
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
          <Select
            value={list.filters.experienceLevel}
            onChange={(event) =>
              list.changeExperienceLevel(
                event.target.value as CandidateExperienceLevel | "",
              )
            }
            options={EXPERIENCE_LEVELS.map((value) => ({
              value,
              label: t.candidates.list.experienceLevels[value],
            }))}
            placeholder={t.candidates.list.filters.allExperienceLevels}
          />
          <Input
            value={list.filters.education}
            onChange={(event) => list.changeEducation(event.target.value)}
            placeholder={t.candidates.list.filters.educationPlaceholder}
          />
          <Select
            value={list.filters.dateRange}
            onChange={(event) =>
              list.changeDateRange(
                event.target.value as ListCandidatesDateRange | "",
              )
            }
            options={DATE_RANGES.map((value) => ({
              value,
              label: t.candidates.list.dateRanges[value],
            }))}
            placeholder={t.candidates.list.filters.allDateRanges}
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
          <EmptyState title={t.candidates.list.loadFailed}>
            <Button type="button" onClick={() => void list.retry()}>
              {t.candidates.list.retry}
            </Button>
          </EmptyState>
        ) : list.items.length === 0 ? (
          <EmptyState title={t.candidates.list.empty} />
        ) : (
          <>
            <Table
              columns={columns}
              rows={list.items}
              getRowKey={(candidate) => candidate.id}
              caption={t.candidates.list.title}
              sortBy={list.sortBy}
              sortOrder={list.sortOrder}
              onSortChange={list.changeSort}
            />
            <Pagination
              page={list.pagination.page}
              totalPages={list.pagination.totalPages}
              totalItems={list.pagination.totalItems}
              pageSize={list.pagination.pageSize}
              previousLabel={t.candidates.list.pagination.previous}
              nextLabel={t.candidates.list.pagination.next}
              summaryLabel={t.candidates.list.pagination.summary}
              onPageChange={list.changePage}
            />
          </>
        )}
      </TableSection>
    </div>
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

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    calendar: locale === "fa" ? "persian" : undefined,
  }).format(new Date(value));
}
