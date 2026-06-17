const API_URL = "http://localhost:8000";
const TOKEN_KEY = "cc_access_token";
const USER_KEY = "cc_current_user";

export type Tenant = {
  id: number;
  name: string;
};

export type CurrentUser = {
  id: number;
  email: string;
  full_name: string;
  tenant: Tenant;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: CurrentUser;
};

export type RegisterInput = {
  email: string;
  password: string;
  full_name: string;
  tenant_name: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

async function authRequest<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export function saveSession(auth: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, auth.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): CurrentUser | null {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

export async function registerUser(registration: RegisterInput) {
  return authRequest<AuthResponse>(`${API_URL}/auth/register`, registration);
}

export async function loginUser(credentials: LoginInput) {
  return authRequest<AuthResponse>(`${API_URL}/auth/login`, credentials);
}
