import {
  BadRequestException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AiCreditsErrorCode } from "@poyino/contracts";

export function insufficientCreditsException(): HttpException {
  return new BadRequestException({
    success: false,
    error: {
      code: AiCreditsErrorCode.INSUFFICIENT_CREDITS,
      message: "Your organization has no AI credits remaining.",
    },
  });
}

export function creditsNotInitializedException(): HttpException {
  return new HttpException(
    {
      success: false,
      error: {
        code: AiCreditsErrorCode.CREDITS_NOT_INITIALIZED,
        message: "AI credits are not initialized for this organization.",
      },
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}

export class InsufficientCreditsError extends Error {
  readonly code = AiCreditsErrorCode.INSUFFICIENT_CREDITS;

  constructor(message = "Your organization has no AI credits remaining.") {
    super(message);
    this.name = "InsufficientCreditsError";
  }
}
