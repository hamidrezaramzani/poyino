export const STORAGE_PROVIDER = Symbol("STORAGE_PROVIDER");
export const STORAGE_CONFIG = Symbol("STORAGE_CONFIG");

export const STORAGE_ENV = {
  PROVIDER: "STORAGE_PROVIDER",
  S3_ENDPOINT: "S3_ENDPOINT",
  S3_REGION: "S3_REGION",
  S3_BUCKET: "S3_BUCKET",
  S3_ACCESS_KEY: "S3_ACCESS_KEY",
  S3_SECRET_KEY: "S3_SECRET_KEY",
  S3_PUBLIC_URL: "S3_PUBLIC_URL",
  S3_FORCE_PATH_STYLE: "S3_FORCE_PATH_STYLE",
  S3_SIGNED_URL_TTL_SECONDS: "S3_SIGNED_URL_TTL_SECONDS",
  LOG_LEVEL: "STORAGE_LOG_LEVEL",
} as const;

export const STORAGE_DEFAULTS = {
  PROVIDER: "s3",
  REGION: "us-east-1",
  FORCE_PATH_STYLE: true,
  SIGNED_URL_TTL_SECONDS: 3_600,
} as const;

export const STORAGE_FOLDERS = [
  "resumes",
  "organizations",
  "avatars",
  "attachments",
] as const;

export type StorageFolder = (typeof STORAGE_FOLDERS)[number];

/** MIME types that must never be stored. */
export const REJECTED_EXECUTABLE_MIME_TYPES = new Set([
  "application/x-msdownload",
  "application/x-msdos-program",
  "application/x-executable",
  "application/x-sharedlib",
  "application/x-elf",
  "application/vnd.microsoft.portable-executable",
  "application/x-sh",
  "application/x-bat",
  "application/x-csh",
  "text/x-shellscript",
]);
