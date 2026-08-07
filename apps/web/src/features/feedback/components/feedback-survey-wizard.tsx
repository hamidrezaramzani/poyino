import type { BetaFeedbackAnswersV1 } from "@poyino/contracts";
import { Button, LoadingButton, ProgressBar, Textarea } from "@poyino/ui";
import { useMemo, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import {
  EMPTY_ANSWERS,
  isQuestionAnswered,
  SURVEY_QUESTIONS,
  type SurveyQuestion,
} from "../lib/survey-questions";

type FeedbackSurveyWizardProps = {
  initialAnswers?: BetaFeedbackAnswersV1 | null;
  submitting?: boolean;
  onSubmit: (answers: BetaFeedbackAnswersV1) => Promise<void> | void;
};

export function FeedbackSurveyWizard({
  initialAnswers,
  submitting = false,
  onSubmit,
}: FeedbackSurveyWizardProps) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<BetaFeedbackAnswersV1>(
    initialAnswers ?? EMPTY_ANSWERS,
  );

  const question = SURVEY_QUESTIONS[step];
  const total = SURVEY_QUESTIONS.length;
  const progress = ((step + 1) / total) * 100;
  const canContinue = isQuestionAnswered(question, answers);
  const isLast = step === total - 1;

  const progressLabel = useMemo(
    () =>
      t.feedback.progressLabel
        .replace("{current}", String(step + 1))
        .replace("{total}", String(total)),
    [step, t.feedback.progressLabel, total],
  );

  function updateAnswer<K extends keyof BetaFeedbackAnswersV1>(
    key: K,
    value: BetaFeedbackAnswersV1[K],
  ) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  async function handleNext() {
    if (!canContinue) return;
    if (isLast) {
      await onSubmit(answers);
      return;
    }
    setStep((value) => Math.min(total - 1, value + 1));
  }

  return (
    <div className="feedback-wizard">
      <div className="feedback-wizard-meta">
        <p>{progressLabel}</p>
        <p className="feedback-wizard-eta">{t.feedback.estimatedTime}</p>
      </div>
      <ProgressBar value={progress} showPercentage={false} />

      <div className="feedback-wizard-question" key={question.id}>
        <h2>{t.feedback.questions[question.id]}</h2>
        <QuestionInput
          question={question}
          answers={answers}
          onChange={updateAnswer}
        />
      </div>

      <div className="feedback-wizard-actions">
        <Button
          type="button"
          variant="secondary"
          disabled={step === 0 || submitting}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
        >
          {t.feedback.previous}
        </Button>
        <LoadingButton
          type="button"
          loading={submitting}
          loadingLabel={t.feedback.submitting}
          disabled={!canContinue}
          onClick={() => void handleNext()}
        >
          {isLast ? t.feedback.submit : t.feedback.next}
        </LoadingButton>
      </div>
    </div>
  );
}

function QuestionInput({
  question,
  answers,
  onChange,
}: {
  question: SurveyQuestion;
  answers: BetaFeedbackAnswersV1;
  onChange: <K extends keyof BetaFeedbackAnswersV1>(
    key: K,
    value: BetaFeedbackAnswersV1[K],
  ) => void;
}) {
  const { t } = useI18n();
  const value = answers[question.id];

  if (question.kind === "rating") {
    return (
      <div className="feedback-rating" role="radiogroup" aria-label={t.feedback.questions[question.id]}>
        {Array.from({ length: 10 }, (_, index) => {
          const score = index + 1;
          const selected = value === score;
          return (
            <button
              key={score}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`feedback-rating-option${selected ? " is-selected" : ""}`}
              onClick={() => onChange(question.id, score as never)}
            >
              {score}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.kind === "choice" && question.optionGroup) {
    const options = t.feedback.options[question.optionGroup];
    return (
      <div className="feedback-choice-list" role="radiogroup" aria-label={t.feedback.questions[question.id]}>
        {Object.entries(options).map(([key, label]) => {
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`feedback-choice-option${selected ? " is-selected" : ""}`}
              onClick={() => onChange(question.id, key as never)}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <Textarea
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(question.id, event.target.value as never)}
      rows={5}
      aria-label={t.feedback.questions[question.id]}
    />
  );
}
