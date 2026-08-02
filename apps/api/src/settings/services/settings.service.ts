import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  MAX_UPLOAD_BYTES,
  SettingsErrorCode,
  type BrandingSettingsInput,
  type ChangePasswordInput,
  type GeneralSettingsInput,
  type NotificationSettingsInput,
  type ProfileSettingsInput,
  type UploadFileInput,
} from "@poyino/contracts";
import * as bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import {
  StorageNetworkException,
  StorageObjectNotFoundException,
  StorageService,
  StorageTimeoutException,
  StorageValidationException,
} from "../../storage";

const BCRYPT_ROUNDS = 12;
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
] as const;

@Injectable()
export class SettingsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StorageService) private readonly storageService: StorageService,
  ) {}

  async getGeneral(organizationId: string) {
    const organization = await this.requireOrganization(organizationId);
    return {
      success: true as const,
      settings: this.mapGeneral(organization),
    };
  }

  async updateGeneral(organizationId: string, input: GeneralSettingsInput) {
    try {
      const organization = await this.prisma.organization.update({
        where: { id: organizationId },
        data: {
          name: input.organizationName,
          displayName: input.displayName,
          description: input.description,
          email: input.email.trim().toLowerCase(),
          phone: input.phone,
          website: input.website,
          country: input.country,
          city: input.city,
          timezone: input.timezone,
          language: input.language,
        },
      });

      return {
        success: true as const,
        settings: this.mapGeneral(organization),
      };
    } catch (error) {
      this.rethrowEmailConflict(error);
      throw error;
    }
  }

  async getProfile(organizationId: string) {
    const organization = await this.requireOrganization(organizationId);
    return {
      success: true as const,
      settings: this.mapProfile(organization),
    };
  }

  async updateProfile(organizationId: string, input: ProfileSettingsInput) {
    if (input.logoId) {
      await this.requireOwnedFile(organizationId, input.logoId);
    }

    try {
      const organization = await this.prisma.organization.update({
        where: { id: organizationId },
        data: {
          name: input.organizationName,
          email: input.email.trim().toLowerCase(),
          phone: input.phone,
          website: input.website,
          address: input.address,
          ...(input.logoId !== undefined ? { logoId: input.logoId } : {}),
        },
      });

      return {
        success: true as const,
        settings: this.mapProfile(organization),
      };
    } catch (error) {
      this.rethrowEmailConflict(error);
      throw error;
    }
  }

  async getBranding(organizationId: string) {
    const organization = await this.requireOrganization(organizationId);
    return {
      success: true as const,
      settings: this.mapBranding(organization),
    };
  }

  async updateBranding(organizationId: string, input: BrandingSettingsInput) {
    if (input.logoId) {
      await this.requireOwnedFile(organizationId, input.logoId);
    }
    if (input.darkLogoId) {
      await this.requireOwnedFile(organizationId, input.darkLogoId);
    }

    const organization = await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        primaryColor: input.primaryColor,
        secondaryColor: input.secondaryColor,
        ...(input.logoId !== undefined ? { logoId: input.logoId } : {}),
        ...(input.darkLogoId !== undefined
          ? { darkLogoId: input.darkLogoId }
          : {}),
      },
    });

    return {
      success: true as const,
      settings: this.mapBranding(organization),
    };
  }

  async getNotifications(organizationId: string) {
    const organization = await this.requireOrganization(organizationId);
    return {
      success: true as const,
      settings: this.mapNotifications(organization),
    };
  }

  async updateNotifications(
    organizationId: string,
    input: NotificationSettingsInput,
  ) {
    const organization = await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        newCandidateEmail: input.newCandidateEmail,
        candidateStatusEmail: input.candidateStatusEmail,
        interviewReminderEmail: input.interviewReminderEmail,
        jobExpirationEmail: input.jobExpirationEmail,
        jobPublishedEmail: input.jobPublishedEmail,
      },
    });

    return {
      success: true as const,
      settings: this.mapNotifications(organization),
    };
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: SettingsErrorCode.UNAUTHORIZED,
          message: "احراز هویت لازم است. لطفاً دوباره وارد شوید.",
        },
      });
    }

    const matches = await bcrypt.compare(
      input.currentPassword,
      user.passwordHash,
    );

    if (!matches) {
      throw new BadRequestException({
        success: false,
        error: {
          code: SettingsErrorCode.CURRENT_PASSWORD_INCORRECT,
          message: "رمز عبور فعلی اشتباه است.",
        },
      });
    }

    if (input.newPassword === input.currentPassword) {
      throw new BadRequestException({
        success: false,
        error: {
          code: SettingsErrorCode.SAME_PASSWORD,
          message: "رمز عبور جدید نباید با رمز عبور فعلی یکسان باشد.",
        },
      });
    }

    const passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.updateMany({
        where: { userId, usedAt: null },
        data: { usedAt: new Date() },
      }),
    ]);

    return { success: true as const };
  }

  async uploadFile(organizationId: string, input: UploadFileInput) {
    const mimeType = input.mimeType;

    if (!ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number])) {
      throw new BadRequestException({
        success: false,
        error: {
          code: SettingsErrorCode.FILE_INVALID_TYPE,
          message: "فرمت فایل پشتیبانی نمی‌شود.",
        },
      });
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(input.contentBase64, "base64");
    } catch {
      throw new BadRequestException({
        success: false,
        error: {
          code: SettingsErrorCode.FILE_INVALID_TYPE,
          message: "فایل نامعتبر است.",
        },
      });
    }

    if (buffer.byteLength === 0 || buffer.byteLength > MAX_UPLOAD_BYTES) {
      throw new BadRequestException({
        success: false,
        error: {
          code: SettingsErrorCode.FILE_TOO_LARGE,
          message: "حجم فایل نباید بیشتر از ۲ مگابایت باشد.",
        },
      });
    }

    try {
      const file = await this.storageService.upload({
        organizationId,
        folder: "organizations",
        scope: organizationId,
        buffer,
        originalName: input.fileName,
        mimeType,
        maxBytes: MAX_UPLOAD_BYTES,
        allowedMimeTypes: ALLOWED_MIME_TYPES,
      });

      return {
        success: true as const,
        file: {
          id: file.id,
          url: this.fileUrl(file.id),
          fileName: file.originalName,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
        },
      };
    } catch (error) {
      if (error instanceof StorageValidationException) {
        throw new BadRequestException({
          success: false,
          error: {
            code: SettingsErrorCode.FILE_INVALID_TYPE,
            message: "فایل نامعتبر است.",
          },
        });
      }
      throw error;
    }
  }

  async getFileContent(organizationId: string, fileId: string) {
    try {
      return await this.storageService.downloadByOrganization(
        organizationId,
        fileId,
      );
    } catch (error) {
      if (error instanceof StorageObjectNotFoundException) {
        throw new NotFoundException({
          success: false,
          error: {
            code: SettingsErrorCode.FILE_NOT_FOUND,
            message: "فایل یافت نشد.",
          },
        });
      }
      if (
        error instanceof StorageNetworkException ||
        error instanceof StorageTimeoutException
      ) {
        throw new ServiceUnavailableException({
          success: false,
          error: {
            code: SettingsErrorCode.UNEXPECTED_ERROR,
            message: "دریافت فایل موقتاً ممکن نیست. لطفاً دوباره تلاش کنید.",
          },
        });
      }
      throw error;
    }
  }

  private async requireOrganization(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException({
        success: false,
        error: {
          code: SettingsErrorCode.UNEXPECTED_ERROR,
          message: "سازمان یافت نشد.",
        },
      });
    }

    return organization;
  }

  private async requireOwnedFile(organizationId: string, fileId: string) {
    const file = await this.prisma.storedFile.findFirst({
      where: { id: fileId, organizationId },
    });

    if (!file) {
      throw new BadRequestException({
        success: false,
        error: {
          code: SettingsErrorCode.FILE_NOT_FOUND,
          message: "فایل یافت نشد.",
        },
      });
    }

    return file;
  }

  private fileUrl(fileId: string) {
    return `/settings/files/${fileId}`;
  }

  private mapGeneral(organization: {
    name: string;
    displayName: string | null;
    description: string | null;
    email: string;
    phone: string | null;
    website: string | null;
    country: string | null;
    city: string | null;
    timezone: string;
    language: string;
  }) {
    return {
      organizationName: organization.name,
      displayName: organization.displayName,
      description: organization.description,
      email: organization.email,
      phone: organization.phone,
      website: organization.website,
      country: organization.country,
      city: organization.city,
      timezone: organization.timezone,
      language: organization.language === "en" ? ("en" as const) : ("fa" as const),
    };
  }

  private mapProfile(organization: {
    name: string;
    email: string;
    phone: string | null;
    website: string | null;
    address: string | null;
    logoId: string | null;
  }) {
    return {
      organizationName: organization.name,
      email: organization.email,
      phone: organization.phone,
      website: organization.website,
      address: organization.address,
      logoId: organization.logoId,
      logoUrl: organization.logoId ? this.fileUrl(organization.logoId) : null,
    };
  }

  private mapBranding(organization: {
    logoId: string | null;
    darkLogoId: string | null;
    primaryColor: string;
    secondaryColor: string;
  }) {
    return {
      logoId: organization.logoId,
      darkLogoId: organization.darkLogoId,
      logoUrl: organization.logoId ? this.fileUrl(organization.logoId) : null,
      darkLogoUrl: organization.darkLogoId
        ? this.fileUrl(organization.darkLogoId)
        : null,
      primaryColor: organization.primaryColor,
      secondaryColor: organization.secondaryColor,
    };
  }

  private mapNotifications(organization: {
    newCandidateEmail: boolean;
    candidateStatusEmail: boolean;
    interviewReminderEmail: boolean;
    jobExpirationEmail: boolean;
    jobPublishedEmail: boolean;
  }) {
    return {
      newCandidateEmail: organization.newCandidateEmail,
      candidateStatusEmail: organization.candidateStatusEmail,
      interviewReminderEmail: organization.interviewReminderEmail,
      jobExpirationEmail: organization.jobExpirationEmail,
      jobPublishedEmail: organization.jobPublishedEmail,
    };
  }

  private rethrowEmailConflict(error: unknown): never | void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException({
        success: false,
        error: {
          code: SettingsErrorCode.EMAIL_EXISTS,
          message: "این ایمیل قبلاً ثبت شده است.",
        },
      });
    }
  }
}
