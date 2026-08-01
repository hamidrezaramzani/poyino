import type {
  ProviderObjectMeta,
  ProviderUploadResult,
} from "../dto/storage.dto";

/**
 * Low-level object storage contract.
 * Business modules must never depend on this — use StorageService instead.
 */
export interface StorageProvider {
  upload(
    objectKey: string,
    body: Buffer,
    mimeType: string,
  ): Promise<ProviderUploadResult>;

  download(objectKey: string): Promise<Buffer>;

  delete(objectKey: string): Promise<void>;

  exists(objectKey: string): Promise<boolean>;

  copy(sourceKey: string, destinationKey: string): Promise<void>;

  head(objectKey: string): Promise<ProviderObjectMeta | null>;

  generatePublicUrl(objectKey: string): string | null;

  generateSignedUrl(
    objectKey: string,
    expiresInSeconds?: number,
  ): Promise<string>;
}
