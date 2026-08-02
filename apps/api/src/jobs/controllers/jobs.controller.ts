import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
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
  UpdateJobExpirationSchema,
  UpdateJobSchema,
  type CreateJobInput,
  type GenerateJobContentInput,
  type ListJobsQuery,
  type UpdateJobExpirationInput,
  type UpdateJobInput,
} from "@poyino/contracts";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { RequirePermission } from "../../authentication/decorators/require-permission.decorator";
import { PermissionsGuard } from "../../authentication/guards/permissions.guard";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { JobsService } from "../services/jobs.service";

@Controller("jobs")
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class JobsController {
  constructor(
    @Inject(JobsService)
    private readonly jobsService: JobsService,
  ) {}

  @Get()
  @RequirePermission("jobs:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(ListJobsQuerySchema)) query: ListJobsQuery,
  ) {
    return this.jobsService.list(user, query);
  }

  @Post()
  @RequirePermission("jobs:create")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateJobSchema)) body: CreateJobInput,
  ) {
    return this.jobsService.create(user, body);
  }

  @Post("generate")
  @RequirePermission("ai:generate")
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
  @RequirePermission("jobs:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  listTemplates(@CurrentUser() user: AuthenticatedUser) {
    return this.jobsService.listTemplates(user.organizationId);
  }

  @Get(":jobId")
  @RequirePermission("jobs:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
  ) {
    return this.jobsService.getById(user, jobId);
  }

  @Put(":jobId")
  @RequirePermission("jobs:update")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Body(new ZodValidationPipe(UpdateJobSchema)) body: UpdateJobInput,
  ) {
    return this.jobsService.update(user, jobId, body);
  }

  @Patch(":jobId/publish")
  @RequirePermission("jobs:publish")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  publish(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
  ) {
    return this.jobsService.publish(user, jobId);
  }

  @Patch(":jobId/unpublish")
  @RequirePermission("jobs:publish")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  unpublish(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
  ) {
    return this.jobsService.unpublish(user, jobId);
  }

  @Patch(":jobId/expiration")
  @RequirePermission("jobs:update")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  updateExpiration(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Body(new ZodValidationPipe(UpdateJobExpirationSchema))
    body: UpdateJobExpirationInput,
  ) {
    return this.jobsService.updateExpiration(user, jobId, body);
  }

  @Delete(":jobId")
  @RequirePermission("jobs:delete")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId", ParseUUIDPipe) jobId: string,
  ) {
    await this.jobsService.remove(user, jobId);
  }
}
