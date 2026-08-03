import { Button, Card, EmptyState, Skeleton, SkeletonText } from "@poyino/ui";
import { useParams } from "react-router-dom";
import { TrackingNotificationsPanel } from "../../notifications/components/tracking-notifications-panel";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { ApplicationStatusCard } from "../components/application-status-card";
import { ApplicationTimeline } from "../components/application-timeline";
import { useTracking } from "../hooks/use-tracking";
import { PublicJobLayout } from "../layouts/public-job-layout";

export function TrackingPage() {
  const { token } = useParams<{ token: string }>();
  const { t } = useI18n();
  const { status, tracking, retry } = useTracking(token);

  return (
    <PublicJobLayout>
      {status === "loading" ? (
        <div className="job-details-layout">
          <Card>
            <Skeleton height="2rem" width="40%" />
            <SkeletonText lines={4} style={{ marginTop: "1rem" }} />
          </Card>
        </div>
      ) : null}

      {status === "error" ? (
        <Card>
          <EmptyState title={t.publicJob.tracking.loadFailed}>
            <Button type="button" onClick={() => void retry()}>
              {t.publicJob.tracking.retry}
            </Button>
          </EmptyState>
        </Card>
      ) : null}

      {status === "not_found" ? (
        <Card>
          <EmptyState
            title={t.publicJob.tracking.notFoundTitle}
            description={t.publicJob.tracking.notFoundDescription}
          />
        </Card>
      ) : null}

      {status === "ready" && tracking && token ? (
        <div className="job-details-layout">
          <Card>
            <div className="job-details-header">
              <div>
                <div className="job-details-title-row">
                  <h1>{t.publicJob.tracking.title}</h1>
                </div>
                <p className="job-details-meta">{tracking.job.title}</p>
              </div>
            </div>
          </Card>

          <ApplicationStatusCard
            status={tracking.status}
            updatedAt={tracking.updatedAt}
            timezone={tracking.timezone}
          />

          <TrackingNotificationsPanel token={token} />

          <ApplicationTimeline
            currentStatus={tracking.status}
            timeline={tracking.timeline}
            timezone={tracking.timezone}
          />

          {tracking.interviews.length > 0 ? (
            <Card title={t.candidates.details.interviews.title}>
              <div className="candidate-interviews-list">
                {tracking.interviews.map((interview) => (
                  <div key={interview.id} className="candidate-interview-card">
                    <div className="candidate-interview-card-header">
                      <div className="candidate-interview-card-title">
                        <strong>{interview.name}</strong>
                        <span>
                          {t.candidates.interview.types[interview.type]}
                        </span>
                        <span>
                          {t.candidates.interview.statuses[interview.status]}
                        </span>
                      </div>
                    </div>
                    {interview.location ? (
                      <p className="candidate-interview-card-detail">
                        {interview.location}
                      </p>
                    ) : null}
                    {interview.meetingUrl ? (
                      <a
                        href={interview.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="candidates-name-link"
                      >
                        {t.candidates.details.interviews.joinAction}
                      </a>
                    ) : null}
                    {interview.candidateNotes ? (
                      <p className="candidate-interview-card-notes">
                        {interview.candidateNotes}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          <Card title={t.publicJob.tracking.jobTitle}>
            <InfoRow
              label={t.publicJob.success.jobTitle}
              value={tracking.job.title}
            />
            <InfoRow
              label={t.publicJob.success.organization}
              value={tracking.job.organizationName}
            />
            <InfoRow
              label={t.publicJob.employmentType}
              value={t.jobs.create.employmentTypes[tracking.job.employmentType]}
            />
            <InfoRow
              label={t.publicJob.workplaceType}
              value={t.jobs.create.workplaceTypes[tracking.job.workplaceType]}
            />
            <InfoRow
              label={t.publicJob.location}
              value={tracking.job.location || t.publicJob.emptyValue}
            />
          </Card>

          <Card title={t.publicJob.tracking.submittedTitle}>
            <InfoRow
              label={t.publicJob.tracking.fullName}
              value={tracking.submitted.fullName}
            />
            <InfoRow
              label={t.publicJob.tracking.email}
              value={tracking.submitted.email}
            />
            <InfoRow
              label={t.publicJob.tracking.phone}
              value={tracking.submitted.phone}
            />
            <InfoRow
              label={t.publicJob.tracking.currentPosition}
              value={
                tracking.submitted.currentPosition || t.publicJob.emptyValue
              }
            />
          </Card>
        </div>
      ) : null}
    </PublicJobLayout>
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
