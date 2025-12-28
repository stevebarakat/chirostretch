import { getValidAuthToken } from "./auth/server";
import { getRefreshToken, setAuthCookies } from "./auth/cookies";
import { REFRESH_TOKEN_MUTATION } from "./auth/queries";
import type { RefreshTokenResponse } from "./auth/types";

const WP_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT;

type WPGraphQLFetchOptions<TVars = Record<string, unknown>> = {
  query: string;
  variables?: TVars;
  auth?: boolean;
  revalidate?: number;
  _isRetry?: boolean; // Internal flag to prevent infinite loops
};

/**
 * Check if GraphQL error is an authentication error
 * @internal - Reserved for future use
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isAuthError(errors: Array<{ message: string }>): boolean {
  return errors.some(
    (error) =>
      error.message.toLowerCase().includes("expired") ||
      error.message.toLowerCase().includes("invalid token") ||
      error.message.toLowerCase().includes("unauthenticated")
  );
}

/**
 * Attempt to refresh the auth token
 * Returns the new auth token or null if refresh fails
 */
async function attemptTokenRefresh(): Promise<string | null> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const data = await wpGraphQLFetchInternal<RefreshTokenResponse>({
      query: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken },
      auth: false,
      _isRetry: true, // Prevent recursive refresh attempts
    });

    const newAuthToken = data.refreshToken?.authToken;

    if (newAuthToken) {
      // Store the new auth token
      await setAuthCookies(newAuthToken, refreshToken);
      return newAuthToken;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }

  return null;
}

/**
 * Internal GraphQL fetch implementation
 */
async function wpGraphQLFetchInternal<TData, TVars = Record<string, unknown>>(
  options: WPGraphQLFetchOptions<TVars>
): Promise<TData> {
  const { query, variables, auth = false, revalidate = 60 } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // JWT Authentication
  // When auth: true, retrieve token from httpOnly cookie and add to Authorization header
  if (auth) {
    const token = await getValidAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      // Debug logging
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[wpGraphQLFetch] Using auth token:",
          token.substring(0, 30) + "..."
        );
      }
    } else {
      console.warn(
        "[wpGraphQLFetch] No auth token available for authenticated request"
      );
    }
  }

  let res: Response;
  try {
    res = await fetch(WP_GRAPHQL_ENDPOINT!, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      credentials: "include", // Send cookies with requests
      // Use cache: 'no-store' for authenticated requests and mutations
      ...(auth
        ? { cache: "no-store" as RequestCache }
        : { next: { revalidate } }),
    });
  } catch (error) {
    throw new Error(
      `Failed to connect to WPGraphQL endpoint: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  // Try to parse JSON response even if status is not OK
  // WPGraphQL may return 403 with valid GraphQL response for auth errors
  let json: { data?: TData; errors?: Array<{ message: string }> };
  try {
    json = (await res.json()) as {
      data?: TData;
      errors?: Array<{ message: string }>;
    };
  } catch {
    // If we can't parse JSON and status is not OK, throw HTTP error
    if (!res.ok) {
      const errorMsg = `WPGraphQL fetch failed: ${res.status} ${res.statusText}`;
      console.error("[wpGraphQLFetch]", errorMsg);
      throw new Error(errorMsg);
    }
    throw new Error("WPGraphQL response was not valid JSON");
  }

  // Log warning for non-OK status but continue processing GraphQL response
  if (!res.ok) {
    console.warn(
      `[wpGraphQLFetch] HTTP ${res.status} ${res.statusText} - processing GraphQL response anyway`
    );
  }

  if (json.errors) {
    const errorsStr = JSON.stringify(json.errors, null, 2);
    console.error("WPGraphQL errors:", errorsStr);
    throw new Error(`GraphQL errors:\n${errorsStr}`);
  }

  if (!json.data) {
    throw new Error("WPGraphQL response had no data");
  }

  return json.data;
}

/**
 * Type-safe GraphQL client for WPGraphQL / WooGraphQL with JWT Authentication
 *
 * This function automatically handles token refresh when authentication errors occur:
 * 1. If a GraphQL error indicates an expired/invalid token
 * 2. It attempts to refresh the token using the refresh token
 * 3. If successful, it retries the original request with the new token
 * 4. If refresh fails, it throws an authentication error
 *
 * @param options - GraphQL query options
 * @param options.query - The GraphQL query string
 * @param options.variables - Optional query variables
 * @param options.auth - Whether to include JWT authentication (default: false)
 * @param options.revalidate - Optional revalidation time in seconds (default: 60)
 * @returns Promise resolving to the query data
 * @throws Error if the request fails or returns GraphQL errors
 */
export async function wpGraphQLFetch<TData, TVars = Record<string, unknown>>(
  options: WPGraphQLFetchOptions<TVars>
): Promise<TData> {
  const { _isRetry = false } = options;

  try {
    return await wpGraphQLFetchInternal<TData, TVars>(options);
  } catch (error) {
    // Only attempt refresh if:
    // 1. This is not already a retry attempt
    // 2. Authentication was requested
    // 3. The error is an authentication error
    if (!_isRetry && options.auth && error instanceof Error) {
      const isGraphQLAuthError =
        error.message.includes("GraphQL errors:") &&
        (error.message.toLowerCase().includes("expired") ||
          error.message.toLowerCase().includes("invalid token") ||
          error.message.toLowerCase().includes("unauthenticated"));

      if (isGraphQLAuthError) {
        // Attempt to refresh the token
        const newToken = await attemptTokenRefresh();

        if (newToken) {
          // Retry the original request with the new token
          return await wpGraphQLFetchInternal<TData, TVars>({
            ...options,
            _isRetry: true, // Prevent infinite retry loops
          });
        } else {
          // Refresh failed - throw authentication error
          throw new Error("Authentication failed: Unable to refresh token");
        }
      }
    }

    // Re-throw the original error if we didn't handle it
    throw error;
  }
}
