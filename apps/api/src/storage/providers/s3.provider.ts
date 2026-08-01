import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { loadStorageConfig } from "../config/storage.config";
import type { StorageConfig } from "../dto/storage.dto";
import {
  StorageBucketNotFoundException,
  StorageException,
  StorageInvalidCredentialsException,
  StorageNetworkException,
  StorageObjectNotFoundException,
  StorageTimeoutException,
  StorageUploadException,
  StorageDeleteException,
  StorageErrorCode,
} from "../exceptions/storage.exceptions";
import type { StorageProvider } from "../interfaces/storage-provider.interface";
import type {
  ProviderObjectMeta,
  ProviderUploadResult,
} from "../dto/storage.dto";

@Injectable()
export class S3StorageProvider implements StorageProvider {
  private readonly client: S3Client;
  private readonly config: StorageConfig;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.config = loadStorageConfig(this.configService);
    this.client = new S3Client({
      endpoint: this.config.endpoint,
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
      },
      forcePathStyle: this.config.forcePathStyle,
    });
  }

  async upload(
    objectKey: string,
    body: Buffer,
    mimeType: string,
  ): Promise<ProviderUploadResult> {
    try {
      const result = await this.client.send(
        new PutObjectCommand({
          Bucket: this.config.bucket,
          Key: objectKey,
          Body: body,
          ContentType: mimeType,
          ContentLength: body.byteLength,
        }),
      );

      return { etag: result.ETag?.replaceAll('"', "") ?? null };
    } catch (error) {
      throw this.mapError(error, "upload", objectKey);
    }
  }

  async download(objectKey: string): Promise<Buffer> {
    try {
      const result = await this.client.send(
        new GetObjectCommand({
          Bucket: this.config.bucket,
          Key: objectKey,
        }),
      );

      if (!result.Body) {
        throw new StorageObjectNotFoundException(
          `Object "${objectKey}" has no body.`,
        );
      }

      return Buffer.from(await result.Body.transformToByteArray());
    } catch (error) {
      throw this.mapError(error, "download", objectKey);
    }
  }

  async delete(objectKey: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.config.bucket,
          Key: objectKey,
        }),
      );
    } catch (error) {
      throw this.mapError(error, "delete", objectKey);
    }
  }

  async exists(objectKey: string): Promise<boolean> {
    const meta = await this.head(objectKey);
    return meta !== null;
  }

  async copy(sourceKey: string, destinationKey: string): Promise<void> {
    try {
      await this.client.send(
        new CopyObjectCommand({
          Bucket: this.config.bucket,
          Key: destinationKey,
          CopySource: `${this.config.bucket}/${sourceKey}`,
        }),
      );
    } catch (error) {
      throw this.mapError(error, "copy", sourceKey);
    }
  }

  async head(objectKey: string): Promise<ProviderObjectMeta | null> {
    try {
      const result = await this.client.send(
        new HeadObjectCommand({
          Bucket: this.config.bucket,
          Key: objectKey,
        }),
      );

      return {
        contentType: result.ContentType,
        contentLength: result.ContentLength,
        etag: result.ETag?.replaceAll('"', ""),
      };
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }
      throw this.mapError(error, "head", objectKey);
    }
  }

  generatePublicUrl(objectKey: string): string | null {
    if (!this.config.publicUrl) {
      return null;
    }

    // S3_PUBLIC_URL is the public base that prefixes the object key directly.
    // For ParsPack-style hosts this is typically https://{bucket}.parspack.net
    const base = this.config.publicUrl.replace(/\/$/, "");
    return `${base}/${objectKey}`;
  }

  async generateSignedUrl(
    objectKey: string,
    expiresInSeconds?: number,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: objectKey,
      });
      return await getSignedUrl(this.client, command, {
        expiresIn: expiresInSeconds ?? this.config.signedUrlTtlSeconds,
      });
    } catch (error) {
      throw this.mapError(error, "signedUrl", objectKey);
    }
  }

  getBucket(): string {
    return this.config.bucket;
  }

  getProviderName(): string {
    return this.config.provider;
  }

  private mapError(
    error: unknown,
    operation: string,
    objectKey?: string,
  ): StorageException {
    if (error instanceof StorageException) {
      return error;
    }

    const name = errorName(error);
    const message = errorMessage(error);
    const status = errorStatus(error);
    const code = errorCode(error);

    if (
      name === "TimeoutError" ||
      code === "TimeoutError" ||
      /timed?\s*out/i.test(message)
    ) {
      return new StorageTimeoutException(
        `Storage ${operation} timed out${objectKey ? ` for "${objectKey}"` : ""}.`,
        error,
      );
    }

    if (
      name === "NetworkingError" ||
      code === "ENOTFOUND" ||
      code === "ECONNREFUSED" ||
      code === "ECONNRESET" ||
      /network|getaddrinfo|socket/i.test(message)
    ) {
      return new StorageNetworkException(
        `Storage ${operation} network error${objectKey ? ` for "${objectKey}"` : ""}.`,
        error,
      );
    }

    if (
      status === 403 ||
      code === "InvalidAccessKeyId" ||
      code === "SignatureDoesNotMatch" ||
      code === "AccessDenied" ||
      /credential|access.?key|signature/i.test(message)
    ) {
      return new StorageInvalidCredentialsException(
        "Storage provider rejected the configured credentials.",
        error,
      );
    }

    if (
      status === 404 ||
      code === "NoSuchBucket" ||
      code === "NotFound" ||
      /bucket.*not.?found|nosuchbucket/i.test(message)
    ) {
      if (code === "NoSuchKey" || /key.*not.?found|nosuchkey/i.test(message)) {
        return new StorageObjectNotFoundException(
          `Storage object "${objectKey ?? "unknown"}" was not found.`,
          error,
        );
      }
      return new StorageBucketNotFoundException(
        `Storage bucket "${this.config.bucket}" was not found.`,
        error,
      );
    }

    if (isNotFoundError(error)) {
      return new StorageObjectNotFoundException(
        `Storage object "${objectKey ?? "unknown"}" was not found.`,
        error,
      );
    }

    if (operation === "upload") {
      return new StorageUploadException(
        `Failed to upload object${objectKey ? ` "${objectKey}"` : ""}.`,
        error,
      );
    }

    if (operation === "delete") {
      return new StorageDeleteException(
        `Failed to delete object${objectKey ? ` "${objectKey}"` : ""}.`,
        error,
      );
    }

    return new StorageException(
      StorageErrorCode.PROVIDER_ERROR,
      `Storage ${operation} failed${objectKey ? ` for "${objectKey}"` : ""}.`,
      error,
      { providerStatus: status, providerCode: code },
    );
  }
}

function isNotFoundError(error: unknown): boolean {
  const status = errorStatus(error);
  const code = errorCode(error);
  return (
    status === 404 ||
    code === "NotFound" ||
    code === "NoSuchKey" ||
    code === "404"
  );
}

function errorName(error: unknown): string {
  if (error && typeof error === "object" && "name" in error) {
    return String((error as { name: unknown }).name);
  }
  return "";
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function errorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  const candidate = error as {
    $metadata?: { httpStatusCode?: number };
    statusCode?: number;
  };
  return candidate.$metadata?.httpStatusCode ?? candidate.statusCode;
}

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  const candidate = error as { Code?: string; code?: string; name?: string };
  return candidate.Code ?? candidate.code ?? candidate.name;
}
