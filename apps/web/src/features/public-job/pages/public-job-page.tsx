import type { PublicJob } from "@poyino/contracts";
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  Skeleton,
  SkeletonText,
} from "@poyino/ui";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { safeFormatDate } from "../../../shared/lib/format-date";
import { usePublicJob } from "../hooks/use-public-job";
import { PublicJobLayout } from "../layouts/public-job-layout";

export function PublicJobPage() {
  const { orgSlug, jobId } = useParams<{ orgSlug: string; jobId: string }>();
  const { t, locale } = useI18n();
  const { status, job, retry } = usePublicJob(orgSlug, jobId);

  useEffect(() => {
    if (!job) {
      document.title = t.publicJob.notFoundTitle;
      return;
    }
    const orgName = job.organization.displayName || job.organization.name;
    document.title = `${job.title} · ${orgName}`;
    const description = stripHtml(job.description).slice(0, 160);
    upsertMeta("description", description);
    upsertMeta("og:title", `${job.title} · ${orgName}`, "property");
    upsertMeta("og:description", description, "property");
  }, [job, t.publicJob.notFoundTitle]);

  return (
    <PublicJobLayout>
      {status === "loading" ? <PublicJobSkeleton /> : null}

      {status === "error" ? (
        <Card>
          <EmptyState title={t.publicJob.loadFailed}>
            <Button type="button" onClick={() => void retry()}>
              {t.publicJob.retry}
            </Button>
          </EmptyState>
        </Card>
      ) : null}

      {status === "not_found" || (status === "ready" && !job) ? (
        <Card>
          <EmptyState
            title={t.publicJob.notFoundTitle}
            description={t.publicJob.notFoundDescription}
          />
        </Card>
      ) : null}

      {status === "ready" && job && orgSlug ? (
        <PublicJobContent job={job} orgSlug={orgSlug} locale={locale} />
      ) : null}
    </PublicJobLayout>
  );
}

function PublicJobContent({
  job,
  orgSlug,
  locale,
}: {
  job: PublicJob;
  orgSlug: string;
  locale: string;
}) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const orgName = job.organization.displayName || job.organization.name;
  const applyPath = `/${orgSlug}/jobs/${job.id}/apply`;

  return (
    <div className="job-details-layout">
      <Card>
        <div className="job-details-header">
          <div>
            <div className="job-details-title-row">
              <h1>{job.title}</h1>
              {job.isExpired ? (
                <Badge variant="warning">{t.jobs.details.expiredBadge}</Badge>
              ) : (
                <Badge variant="success">
                  {t.dashboard.jobStatus.PUBLISHED}
                </Badge>
              )}
            </div>
            <p className="job-details-meta">
              {[
                orgName,
                job.department,
                t.jobs.create.employmentTypes[job.employmentType],
                t.jobs.create.workplaceTypes[job.workplaceType],
                job.location,
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
          {job.acceptingApplications ? (
            <div className="job-details-actions">
              <Button type="button" onClick={() => navigate(applyPath)}>
                {t.publicJob.applyNow}
              </Button>
            </div>
          ) : null}
        </div>
      </Card>

      {job.isExpired ? (
        <Alert variant="error" title={t.publicJob.expiredTitle}>
          {t.publicJob.expiredDescription}
        </Alert>
      ) : null}

      <Card title={t.publicJob.overview}>
        <InfoRow
          label={t.publicJob.employmentType}
          value={t.jobs.create.employmentTypes[job.employmentType]}
        />
        <InfoRow
          label={t.publicJob.workplaceType}
          value={t.jobs.create.workplaceTypes[job.workplaceType]}
        />
        <InfoRow
          label={t.publicJob.department}
          value={job.department || t.publicJob.emptyValue}
        />
        <InfoRow
          label={t.publicJob.location}
          value={job.location || t.publicJob.emptyValue}
        />
        <InfoRow
          label={t.publicJob.positions}
          value={String(job.positions)}
        />
        <InfoRow
          label={t.publicJob.publishedAt}
          value={
            job.publishedAt
              ? formatDate(job.publishedAt, locale)
              : t.publicJob.emptyValue
          }
        />
        <InfoRow
          label={t.publicJob.expirationDate}
          value={
            job.expirationDate
              ? formatDate(`${job.expirationDate}T00:00:00.000Z`, locale)
              : t.publicJob.emptyValue
          }
        />
      </Card>

      <Card title={t.jobs.create.descriptionSection}>
        <RichSection
          title={t.publicJob.description}
          html={job.description}
        />
        <Divider />
        <RichSection
          title={t.publicJob.responsibilities}
          html={job.responsibilities}
          empty={t.publicJob.emptyValue}
        />
        <Divider />
        <RichSection
          title={t.publicJob.requirements}
          html={job.requirements}
          empty={t.publicJob.emptyValue}
        />
        {job.benefits && stripHtml(job.benefits) ? (
          <>
            <Divider />
            <RichSection title={t.publicJob.benefits} html={job.benefits} />
          </>
        ) : null}
      </Card>

      {job.acceptingApplications ? (
        <Card>
          <div className="job-details-actions">
            <Button type="button" onClick={() => navigate(applyPath)}>
              {t.publicJob.applyNow}
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function PublicJobSkeleton() {
  return (
    <div className="job-details-layout">
      <Card>
        <Skeleton height="2rem" width="55%" />
        <Skeleton height="1rem" width="35%" style={{ marginTop: "0.75rem" }} />
      </Card>
      <Card>
        <SkeletonText lines={5} />
      </Card>
      <Card>
        <SkeletonText lines={8} />
      </Card>
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
  if (!html || !stripHtml(html)) {
    if (!empty) {
      return null;
    }
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

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value: string, locale: string) {
  return safeFormatDate(value, locale, { dateStyle: "medium" });
}

function upsertMeta(
  name: string,
  content: string,
  attr: "name" | "property" = "name",
) {
  let element = document.head.querySelector(
    `meta[${attr}="${name}"]`,
  ) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.content = content;
}
