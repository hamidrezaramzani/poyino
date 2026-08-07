import { HttpException, HttpStatus } from "@nestjs/common";
import { BetaFeedbackErrorCode } from "@poyino/contracts";

export function feedbackNotFoundException() {
  return new HttpException(
    {
      success: false,
      error: {
        code: BetaFeedbackErrorCode.NOT_FOUND,
        message: "Feedback response not found.",
      },
    },
    HttpStatus.NOT_FOUND,
  );
}

export function feedbackNotEligibleException() {
  return new HttpException(
    {
      success: false,
      error: {
        code: BetaFeedbackErrorCode.NOT_ELIGIBLE,
        message:
          "Your organization is not eligible for the beta feedback survey yet.",
      },
    },
    HttpStatus.FORBIDDEN,
  );
}

export function feedbackCooldownException(nextSubmitAt: string) {
  return new HttpException(
    {
      success: false,
      error: {
        code: BetaFeedbackErrorCode.COOLDOWN_ACTIVE,
        message: `A new submission is not allowed until ${nextSubmitAt}. You may update your previous response.`,
      },
    },
    HttpStatus.CONFLICT,
  );
}

export function feedbackInvalidSurveyException(message: string) {
  return new HttpException(
    {
      success: false,
      error: {
        code: BetaFeedbackErrorCode.INVALID_SURVEY,
        message,
      },
    },
    HttpStatus.BAD_REQUEST,
  );
}

export function feedbackForbiddenException(message = "Forbidden.") {
  return new HttpException(
    {
      success: false,
      error: {
        code: BetaFeedbackErrorCode.FORBIDDEN,
        message,
      },
    },
    HttpStatus.FORBIDDEN,
  );
}
