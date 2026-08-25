import type { SignInInput, SignUpInput, User } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError("Could not reach the server. Is the API running?", 0);
  }

  if (!response.ok) {
    let detail = response.statusText || "Something went wrong.";
    try {
      const body = await response.json();
      if (typeof body.detail === "string") {
        detail = body.detail;
      } else if (Array.isArray(body.detail)) {
        const messages = body.detail
          .map((item: { msg?: string }) => item.msg)
          .filter(Boolean);
        if (messages.length > 0) detail = messages.join(". ");
      }
    } catch {
      // keep statusText fallback
    }
    throw new ApiError(detail, response.status);
  }

  return response.json() as Promise<T>;
}

export function signUp(input: SignUpInput) {
  return request<User>("/signup", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      full_name: input.full_name || null,
      password: input.password,
    }),
  });
}

export function signIn(input: SignInInput) {
  return request<User>("/signin", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function signOut() {
  return request<{ detail: string }>("/signout", { method: "POST" });
}

export async function getMeWithToken(token: string): Promise<User | null> {
  const res = await fetch(`${API_URL}/customers/me`, {
    headers: { Cookie: `access_token=${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}
