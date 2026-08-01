import type { ApplicationStatus, TrackingTimelineEvent } from "@poyino/contracts";
import { Card } from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";

type ApplicationTimelineProps = {
  currentStatus: ApplicationStatus;
  timeline: TrackingTimelineEvent[];
  timezone: string;
};

const STEP_ORDER: Array<{
  key: string;
  match: ApplicationStatus[];
}> = [
  { key: "APPLIED", match: ["APPLIED"] },
  { key: "REVIEWING", match: ["REVIEWING"] },
  { key: "INTERVIEW_SCHEDULED", match: ["INTERVIEW_SCHEDULED"] },
  { key: "INTERVIEW_PASSED", match: ["INTERVIEW_PASSED"] },
  { key: "FINAL", match: ["HIRED", "REJECTED"] },
];

export function ApplicationTimeline({
  currentStatus,
  timeline,
  timezone,
}: ApplicationTimelineProps) {
  const { t, locale } = useI18n();
  const currentIndex = STEP_ORDER.findIndex((step) =>
    step.match.includes(currentStatus),
  );

  return (
    <Card title={t.publicJob.tracking.timelineTitle}>
      <ol className="public-job-timeline">
        {STEP_ORDER.map((step, index) => {
          const event = timeline.find((item) => step.match.includes(item.status));
          const isComplete = index <= currentIndex || Boolean(event);
          const isCurrent = index === currentIndex;
          const label =
            step.key === "FINAL"
              ? t.publicJob.tracking.timelineSteps.FINAL
              : t.publicJob.tracking.timelineSteps[
                  step.key as Exclude<keyof typeof t.publicJob.tracking.timelineSteps, "FINAL">
                ];

          return (
            <li
              key={step.key}
              className={`public-job-timeline-item${isComplete ? " is-complete" : ""}${isCurrent ? " is-current" : ""}`}
            >
              <div className="public-job-timeline-marker" aria-hidden />
              <div>
                <strong>{label}</strong>
                {event ? (
                  <p className="job-details-meta">
                    {formatDateTime(event.createdAt, locale, timezone)}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function formatDateTime(value: string, locale: string, timeZone: string) {
  try {
    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone,
    }).format(new Date(value));
  } catch {
    return value;
  }
}
