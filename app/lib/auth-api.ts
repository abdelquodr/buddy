const DEFAULT_API_BASE_URL = "https://fe-test.zojapay.com/api/admin";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ??
  DEFAULT_API_BASE_URL;

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

class AuthApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.details = details;
  }
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : ((data as { message?: string; error?: string }).message ??
          (data as { message?: string; error?: string }).error ??
          "Request failed");

    throw new AuthApiError(message, response.status, data);
  }

  return data as T;
};

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  return parseResponse<T>(response);
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
  LoginPayload,
  RegisterPayload,
  ResendOtpPayload,
  VerifyOtpPayload,
  AuthResponse,
};
