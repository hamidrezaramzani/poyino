export enum AiErrorCode {
  NETWORK_ERROR = "AI_NETWORK_ERROR",
  TIMEOUT = "AI_TIMEOUT",
  INVALID_RESPONSE = "AI_INVALID_RESPONSE",
  PROVIDER_UNAVAILABLE = "AI_PROVIDER_UNAVAILABLE",
  NOT_IMPLEMENTED = "AI_NOT_IMPLEMENTED",
  CONFIGURATION_ERROR = "AI_CONFIGURATION_ERROR",
}

export class AiException extends Error {
  readonly code: AiErrorCode;
  readonly cause?: unknown;
  readonly providerStatus?: number;
  readonly providerCode?: string;
  readonly validationPaths?: string[];

  constructor(
    code: AiErrorCode,
    message: string,
    cause?: unknown,
    meta?: {
      providerStatus?: number;
      providerCode?: string;
      validationPaths?: string[];
    },
  ) {
    super(message);
    this.name = "AiException";
    this.code = code;
    this.cause = cause;
    this.providerStatus = meta?.providerStatus;
    this.providerCode = meta?.providerCode;
    this.validationPaths = meta?.validationPaths;
  }
}

export class AiNetworkException extends AiException {
  constructor(message = "AI provider network error.", cause?: unknown) {
    super(AiErrorCode.NETWORK_ERROR, message, cause);
    this.name = "AiNetworkException";
  }
}

export class AiTimeoutException extends AiException {
  constructor(message = "AI provider request timed out.", cause?: unknown) {
    super(AiErrorCode.TIMEOUT, message, cause);
    this.name = "AiTimeoutException";
  }
}

export class AiInvalidResponseException extends AiException {
  constructor(
    message = "AI provider returned an invalid response.",
    cause?: unknown,
    meta?: {
      providerStatus?: number;
      providerCode?: string;
      validationPaths?: string[];
    },
  ) {
    super(AiErrorCode.INVALID_RESPONSE, message, cause, meta);
    this.name = "AiInvalidResponseException";
  }
}

export class AiProviderUnavailableException extends AiException {
  constructor(message = "AI provider is unavailable.", cause?: unknown) {
    super(AiErrorCode.PROVIDER_UNAVAILABLE, message, cause);
    this.name = "AiProviderUnavailableException";
  }
}

export class AiNotImplementedException extends AiException {
  constructor(message = "AI capability is not implemented yet.") {
    super(AiErrorCode.NOT_IMPLEMENTED, message);
    this.name = "AiNotImplementedException";
  }
}
