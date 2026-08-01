import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { loadStorageConfig } from "./config/storage.config";
import {
  REJECTED_EXECUTABLE_MIME_TYPES,
  STORAGE_PROVIDER,
  type StorageFolder,
} from "./constants/storage.constants";
import type {
  DownloadResult,
  StoredFileRecord,
  StorageConfig,
  UploadObjectInput,
} from "./dto/storage.dto";
import {
  StorageObjectNotFoundException,
  StorageValidationException,
} from "./exceptions/storage.exceptions";
import type { StorageProvider } from "./interfaces/storage-provider.interface";
import { StorageLogger } from "./logging/storage.logger";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class StorageService {
  private readonly config: StorageConfig;

  constructor(
    @Inject(STORAGE_PROVIDER) private readonly provider: StorageProvider,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StorageLogger) private readonly storageLogger: StorageLogger,
    @Inject(ConfigService) configService: ConfigService,
  ) {
    this.config = loadStorageConfig(configService);
  }

  /**
   * Upload a buffer to object storage and persist metadata.
   * Original filenames are never used as object keys.
   */
  async upload(input: UploadObjectInput): Promise<StoredFileRecord> {
    this.validateUpload(input);

    const fileId = input.fileId ?? randomUUID();
    const extension = extensionFrom(input.originalName, input.mimeType);
    const objectKey = buildObjectKey({
      folder: input.folder,
      scope: input.scope,
      fileId,
      extension,
    });

    this.storageLogger.uploadStarted({
      objectKey,
      mimeType: input.mimeType,
      sizeBytes: input.buffer.byteLength,
      folder: input.folder,
    });

    const startedAt = Date.now();

    try {
      const uploaded = await this.provider.upload(
        objectKey,
        input.buffer,
        input.mimeType,
      );

      const publicUrl = this.provider.generatePublicUrl(objectKey);

      const file = await this.prisma.storedFile.create({
        data: {
          id: fileId,
          organizationId: input.organizationId,
          provider: this.config.provider,
          bucket: this.config.bucket,
          objectKey,
          originalName: input.originalName,
          mimeType: input.mimeType,
          extension,
          sizeBytes: input.buffer.byteLength,
          etag: uploaded.etag,
          publicUrl,
        },
      });

      this.storageLogger.uploadCompleted({
        objectKey,
        mimeType: input.mimeType,
        sizeBytes: input.buffer.byteLength,
        durationMs: Date.now() - startedAt,
        etag: uploaded.etag,
      });

      return mapStoredFile(file);
    } catch (error) {
      this.storageLogger.uploadFailed({
        objectKey,
        durationMs: Date.now() - startedAt,
        errorCode:
          error && typeof error === "object" && "code" in error
            ? String((error as { code: unknown }).code)
            : "UNKNOWN",
      });
      throw error;
    }
  }

  async download(fileId: string): Promise<DownloadResult> {
    const file = await this.requireFile(fileId);
    const content = await this.provider.download(file.objectKey);
    return {
      content,
      mimeType: file.mimeType,
      fileName: file.originalName,
      sizeBytes: file.sizeBytes,
    };
  }

  async downloadByOrganization(
    organizationId: string,
    fileId: string,
  ): Promise<DownloadResult> {
    const file = await this.requireOwnedFile(organizationId, fileId);
    const content = await this.provider.download(file.objectKey);
    return {
      content,
      mimeType: file.mimeType,
      fileName: file.originalName,
      sizeBytes: file.sizeBytes,
    };
  }

  async getMetadata(fileId: string): Promise<StoredFileRecord> {
    return mapStoredFile(await this.requireFile(fileId));
  }

  async getOwnedMetadata(
    organizationId: string,
    fileId: string,
  ): Promise<StoredFileRecord> {
    return mapStoredFile(await this.requireOwnedFile(organizationId, fileId));
  }

  async exists(fileId: string): Promise<boolean> {
    const file = await this.prisma.storedFile.findUnique({
      where: { id: fileId },
      select: { objectKey: true },
    });
    if (!file) {
      return false;
    }
    return this.provider.exists(file.objectKey);
  }

  async delete(fileId: string): Promise<void> {
    const file = await this.requireFile(fileId);

    try {
      await this.provider.delete(file.objectKey);
    } catch (error) {
      // Object may already be gone — still remove metadata.
      this.storageLogger.warn(
        "Storage object delete failed; continuing with metadata cleanup",
        {
          fileId,
          objectKey: file.objectKey,
          errorCode:
            error && typeof error === "object" && "code" in error
              ? String((error as { code: unknown }).code)
              : "UNKNOWN",
        },
      );
    }

    await this.prisma.storedFile.delete({ where: { id: fileId } });
    this.storageLogger.operation("delete.complete", {
      fileId,
      objectKey: file.objectKey,
    });
  }

  generatePublicUrl(objectKey: string): string | null {
    return this.provider.generatePublicUrl(objectKey);
  }

  async generateSignedUrl(
    fileId: string,
    expiresInSeconds?: number,
  ): Promise<string> {
    const file = await this.requireFile(fileId);
    return this.provider.generateSignedUrl(file.objectKey, expiresInSeconds);
  }

  async copy(fileId: string, destinationKey: string): Promise<StoredFileRecord> {
    const file = await this.requireFile(fileId);
    await this.provider.copy(file.objectKey, destinationKey);

    const publicUrl = this.provider.generatePublicUrl(destinationKey);
    const updated = await this.prisma.storedFile.update({
      where: { id: fileId },
      data: {
        objectKey: destinationKey,
        publicUrl,
        bucket: this.config.bucket,
        provider: this.config.provider,
      },
    });

    this.storageLogger.operation("copy.complete", {
      fileId,
      from: file.objectKey,
      to: destinationKey,
    });

    return mapStoredFile(updated);
  }

  async move(fileId: string, destinationKey: string): Promise<StoredFileRecord> {
    const file = await this.requireFile(fileId);
    await this.provider.copy(file.objectKey, destinationKey);

    try {
      await this.provider.delete(file.objectKey);
    } catch (error) {
      this.storageLogger.warn(
        "Storage move: failed to delete source after copy",
        {
          fileId,
          objectKey: file.objectKey,
          errorCode:
            error && typeof error === "object" && "code" in error
              ? String((error as { code: unknown }).code)
              : "UNKNOWN",
        },
      );
    }

    const publicUrl = this.provider.generatePublicUrl(destinationKey);
    const updated = await this.prisma.storedFile.update({
      where: { id: fileId },
      data: {
        objectKey: destinationKey,
        publicUrl,
        bucket: this.config.bucket,
        provider: this.config.provider,
      },
    });

    this.storageLogger.operation("move.complete", {
      fileId,
      from: file.objectKey,
      to: destinationKey,
    });

    return mapStoredFile(updated);
  }

  private validateUpload(input: UploadObjectInput) {
    if (!input.buffer.byteLength) {
      throw new StorageValidationException("Uploaded file is empty.");
    }

    if (
      input.maxBytes !== undefined &&
      input.buffer.byteLength > input.maxBytes
    ) {
      throw new StorageValidationException(
        `Uploaded file exceeds the maximum size of ${input.maxBytes} bytes.`,
      );
    }

    if (REJECTED_EXECUTABLE_MIME_TYPES.has(input.mimeType)) {
      throw new StorageValidationException(
        `Executable files are not allowed (${input.mimeType}).`,
      );
    }

    if (
      input.allowedMimeTypes &&
      !input.allowedMimeTypes.includes(input.mimeType)
    ) {
      throw new StorageValidationException(
        `MIME type "${input.mimeType}" is not allowed.`,
      );
    }

    if (!input.scope.trim()) {
      throw new StorageValidationException("Upload scope is required.");
    }
  }

  private async requireFile(fileId: string) {
    const file = await this.prisma.storedFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new StorageObjectNotFoundException(
        `File "${fileId}" was not found.`,
      );
    }

    return file;
  }

  private async requireOwnedFile(organizationId: string, fileId: string) {
    const file = await this.prisma.storedFile.findFirst({
      where: { id: fileId, organizationId },
    });

    if (!file) {
      throw new StorageObjectNotFoundException(
        `File "${fileId}" was not found.`,
      );
    }

    return file;
  }
}

