import { wpGraphQLFetch } from "@/lib/wpgraphql";
import { getAuthToken, getRefreshToken, setAuthCookies } from "./cookies";
import { REFRESH_TOKEN_MUTATION } from "./queries";
import type { RefreshTokenResponse } from "./types";

/**
 * Get auth token with automatic refresh if expired
 * This should be used by wpGraphQLFetch when auth: true
 */
export async function getValidAuthToken(): Promise<string | null> {
  let authToken = await getAuthToken();

  // If no auth token, try to refresh
  if (!authToken) {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      // Attempt to refresh the token
      const data = await wpGraphQLFetch<RefreshTokenResponse>({
        query: REFRESH_TOKEN_MUTATION,
        variables: { refreshToken },
        auth: false, // Don't use auth for refresh mutation
      });

      const newAuthToken = data.refreshToken?.authToken;

      if (newAuthToken) {
        // Store the new auth token
        await setAuthCookies(newAuthToken, refreshToken);
        authToken = newAuthToken;
      }
    } catch (error) {
      console.error("Failed to refresh auth token:", error);
      return null;
    }
  }

  return authToken;
}

/**
 * Server-side helper to check if user is authenticated
 */
export async function requireAuth(): Promise<boolean> {
  const token = await getValidAuthToken();
  return token !== null;
}
