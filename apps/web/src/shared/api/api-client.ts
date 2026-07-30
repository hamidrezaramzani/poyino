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

type ErrorBody = {
  success: false;
  error: {
    code?: string;
    message?: string;
    details?: Record<string, string[] | undefined>;
  };
};

export async function apiRequest<TSuccess>(
  path: string,
  init?: RequestInit,
): Promise<TSuccess> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as TSuccess;
  }

  const payload = (await response.json().catch(() => null)) as
    | (TSuccess & { success?: true })
    | ErrorBody
    | null;

  if (
    !response.ok ||
    !payload ||
    ("success" in payload && payload.success !== true)
  ) {
    const errorPayload = payload && "error" in payload ? payload.error : null;
    throw new ApiRequestError(
      errorPayload?.message ?? "Unexpected error",
      response.status,
      errorPayload?.code,
      errorPayload?.details,
    );
  }

  return payload as TSuccess;
}
