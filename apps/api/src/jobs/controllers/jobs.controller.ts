import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  CreateJobSchema,
  GenerateJobContentSchema,
  type CreateJobInput,
  type GenerateJobContentInput,
} from "@poyino/contracts";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { JobsService } from "../services/jobs.service";

@Controller("jobs")
@UseGuards(SessionAuthGuard)
export class JobsController {
  constructor(
    @Inject(JobsService)
    private readonly jobsService: JobsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateJobSchema)) body: CreateJobInput,
  ) {
    return this.jobsService.create(user.organizationId, body);
  }

  @Post("generate")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  generate(
    @CurrentUser() _user: AuthenticatedUser,
    @Body(new ZodValidationPipe(GenerateJobContentSchema))
    body: GenerateJobContentInput,
  ) {
    return this.jobsService.generateContent(body);
  }

  @Get("templates")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  listTemplates(@CurrentUser() user: AuthenticatedUser) {
    return this.jobsService.listTemplates(user.organizationId);
  }
}
