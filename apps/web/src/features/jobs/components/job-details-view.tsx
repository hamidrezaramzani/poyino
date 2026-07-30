import type { JobDetails, JobStatus } from "@poyino/contracts";
import {
  Badge,
  Button,
  Card,
  CopyLinkButton,
  EmptyState,
  Skeleton,
  StatisticCard,
} from "@poyino/ui";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import { useJobDetails } from "../hooks/use-job-details";
import { JobConfirmDialog } from "./job-confirm-dialog";

export function JobDetailsView() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { push } = useToast();
  const {
    job,
    status,
    notFound,
    jobId,
    retry,
    pendingAction,
    actionLoading,
    requestAction,
    cancelAction,
    confirmAction,
  } = useJobDetails();

  if (status === "loading") {
    return <JobDetailsSkeleton />;
  }

  if (status === "error" || !job) {
    return (
      <Card title={t.jobs.details.title}>
        <p>{notFound ? t.jobs.details.notFound : t.jobs.details.loadFailed}</p>
        {!notFound ? (
          <Button type="button" onClick={() => void retry()}>
            {t.jobs.details.retry}
          </Button>
        ) : (
          <Button type="button" onClick={() => navigate("/jobs")}>
            {t.jobs.details.backToJobs}
          </Button>
        )}
      </Card>
    );
  }

  const publicAbsoluteUrl = job.publicUrl
    ? `${window.location.origin}${job.publicUrl}`
    : null;
  const canDelete =
    (job.status === "DRAFT" || job.status === "PUBLISHED") &&
    job.statistics.applications === 0;

  return (
    <div className="job-details-layout">
      <Card>
        <div className="job-details-header">
          <div>
            <div className="job-details-title-row">
              <h1>{job.title}</h1>
              <Badge variant={statusVariant(job.status)}>
                {t.dashboard.jobStatus[job.status]}
              </Badge>
              {job.isExpired ? (
                <Badge variant="warning">{t.jobs.details.expiredBadge}</Badge>
              ) : null}
            </div>
            <p className="job-details-meta">
              {[
                job.department,
                t.jobs.create.employmentTypes[job.employmentType],
                t.jobs.create.workplaceTypes[job.workplaceType],
                formatDate(job.createdAt, locale),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {job.expirationDate ? (
              <p className="job-details-expiration">
                {job.isExpired
                  ? t.jobs.details.expiredOn.replace(
                      "{date}",
                      formatDate(
                        `${job.expirationDate}T00:00:00.000Z`,
                        locale,
                      ),
                    )
                  : t.jobs.details.expiresOn.replace(
                      "{date}",
                      formatDate(
                        `${job.expirationDate}T00:00:00.000Z`,
                        locale,
                      ),
                    )}
              </p>
            ) : null}
          </div>
          <div className="job-details-actions">
            {job.status === "DRAFT" ? (
              <Button type="button" onClick={() => requestAction("publish")}>
                {t.jobs.details.actions.publish}
              </Button>
            ) : null}
            {job.status === "PUBLISHED" ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => requestAction("unpublish")}
              >
                {t.jobs.details.actions.unpublish}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/jobs/${jobId}/edit`)}
            >
              {t.jobs.details.actions.edit}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/jobs/${jobId}/candidates`)}
            >
              {t.jobs.details.actions.viewCandidates}
            </Button>
            {canDelete ? (
              <Button
                type="button"
                variant="danger"
                onClick={() => requestAction("delete")}
              >
                {t.jobs.details.actions.delete}
              </Button>
            ) : null}
            {publicAbsoluteUrl && !job.isExpired ? (
              <>
                <CopyLinkButton
                  value={publicAbsoluteUrl}
                  label={t.jobs.details.actions.copyLink}
                  copiedLabel={t.jobs.details.actions.linkCopied}
                  onCopied={() =>
                    push(t.jobs.details.linkCopiedToast, "success")
                  }
                />
                <Button
                  type="button"
                  onClick={() => window.open(publicAbsoluteUrl, "_blank")}
                >
                  {t.jobs.details.actions.viewPublic}
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </Card>

      <div className="job-details-stats">
        <StatisticCard
          label={t.jobs.details.stats.applications}
          value={job.statistics.applications}
        />
        <StatisticCard
          label={t.jobs.details.stats.newApplications}
          value={job.statistics.newApplications}
        />
        <StatisticCard
          label={t.jobs.details.stats.interviews}
          value={job.statistics.interviews}
        />
        <StatisticCard
          label={t.jobs.details.stats.hired}
          value={job.statistics.hired}
        />
      </div>

      <div className="job-details-grid">
        <Card title={t.jobs.details.infoTitle}>
          <InfoRow label={t.jobs.create.titleLabel} value={job.title} />
          <InfoRow
            label={t.jobs.create.departmentLabel}
            value={job.department ?? t.jobs.details.emptyValue}
          />
          <InfoRow
            label={t.jobs.create.employmentTypeLabel}
            value={t.jobs.create.employmentTypes[job.employmentType]}
          />
          <InfoRow
            label={t.jobs.create.workplaceTypeLabel}
            value={t.jobs.create.workplaceTypes[job.workplaceType]}
          />
          <InfoRow
            label={t.jobs.create.locationLabel}
            value={job.location ?? t.jobs.details.emptyValue}
          />
          <InfoRow
            label={t.jobs.details.salaryLabel}
            value={formatSalary(job, t.jobs.details.salaryHidden)}
          />
          <InfoRow
            label={t.jobs.create.positionsLabel}
            value={String(job.positions)}
          />
          <InfoRow
            label={t.jobs.create.expirationDateLabel}
            value={
              job.expirationDate
                ? formatDate(`${job.expirationDate}T00:00:00.000Z`, locale)
                : t.jobs.details.emptyValue
            }
          />
        </Card>

        <Card title={t.jobs.details.candidatesTitle}>
          {job.statistics.applications === 0 ? (
            <EmptyState title={t.jobs.details.noCandidates} />
          ) : (
            <>
              <InfoRow
                label={t.jobs.details.totalCandidates}
                value={String(job.statistics.applications)}
              />
              {job.latestCandidate ? (
                <InfoRow
                  label={t.jobs.details.latestCandidate}
                  value={`${job.latestCandidate.fullName} · ${formatDate(job.latestCandidate.appliedAt, locale)}`}
                />
              ) : null}
              <div className="settings-actions">
                <Button
                  type="button"
                  onClick={() => navigate(`/jobs/${jobId}/candidates`)}
                >
                  {t.jobs.details.actions.viewAllCandidates}
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>

      <Card title={t.jobs.create.descriptionSection}>
        <RichSection
          title={t.jobs.create.descriptionLabel}
          html={job.description}
        />
        <RichSection
          title={t.jobs.create.responsibilitiesLabel}
          html={job.responsibilities}
          empty={t.jobs.details.emptyValue}
        />
        <RichSection
          title={t.jobs.create.requirementsLabel}
          html={job.requirements}
          empty={t.jobs.details.emptyValue}
        />
        <RichSection
          title={t.jobs.create.benefitsLabel}
          html={job.benefits}
          empty={t.jobs.details.emptyValue}
        />
      </Card>

      <Card title={t.jobs.create.skillsSection}>
        {job.skills.length === 0 ? (
          <p className="create-job-hint">{t.jobs.details.emptyValue}</p>
        ) : (
          <div className="job-details-skills">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="info">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {job.status === "PUBLISHED" && publicAbsoluteUrl ? (
        <Card title={t.jobs.details.publicTitle}>
          <InfoRow label={t.jobs.details.publicUrl} value={publicAbsoluteUrl} />
          <InfoRow
            label={t.jobs.details.publishedAt}
            value={
              job.publishedAt
                ? formatDate(job.publishedAt, locale)
                : t.jobs.details.emptyValue
            }
          />
        </Card>
      ) : null}

      <JobConfirmDialog
        open={pendingAction === "publish"}
        title={t.jobs.details.publish.title}
        description={t.jobs.details.publish.description}
        confirmLabel={t.jobs.details.publish.confirm}
        confirmingLabel={t.jobs.details.publish.confirming}
        cancelLabel={t.jobs.details.publish.cancel}
        loading={actionLoading}
        onCancel={cancelAction}
        onConfirm={() => void confirmAction()}
      />
      <JobConfirmDialog
        open={pendingAction === "unpublish"}
        title={t.jobs.details.unpublish.title}
        description={t.jobs.details.unpublish.description}
        confirmLabel={t.jobs.details.unpublish.confirm}
        confirmingLabel={t.jobs.details.unpublish.confirming}
        cancelLabel={t.jobs.details.unpublish.cancel}
        loading={actionLoading}
        onCancel={cancelAction}
        onConfirm={() => void confirmAction()}
      />
      <JobConfirmDialog
        open={pendingAction === "delete"}
        title={t.jobs.details.delete.title}
        description={t.jobs.details.delete.description}
        confirmLabel={t.jobs.details.delete.confirm}
        confirmingLabel={t.jobs.details.delete.confirming}
        cancelLabel={t.jobs.details.delete.cancel}
        loading={actionLoading}
        danger
        onCancel={cancelAction}
        onConfirm={() => void confirmAction()}
      />
    </div>
  );
}

function JobDetailsSkeleton() {
  return (
    <div className="job-details-layout">
      <Card>
        <Skeleton height={32} width="60%" />
        <Skeleton height={20} width="40%" style={{ marginTop: "0.75rem" }} />
      </Card>
      <div className="job-details-stats">
        <Skeleton height={110} />
        <Skeleton height={110} />
        <Skeleton height={110} />
        <Skeleton height={110} />
      </div>
      <Skeleton height={220} />
      <Skeleton height={180} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="job-details-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function RichSection({
  title,
  html,
  empty,
}: {
  title: string;
  html: string | null;
  empty?: string;
}) {
  if (!html) {
    return (
      <div className="job-details-rich-section">
        <h3>{title}</h3>
        <p className="create-job-hint">{empty}</p>
      </div>
    );
  }

  return (
    <div className="job-details-rich-section">
      <h3>{title}</h3>
      <div
        className="job-details-rich-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function statusVariant(status: JobStatus) {
  if (status === "PUBLISHED") {
    return "success" as const;
  }
  if (status === "ARCHIVED") {
    return "neutral" as const;
  }
  return "warning" as const;
}

function formatSalary(job: JobDetails, hiddenLabel: string) {
  if (!job.salaryVisible) {
    return hiddenLabel;
  }
  if (job.salaryMin == null && job.salaryMax == null) {
    return "—";
  }
  if (job.salaryMin != null && job.salaryMax != null) {
    return `${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()} ${job.currency}`;
  }
  if (job.salaryMin != null) {
    return `${job.salaryMin.toLocaleString()}+ ${job.currency}`;
  }
  return `≤ ${job.salaryMax!.toLocaleString()} ${job.currency}`;
}

function formatDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
