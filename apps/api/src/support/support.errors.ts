import { HttpException, HttpStatus } from "@nestjs/common";
import { SupportErrorCode } from "@poyino/contracts";

export function supportNotFoundException() {
  return new HttpException(
    {
      success: false,
      error: {
        code: SupportErrorCode.NOT_FOUND,
        message: "Support ticket not found.",
      },
    },
    HttpStatus.NOT_FOUND,
  );
}

export function supportForbiddenException(message = "Forbidden.") {
  return new HttpException(
    {
      success: false,
      error: {
        code: SupportErrorCode.FORBIDDEN,
        message,
      },
    },
    HttpStatus.FORBIDDEN,
  );
}

export function supportClosedException() {
  return new HttpException(
    {
      success: false,
      error: {
        code: SupportErrorCode.TICKET_CLOSED,
        message: "This ticket is closed and cannot accept replies.",
      },
    },
    HttpStatus.CONFLICT,
  );
}

export function supportInvalidStatusException(message: string) {
  return new HttpException(
    {
      success: false,
      error: {
        code: SupportErrorCode.INVALID_STATUS,
        message,
      },
    },
    HttpStatus.CONFLICT,
  );
}

export function supportAttachmentException(
  code: typeof SupportErrorCode.ATTACHMENT_TOO_LARGE | typeof SupportErrorCode.ATTACHMENT_INVALID_TYPE,
  message: string,
) {
  return new HttpException(
    {
      success: false,
      error: { code, message },
    },
    HttpStatus.BAD_REQUEST,
  );
}
