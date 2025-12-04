import { getValidAuthToken } from "./auth/server";

const WP_GRAPHQL_ENDPOINT =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT ??
  process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ??
  process.env.WP_GRAPHQL_ENDPOINT ??
  "http://chirostretch-copy.local/graphql";

type WPGraphQLFetchOptions<TVars = Record<string, unknown>> = {
  query: string;
  variables?: TVars;
  auth?: boolean;
  revalidate?: number;
};

/**
 * Type-safe GraphQL client for WPGraphQL / WooGraphQL with JWT Authentication
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
    }
  }

  let res: Response;
  try {
    res = await fetch(WP_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      // Use cache: 'no-store' for authenticated requests and mutations
      ...(auth ? { cache: "no-store" as RequestCache } : { next: { revalidate } }),
    });
  } catch (error) {
    throw new Error(
      `Failed to connect to WPGraphQL endpoint: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  if (!res.ok) {
    throw new Error(`WPGraphQL fetch failed: ${res.status} ${res.statusText}`);
  }

  let json: { data?: TData; errors?: Array<{ message: string }> };
  try {
    json = (await res.json()) as {
      data?: TData;
      errors?: Array<{ message: string }>;
    };
  } catch (parseError) {
    throw new Error("WPGraphQL response was not valid JSON");
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
