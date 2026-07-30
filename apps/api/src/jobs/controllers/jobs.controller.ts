import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  CreateJobSchema,
  GenerateJobContentSchema,
  ListJobsQuerySchema,
  UpdateJobSchema,
  type CreateJobInput,
  type GenerateJobContentInput,
  type ListJobsQuery,
  type UpdateJobInput,
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

  @Get()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(ListJobsQuerySchema)) query: ListJobsQuery,
  ) {
    return this.jobsService.list(user.organizationId, query);
  }

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

  @Get(":jobId")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
  ) {
    return this.jobsService.getById(user.organizationId, jobId);
  }

  @Put(":jobId")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Body(new ZodValidationPipe(UpdateJobSchema)) body: UpdateJobInput,
  ) {
    return this.jobsService.update(user.organizationId, jobId, body);
  }
}
