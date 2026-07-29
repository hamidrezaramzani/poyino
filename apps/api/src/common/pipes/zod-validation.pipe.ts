import {
  BadRequestException,
  PipeTransform,
  Injectable,
} from "@nestjs/common";
import { RegisterErrorCode, RegisterSchema } from "@poyino/contracts";
import type { RegisterInput } from "@poyino/contracts";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown): RegisterInput {
    const result = RegisterSchema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        success: false,
        error: {
          code: RegisterErrorCode.VALIDATION_ERROR,
          message: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    return result.data;
  }
}
