import { Alert, Button, Card, CopyLinkButton } from "@poyino/ui";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useToast } from "../../../shared/hooks/use-toast";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import type { ApplySuccessState } from "../hooks/use-apply-flow";
import { PublicJobLayout } from "../layouts/public-job-layout";

export function ApplySuccessPage() {
  const { orgSlug, jobId } = useParams<{ orgSlug: string; jobId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const { push } = useToast();
  const state = location.state as ApplySuccessState | null;

  if (!orgSlug || !jobId || !state?.trackingToken || !state.trackingUrl) {
    return (
      <Navigate
        to={orgSlug && jobId ? `/${orgSlug}/jobs/${jobId}` : "/"}
        replace
      />
    );
  }

  const absoluteTrackingUrl = `${window.location.origin}${state.trackingUrl}`;

  return (
    <PublicJobLayout>
      <div className="job-details-layout">
        <Card>
          <div className="job-details-header">
            <div>
              <div className="job-details-title-row">
                <h1>{t.publicJob.success.title}</h1>
              </div>
              <p className="job-details-meta">
                {t.publicJob.success.description}
              </p>
            </div>
          </div>
        </Card>

        <Card title={t.publicJob.success.summaryTitle}>
          <InfoRow
            label={t.publicJob.success.jobTitle}
            value={state.jobTitle}
          />
          <InfoRow
            label={t.publicJob.success.organization}
            value={state.organizationName}
          />
          <InfoRow
            label={t.publicJob.success.submittedAt}
            value={formatDateTime(state.submittedAt, locale)}
          />
        </Card>

        <Card
          title={t.publicJob.success.trackingTitle}
          description={t.publicJob.success.trackingHint}
        >
          <code className="public-job-tracking-url">{absoluteTrackingUrl}</code>
          <div className="job-details-actions">
            <CopyLinkButton
              value={absoluteTrackingUrl}
              label={t.publicJob.success.copyLink}
              copiedLabel={t.publicJob.success.linkCopied}
              onCopied={() => push(t.publicJob.success.linkCopied, "success")}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(state.trackingUrl)}
            >
              {t.publicJob.success.openTracking}
            </Button>
          </div>
        </Card>

        <Alert variant="info" title={t.publicJob.success.nextStepsTitle}>
          <p>{t.publicJob.success.nextSteps}</p>
          <p>{t.publicJob.success.keepSafe}</p>
        </Alert>

        <div className="job-details-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/${orgSlug}/jobs/${jobId}`)}
          >
            {t.publicJob.apply.backToJob}
          </Button>
        </div>
      </div>
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

function formatDateTime(value: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
