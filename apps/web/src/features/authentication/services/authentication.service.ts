import type {
  LoginError,
  LoginInput,
  RegisterError,
  RegisterInput,
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
    });

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

export async function registerOrganization(input: RegisterInput) {
  return postAuth<{ success: true }>("/auth/register", input);
}

export async function loginUser(input: LoginInput) {
  return postAuth<{ success: true }>("/auth/login", input);
}
