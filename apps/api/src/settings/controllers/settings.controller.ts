import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Put,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  BrandingSettingsSchema,
  ChangePasswordSchema,
  GeneralSettingsSchema,
  NotificationSettingsSchema,
  ProfileSettingsSchema,
  UploadFileSchema,
  type BrandingSettingsInput,
  type ChangePasswordInput,
  type GeneralSettingsInput,
  type NotificationSettingsInput,
  type ProfileSettingsInput,
  type UploadFileInput,
} from "@poyino/contracts";
import type { Response } from "express";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { SessionAuthGuard } from "../../authentication/guards/session-auth.guard";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { SettingsService } from "../services/settings.service";

@Controller("settings")
@UseGuards(SessionAuthGuard)
export class SettingsController {
  constructor(
    @Inject(SettingsService)
    private readonly settingsService: SettingsService,
  ) {}

  @Get("general")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getGeneral(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getGeneral(user.organizationId);
  }

  @Put("general")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  updateGeneral(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(GeneralSettingsSchema))
    body: GeneralSettingsInput,
  ) {
    return this.settingsService.updateGeneral(user.organizationId, body);
  }

  @Get("profile")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getProfile(user.organizationId);
  }

  @Put("profile")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(ProfileSettingsSchema))
    body: ProfileSettingsInput,
  ) {
    return this.settingsService.updateProfile(user.organizationId, body);
  }

  @Get("branding")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getBranding(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getBranding(user.organizationId);
  }

  @Put("branding")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  updateBranding(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(BrandingSettingsSchema))
    body: BrandingSettingsInput,
  ) {
    return this.settingsService.updateBranding(user.organizationId, body);
  }

  @Get("notifications")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  getNotifications(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getNotifications(user.organizationId);
  }

  @Put("notifications")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  updateNotifications(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(NotificationSettingsSchema))
    body: NotificationSettingsInput,
  ) {
    return this.settingsService.updateNotifications(user.organizationId, body);
  }

  @Put("change-password")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 15 * 60_000 } })
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(ChangePasswordSchema))
    body: ChangePasswordInput,
  ) {
    return this.settingsService.changePassword(user.id, body);
  }

  @Post("files")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  uploadFile(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UploadFileSchema)) body: UploadFileInput,
  ) {
    return this.settingsService.uploadFile(user.organizationId, body);
  }

  @Get("files/:fileId")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  async getFile(
    @CurrentUser() user: AuthenticatedUser,
    @Param("fileId", ParseUUIDPipe) fileId: string,
    @Res() response: Response,
  ) {
    const file = await this.settingsService.getFileContent(
      user.organizationId,
      fileId,
    );

    response.setHeader("Content-Type", file.mimeType);
    response.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(file.fileName)}"`,
    );
    response.send(file.content);
  }
}
