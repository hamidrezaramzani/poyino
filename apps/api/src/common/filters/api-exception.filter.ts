import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import type { Response } from "express";
import { LoginErrorCode } from "@poyino/contracts";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

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

      response.status(status).json({
        success: false,
        error: {
          code: LoginErrorCode.UNEXPECTED_ERROR,
          message: "خطایی رخ داده است. لطفاً دوباره تلاش کنید.",
        },
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: LoginErrorCode.UNEXPECTED_ERROR,
        message: "خطایی رخ داده است. لطفاً دوباره تلاش کنید.",
      },
    });
  }
}
