import { cookies } from "next/headers";

/**
 * Cookie names for JWT tokens
 */
export const AUTH_TOKEN_COOKIE = "wp-auth-token";
export const REFRESH_TOKEN_COOKIE = "wp-refresh-token";

/**
 * Cookie configuration
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const AUTH_TOKEN_MAX_AGE = 60 * 5; // 5 minutes (WPGraphQL JWT default)
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Set auth tokens in cookies (server-side only)
 */
export async function setAuthCookies(
  authToken: string,
  refreshToken: string
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_TOKEN_COOKIE, authToken, {
    ...COOKIE_OPTIONS,
    maxAge: AUTH_TOKEN_MAX_AGE,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

/**
 * Get auth token from cookies (server-side only)
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE);
  return token?.value || null;
}

/**
 * Get refresh token from cookies (server-side only)
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(REFRESH_TOKEN_COOKIE);
  return token?.value || null;
}

/**
 * Clear all auth cookies (server-side only)
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

/**
 * Check if user is authenticated by checking for auth token
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return token !== null;
}
