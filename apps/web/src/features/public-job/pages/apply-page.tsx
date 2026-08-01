import {
  Alert,
  Button,
  Card,
  EmptyState,
  Form,
  FormField,
  Input,
  LoadingButton,
  Skeleton,
  Textarea,
} from "@poyino/ui";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { AiProcessingIndicator } from "../components/ai-processing-indicator";
import { ResumeUploadCard } from "../components/resume-upload-card";
import { useApplyFlow } from "../hooks/use-apply-flow";
import { usePublicJob } from "../hooks/use-public-job";
import { PublicJobLayout } from "../layouts/public-job-layout";

export function ApplyPage() {
  const { orgSlug, jobId } = useParams<{ orgSlug: string; jobId: string }>();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { status, job } = usePublicJob(orgSlug, jobId);
  const flow = useApplyFlow(orgSlug, jobId);
  const backPath =
    orgSlug && jobId ? `/${orgSlug}/jobs/${jobId}` : "/";

  return (
    <PublicJobLayout>
      {status === "loading" ? (
        <div className="job-details-layout">
          <Card>
            <Skeleton height="2rem" width="45%" />
            <Skeleton height="1rem" width="30%" style={{ marginTop: "0.75rem" }} />
          </Card>
          <Card>
            <Skeleton height="8rem" />
          </Card>
        </div>
      ) : null}

      {status === "not_found" || status === "error" || !job ? (
        status !== "loading" ? (
          <Card>
            <EmptyState
              title={t.publicJob.notFoundTitle}
              description={
                status === "error"
                  ? t.publicJob.loadFailed
                  : t.publicJob.notFoundDescription
              }
            >
              <Button type="button" onClick={() => navigate(backPath)}>
                {t.publicJob.apply.backToJob}
              </Button>
            </EmptyState>
          </Card>
        ) : null
      ) : !job.acceptingApplications ? (
        <Card>
          <EmptyState
            title={t.publicJob.expiredTitle}
            description={t.publicJob.expiredDescription}
          >
            <Button type="button" onClick={() => navigate(backPath)}>
              {t.publicJob.apply.backToJob}
            </Button>
          </EmptyState>
        </Card>
      ) : (
        <div className="job-details-layout">
          <Card>
            <div className="job-details-header">
              <div>
                <div className="job-details-title-row">
                  <h1>{t.publicJob.apply.title}</h1>
                </div>
                <p className="job-details-meta">{job.title}</p>
                <p className="job-details-meta">
                  {t.publicJob.apply.description}
                </p>
              </div>
              <div className="job-details-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(backPath)}
                >
                  {t.publicJob.apply.backToJob}
                </Button>
              </div>
            </div>
          </Card>

          {flow.step === "upload" || flow.step === "processing" ? (
            <Card title={t.publicJob.apply.uploadStep}>
              <ResumeUploadCard
                fileName={flow.selectedFile?.name ?? null}
                uploadProgress={flow.uploadProgress}
                disabled={
                  flow.step === "processing" || flow.uploadProgress != null
                }
                error={flow.uploadError}
                onFileSelected={flow.onFileSelected}
                onRemove={flow.onRemoveFile}
              />
              {flow.step === "processing" ? (
                <AiProcessingIndicator step={flow.processingPhase} />
              ) : (
                <div className="job-details-actions" style={{ marginTop: "1rem" }}>
                  <Button
                    type="button"
                    disabled={!flow.selectedFile || flow.uploadProgress != null}
                    onClick={() => void flow.startProcessing()}
                  >
                    {t.publicJob.apply.continue}
                  </Button>
                </div>
              )}
            </Card>
          ) : null}

          {flow.step === "review" ? (
            <Card title={t.publicJob.apply.reviewStep}>
              {flow.analysisWarning ? (
                <Alert variant="info">{flow.analysisWarning}</Alert>
              ) : null}

              <Form
                onSubmit={(event) => {
                  event.preventDefault();
                  void flow.onSubmit();
                }}
              >
                <h3 className="public-job-section-title">
                  {t.publicJob.apply.personalTitle}
                </h3>
                <FormField
                  label={t.publicJob.apply.fullName}
                  htmlFor="apply-full-name"
                  error={flow.fieldErrors.fullName}
                  required
                >
                  <Input
                    id="apply-full-name"
                    value={flow.form.fullName}
                    onChange={(event) =>
                      flow.updateField("fullName", event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label={t.publicJob.apply.email}
                  htmlFor="apply-email"
                  error={flow.fieldErrors.email}
                  required
                >
                  <Input
                    id="apply-email"
                    type="email"
                    value={flow.form.email}
                    onChange={(event) =>
                      flow.updateField("email", event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label={t.publicJob.apply.phone}
                  htmlFor="apply-phone"
                  error={flow.fieldErrors.phone}
                  required
                >
                  <Input
                    id="apply-phone"
                    value={flow.form.phone}
                    onChange={(event) =>
                      flow.updateField("phone", event.target.value)
                    }
                  />
                </FormField>

                <h3 className="public-job-section-title">
                  {t.publicJob.apply.professionalTitle}
                </h3>
                <FormField
                  label={t.publicJob.apply.currentPosition}
                  htmlFor="apply-current-position"
                >
                  <Input
                    id="apply-current-position"
                    value={flow.form.currentPosition}
                    onChange={(event) =>
                      flow.updateField("currentPosition", event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label={t.publicJob.apply.skills}
                  htmlFor="apply-skills"
                >
                  <Input
                    id="apply-skills"
                    value={flow.form.skillsText}
                    onChange={(event) =>
                      flow.updateField("skillsText", event.target.value)
                    }
                    placeholder={t.publicJob.apply.skillsHint}
                  />
                </FormField>
                <FormField
                  label={t.publicJob.apply.experience}
                  htmlFor="apply-experience"
                >
                  <Textarea
                    id="apply-experience"
                    rows={5}
                    value={flow.form.experience}
                    onChange={(event) =>
                      flow.updateField("experience", event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label={t.publicJob.apply.education}
                  htmlFor="apply-education"
                >
                  <Textarea
                    id="apply-education"
                    rows={4}
                    value={flow.form.education}
                    onChange={(event) =>
                      flow.updateField("education", event.target.value)
                    }
                  />
                </FormField>

                <h3 className="public-job-section-title">
                  {t.publicJob.apply.linksTitle}
                </h3>
                <FormField
                  label={t.publicJob.apply.linkedin}
                  htmlFor="apply-linkedin"
                >
                  <Input
                    id="apply-linkedin"
                    value={flow.form.linkedin}
                    onChange={(event) =>
                      flow.updateField("linkedin", event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label={t.publicJob.apply.portfolio}
                  htmlFor="apply-portfolio"
                >
                  <Input
                    id="apply-portfolio"
                    value={flow.form.portfolio}
                    onChange={(event) =>
                      flow.updateField("portfolio", event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label={t.publicJob.apply.website}
                  htmlFor="apply-website"
                >
                  <Input
                    id="apply-website"
                    value={flow.form.website}
                    onChange={(event) =>
                      flow.updateField("website", event.target.value)
                    }
                  />
                </FormField>

                <LoadingButton
                  type="submit"
                  loading={flow.submitting}
                  loadingLabel={t.publicJob.apply.submitting}
                >
                  {t.publicJob.apply.submit}
                </LoadingButton>
              </Form>
            </Card>
          ) : null}
        </div>
      )}
    </PublicJobLayout>
  );
}
