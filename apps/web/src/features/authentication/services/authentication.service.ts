import type { RegisterInput, RegisterError } from "@poyino/contracts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

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

export async function registerOrganization(input: RegisterInput) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => null)) as
    | { success: true }
    | (RegisterError & {
        error: RegisterError["error"] & {
          details?: Record<string, string[] | undefined>;
        };
      })
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
