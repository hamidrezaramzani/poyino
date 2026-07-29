import type {
  ForgotPasswordError,
  ForgotPasswordInput,
  LoginError,
  LoginInput,
  RegisterError,
  RegisterInput,
  ResetPasswordError,
  ResetPasswordInput,
} from "@poyino/contracts";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: Record<string, string[] | undefined>;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: Record<string, string[] | undefined>,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type ErrorPayload =
  | (RegisterError & {
      error: RegisterError["error"] & {
        details?: Record<string, string[] | undefined>;
      };
    })
  | (LoginError & {
      error: LoginError["error"] & {
        details?: Record<string, string[] | undefined>;
      };
    })
  | (ForgotPasswordError & {
      error: ForgotPasswordError["error"] & {
        details?: Record<string, string[] | undefined>;
      };
    })
  | (ResetPasswordError & {
      error: ResetPasswordError["error"] & {
        details?: Record<string, string[] | undefined>;
      };
    });

async function parseAuthResponse<TSuccess extends { success: true }>(
  response: Response,
): Promise<TSuccess> {
  const payload = (await response.json().catch(() => null)) as
    | TSuccess
    | ErrorPayload
    | null;

  if (!response.ok || !payload || payload.success !== true) {
    const errorPayload = payload && "error" in payload ? payload.error : null;
    throw new ApiRequestError(
      errorPayload?.message ?? "Unexpected error",
      response.status,
      errorPayload?.code,
      errorPayload && "details" in errorPayload
        ? errorPayload.details
        : undefined,
    );
  }

  return payload;
}

async function postAuth<TSuccess extends { success: true }>(
  path: string,
  body: unknown,
): Promise<TSuccess> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return parseAuthResponse(response);
}

export async function registerOrganization(input: RegisterInput) {
  return postAuth<{ success: true }>("/auth/register", input);
}

export async function loginUser(input: LoginInput) {
  return postAuth<{ success: true }>("/auth/login", input);
}

export async function requestPasswordReset(input: ForgotPasswordInput) {
  return postAuth<{ success: true }>("/auth/forgot-password", input);
}

export async function validateResetToken(token: string) {
  const response = await fetch(
    `${API_BASE_URL}/auth/reset-password?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return parseAuthResponse<{ success: true }>(response);
}

export async function resetPassword(input: ResetPasswordInput) {
  return postAuth<{ success: true }>("/auth/reset-password", input);
}