function buildObjectKey(input: {
  folder: StorageFolder;
  scope: string;
  fileId: string;
  extension: string;
}): string {
  const ext = input.extension ? `.${input.extension.replace(/^\./, "")}` : "";
  return `${input.folder}/${input.scope}/${input.fileId}${ext}`;
}

function extensionFrom(originalName: string, mimeType: string): string {
  const fromName = extname(originalName).replace(/^\./, "").toLowerCase();
  if (fromName && /^[a-z0-9]{1,12}$/.test(fromName)) {
    return fromName;
  }

  switch (mimeType) {
    case "application/pdf":
      return "pdf";
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/svg+xml":
      return "svg";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

function mapStoredFile(file: {
  id: string;
  organizationId: string;
  provider: string;
  bucket: string;
  objectKey: string;
  originalName: string;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  etag: string | null;
  publicUrl: string | null;
  createdAt: Date;
}): StoredFileRecord {
  return {
    id: file.id,
    organizationId: file.organizationId,
    provider: file.provider,
    bucket: file.bucket,
    objectKey: file.objectKey,
    originalName: file.originalName,
    mimeType: file.mimeType,
    extension: file.extension,
    sizeBytes: file.sizeBytes,
    etag: file.etag,
    publicUrl: file.publicUrl,
    createdAt: file.createdAt,
  };
}
