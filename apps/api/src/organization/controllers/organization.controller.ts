import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  CreateDepartmentSchema,
  CreateMemberSchema,
  UpdateMemberSchema,
  type CreateDepartmentInput,
  type CreateMemberInput,
  type UpdateMemberInput,
} from "@poyino/contracts";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { RequirePermission } from "../../authentication/decorators/require-permission.decorator";
import { PermissionsGuard } from "../../authentication/guards/permissions.guard";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { OrganizationService } from "../services/organization.service";

@Controller("organization")
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class OrganizationController {
  constructor(
    @Inject(OrganizationService)
    private readonly organizationService: OrganizationService,
  ) {}

  @Get("departments")
  @RequirePermission("departments:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  listDepartments(@CurrentUser() user: AuthenticatedUser) {
    return this.organizationService.listDepartments(user);
  }

  @Post("departments")
  @RequirePermission("departments:create")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  createDepartment(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateDepartmentSchema))
    body: CreateDepartmentInput,
  ) {
    return this.organizationService.createDepartment(user, body);
  }

  @Get("members")
  @RequirePermission("members:view")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  listMembers(@CurrentUser() user: AuthenticatedUser) {
    return this.organizationService.listMembers(user);
  }

  @Post("members")
  @RequirePermission("members:invite")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  createMember(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateMemberSchema)) body: CreateMemberInput,
  ) {
    return this.organizationService.createMember(user, body);
  }

  @Patch("members/:memberId")
  @RequirePermission("members:invite")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  updateMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param("memberId", ParseUUIDPipe) memberId: string,
    @Body(new ZodValidationPipe(UpdateMemberSchema)) body: UpdateMemberInput,
  ) {
    return this.organizationService.updateMember(user, memberId, body);
  }
}
