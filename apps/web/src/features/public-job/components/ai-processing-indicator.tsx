import { Spinner } from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";

type AiProcessingStep = "extracting" | "analyzing";

type AiProcessingIndicatorProps = {
  step: AiProcessingStep;
};

export function AiProcessingIndicator({ step }: AiProcessingIndicatorProps) {
  const { t } = useI18n();

  return (
    <div className="public-job-ai-indicator" role="status" aria-live="polite">
      <Spinner />
      <div>
        <strong>
          {step === "extracting"
            ? t.publicJob.apply.extractingTitle
            : t.publicJob.apply.analyzingTitle}
        </strong>
        <p>
          {step === "extracting"
            ? t.publicJob.apply.extractingDescription
            : t.publicJob.apply.analyzingDescription}
        </p>
      </div>
    </div>
  );
}
