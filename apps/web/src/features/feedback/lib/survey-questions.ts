import type { BetaFeedbackAnswersV1 } from "@poyino/contracts";

export type SurveyQuestionId = keyof BetaFeedbackAnswersV1;

export type SurveyQuestionKind =
  | "rating"
  | "choice"
  | "longText"
  | "optionalLongText";

export type SurveyQuestion = {
  id: SurveyQuestionId;
  kind: SurveyQuestionKind;
  optionGroup?:
    | "timeReduction"
    | "valuableFeature"
    | "aiHelp"
    | "willingnessToPay";
  required: boolean;
};

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  { id: "satisfaction", kind: "rating", required: true },
  {
    id: "timeReduction",
    kind: "choice",
    optionGroup: "timeReduction",
    required: true,
  },
  {
    id: "mostValuableFeature",
    kind: "choice",
    optionGroup: "valuableFeature",
    required: true,
  },
  { id: "needsImprovement", kind: "longText", required: true },
  {
    id: "aiRecommendationsHelp",
    kind: "choice",
    optionGroup: "aiHelp",
    required: true,
  },
  { id: "confusingAspects", kind: "optionalLongText", required: false },
  { id: "missingFeature", kind: "optionalLongText", required: false },
  { id: "disappointmentIfGone", kind: "rating", required: true },
  {
    id: "willingnessToPay",
    kind: "choice",
    optionGroup: "willingnessToPay",
    required: true,
  },
  { id: "additionalComments", kind: "optionalLongText", required: false },
];

export const EMPTY_ANSWERS: BetaFeedbackAnswersV1 = {
  satisfaction: 0,
  timeReduction: "" as BetaFeedbackAnswersV1["timeReduction"],
  mostValuableFeature: "" as BetaFeedbackAnswersV1["mostValuableFeature"],
  needsImprovement: "",
  aiRecommendationsHelp: "" as BetaFeedbackAnswersV1["aiRecommendationsHelp"],
  confusingAspects: "",
  missingFeature: "",
  disappointmentIfGone: 0,
  willingnessToPay: "" as BetaFeedbackAnswersV1["willingnessToPay"],
  additionalComments: "",
};

export function isQuestionAnswered(
  question: SurveyQuestion,
  answers: BetaFeedbackAnswersV1,
): boolean {
  const value = answers[question.id];
  if (question.kind === "rating") {
    return typeof value === "number" && value >= 1 && value <= 10;
  }
  if (question.kind === "choice") {
    return typeof value === "string" && value.length > 0;
  }
  if (question.required) {
    return typeof value === "string" && value.trim().length > 0;
  }
  return true;
}
