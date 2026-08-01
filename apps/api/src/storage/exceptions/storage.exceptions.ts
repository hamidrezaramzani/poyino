export enum StorageErrorCode {
  NETWORK_ERROR = "STORAGE_NETWORK_ERROR",
  TIMEOUT = "STORAGE_TIMEOUT",
  INVALID_CREDENTIALS = "STORAGE_INVALID_CREDENTIALS",
  BUCKET_NOT_FOUND = "STORAGE_BUCKET_NOT_FOUND",
  OBJECT_NOT_FOUND = "STORAGE_OBJECT_NOT_FOUND",
  UPLOAD_FAILED = "STORAGE_UPLOAD_FAILED",
  DELETE_FAILED = "STORAGE_DELETE_FAILED",
  COPY_FAILED = "STORAGE_COPY_FAILED",
  VALIDATION_ERROR = "STORAGE_VALIDATION_ERROR",
  CONFIGURATION_ERROR = "STORAGE_CONFIGURATION_ERROR",
  PROVIDER_ERROR = "STORAGE_PROVIDER_ERROR",
}

export class StorageException extends Error {
  readonly code: StorageErrorCode;
  readonly cause?: unknown;
  readonly providerStatus?: number;
  readonly providerCode?: string;

  constructor(
    code: StorageErrorCode,
    message: string,
    cause?: unknown,
    meta?: {
      providerStatus?: number;
      providerCode?: string;
    },
  ) {
    super(message);
    this.name = "StorageException";
    this.code = code;
    this.cause = cause;
    this.providerStatus = meta?.providerStatus;
    this.providerCode = meta?.providerCode;
  }
}

export class StorageNetworkException extends StorageException {
  constructor(message = "Storage provider network error.", cause?: unknown) {
    super(StorageErrorCode.NETWORK_ERROR, message, cause);
    this.name = "StorageNetworkException";
  }
}

export class StorageTimeoutException extends StorageException {
  constructor(message = "Storage provider request timed out.", cause?: unknown) {
    super(StorageErrorCode.TIMEOUT, message, cause);
    this.name = "StorageTimeoutException";
  }
}

export class StorageInvalidCredentialsException extends StorageException {
  constructor(
    message = "Storage provider credentials are invalid.",
    cause?: unknown,
  ) {
    super(StorageErrorCode.INVALID_CREDENTIALS, message, cause);
    this.name = "StorageInvalidCredentialsException";
  }
}

export class StorageBucketNotFoundException extends StorageException {
  constructor(message = "Storage bucket was not found.", cause?: unknown) {
    super(StorageErrorCode.BUCKET_NOT_FOUND, message, cause);
    this.name = "StorageBucketNotFoundException";
  }
}

export class StorageObjectNotFoundException extends StorageException {
  constructor(message = "Storage object was not found.", cause?: unknown) {
    super(StorageErrorCode.OBJECT_NOT_FOUND, message, cause);
    this.name = "StorageObjectNotFoundException";
  }
}

export class StorageUploadException extends StorageException {
  constructor(message = "Failed to upload object to storage.", cause?: unknown) {
    super(StorageErrorCode.UPLOAD_FAILED, message, cause);
    this.name = "StorageUploadException";
  }
}

export class StorageDeleteException extends StorageException {
  constructor(
    message = "Failed to delete object from storage.",
    cause?: unknown,
  ) {
    super(StorageErrorCode.DELETE_FAILED, message, cause);
    this.name = "StorageDeleteException";
  }
}

export class StorageValidationException extends StorageException {
  constructor(message: string) {
    super(StorageErrorCode.VALIDATION_ERROR, message);
    this.name = "StorageValidationException";
  }
}

export class StorageConfigurationException extends StorageException {
  constructor(message: string) {
    super(StorageErrorCode.CONFIGURATION_ERROR, message);
    this.name = "StorageConfigurationException";
  }
}
