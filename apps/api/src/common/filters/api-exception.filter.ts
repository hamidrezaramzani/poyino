import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { ApplyErrorCode, LoginErrorCode } from "@poyino/contracts";
import type { Response } from "express";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<{ method?: string; url?: string }>();

    if (isPayloadTooLargeError(exception)) {
      response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        success: false,
        error: {
          code: ApplyErrorCode.FILE_TOO_LARGE,
          message: "File size exceeds the maximum allowed limit.",
        },
      });
      return;
    }

    if (exception instanceof ThrottlerException) {
      response.status(HttpStatus.TOO_MANY_REQUESTS).json({
        success: false,
        error: {
          code: LoginErrorCode.TOO_MANY_REQUESTS,
          message:
            "تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
        },
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null &&
        "success" in exceptionResponse
      ) {
        response.status(status).json(exceptionResponse);
        return;
      }

      if (status >= 500) {
        this.logger.error(
          `Unhandled HttpException on ${request.method ?? "UNKNOWN"} ${request.url ?? ""}`,
          exception instanceof Error ? exception.stack : String(exception),
        );
      }

      response.status(status).json({
        success: false,
        error: {
          code: LoginErrorCode.UNEXPECTED_ERROR,
          message: "خطایی رخ داده است. لطفاً دوباره تلاش کنید.",
        },
      });
      return;
    }

    this.logger.error(
      `Unhandled exception on ${request.method ?? "UNKNOWN"} ${request.url ?? ""}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: LoginErrorCode.UNEXPECTED_ERROR,
        message: "خطایی رخ داده است. لطفاً دوباره تلاش کنید.",
      },
    });
  }
}

function isPayloadTooLargeError(exception: unknown) {
  return (
    exception instanceof Error &&
    (exception.name === "PayloadTooLargeError" ||
      ("type" in exception &&
        (exception as { type?: string }).type === "entity.too.large") ||
      /request entity too large/i.test(exception.message))
  );
}
