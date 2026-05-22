const DEFAULT_API_BASE_URL = "https://fe-test.zojapay.com/api/admin";
const DEFAULT_REQUEST_TIMEOUT_MS = 30000;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ??
  (process.env.NODE_ENV === "production" ? "" : DEFAULT_API_BASE_URL);
const parsedTimeoutMs = Number(
  process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? DEFAULT_REQUEST_TIMEOUT_MS,
);
const REQUEST_TIMEOUT_MS = Number.isFinite(parsedTimeoutMs)
  ? Math.max(1000, parsedTimeoutMs)
  : DEFAULT_REQUEST_TIMEOUT_MS;

const buildApiUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, "");
  return `${API_BASE_URL}/${normalizedPath}`;
};

type AuthTokenResponse = {
  token?: string;
  access_token?: string;
  accessToken?: string;
};

type AuthResponse<T = Record<string, unknown>> = T & AuthTokenResponse;

type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type VerifyOtpPayload = {
  otp: string;
};

type ResendOtpPayload = {
  email: string;
};

type AuthApiErrorCode =
  | "HTTP_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  | "ABORTED"
  | "UNEXPECTED_ERROR";

type RequestOptions = RequestInit & {
  timeoutMs?: number;
};

class AuthApiError extends Error {
  status: number;
  details?: unknown;
  code: AuthApiErrorCode;
  retriable: boolean;

  constructor(
    message: string,
    status: number,
    details?: unknown,
    code: AuthApiErrorCode = "HTTP_ERROR",
    retriable = false,
  ) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.details = details;
    this.code = code;
    this.retriable = retriable;
  }
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type") ?? "";
  let data: unknown;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : ((data as { message?: string; error?: string }).message ??
          (data as { message?: string; error?: string }).error ??
          "Request failed");

    throw new AuthApiError(message, response.status, data, "HTTP_ERROR", false);
  }

  return data as T;
};

const request = async <T>(
  path: string,
  init: RequestOptions = {},
): Promise<T> => {
  if (!API_BASE_URL) {
    throw new AuthApiError(
      "API base URL is not configured.",
      500,
      null,
      "UNEXPECTED_ERROR",
      false,
    );
  }

  const timeoutMs = Number.isFinite(init.timeoutMs)
    ? Math.max(1000, Number(init.timeoutMs))
    : REQUEST_TIMEOUT_MS;
  const controller = new AbortController();
  let didTimeout = false;
  const timeoutId = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, timeoutMs);
  const externalSignal = init.signal;
  const abortFromExternal = () => controller.abort();

  const requestInit: RequestInit = { ...init };
  if ("timeoutMs" in requestInit) {
    delete (requestInit as RequestOptions).timeoutMs;
  }

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", abortFromExternal, {
        once: true,
      });
    }
  }

  try {
    const response = await fetch(buildApiUrl(path), {
      ...requestInit,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(requestInit.headers ?? {}),
      },
    });

    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    const errorName =
      typeof error === "object" && error !== null && "name" in error
        ? String((error as { name?: unknown }).name)
        : "";

    if (errorName === "AbortError") {
      const message = externalSignal?.aborted
        ? "Request was cancelled"
        : "Request timed out. Please try again.";
      if (externalSignal?.aborted) {
        throw new AuthApiError(message, 499, error, "ABORTED", false);
      }

      if (didTimeout) {
        throw new AuthApiError(message, 408, error, "TIMEOUT_ERROR", true);
      }

      throw new AuthApiError(message, 0, error, "ABORTED", false);
    }

    if (error instanceof TypeError) {
      throw new AuthApiError(
        "Network error. Please check your internet connection and try again.",
        0,
        error,
        "NETWORK_ERROR",
        true,
      );
    }

    throw new AuthApiError(
      "Unexpected error. Please try again.",
      0,
      error,
      "UNEXPECTED_ERROR",
      false,
    );
  } finally {
    clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener("abort", abortFromExternal);
    }
  }
};

const extractNestedToken = (value: unknown): string | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const directToken =
    typeof record.token === "string"
      ? record.token
      : typeof record.access_token === "string"
        ? record.access_token
        : typeof record.accessToken === "string"
          ? record.accessToken
          : null;

  if (directToken) {
    return directToken;
  }

  return extractNestedToken(record.data);
};

export const getAuthTokenFromResponse = (response: unknown) =>
  extractNestedToken(response);

export const authApi = {
  async register(payload: RegisterPayload) {
    return request<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(payload),
      timeoutMs: 45000,
    });
  },

  async login(payload: LoginPayload) {
    return request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async verifyOtp(payload: VerifyOtpPayload, token: string) {
    return request<AuthResponse>("/verify-otp", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  async resendOtp(payload: ResendOtpPayload, token: string) {
    return request<AuthResponse>("/resend-otp", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
};

export { AuthApiError };
export type {
  AuthApiErrorCode,
  LoginPayload,
  RegisterPayload,
  ResendOtpPayload,
  VerifyOtpPayload,
  AuthResponse,
};
