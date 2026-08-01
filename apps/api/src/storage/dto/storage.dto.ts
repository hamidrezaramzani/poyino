import type { StorageFolder } from "../constants/storage.constants";

export type StorageProviderName = "s3";

export type StorageConfig = {
  provider: StorageProviderName;
  endpoint: string;
  region: string;
  bucket: string;
  accessKey: string;
  secretKey: string;
  publicUrl: string | null;
  forcePathStyle: boolean;
  signedUrlTtlSeconds: number;
};

export type UploadObjectInput = {
  organizationId: string;
  folder: StorageFolder;
  /** Tenant / application scope under the folder (e.g. organizationId or applicationId). */
  scope: string;
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  /** Optional id; generated when omitted. */
  fileId?: string;
  maxBytes?: number;
  allowedMimeTypes?: readonly string[];
};

export type StoredFileRecord = {
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
};

export type DownloadResult = {
  content: Buffer;
  mimeType: string;
  fileName: string;
  sizeBytes: number;
};

export type ProviderUploadResult = {
  etag: string | null;
};

export type ProviderObjectMeta = {
  contentType?: string;
  contentLength?: number;
  etag?: string;
};
