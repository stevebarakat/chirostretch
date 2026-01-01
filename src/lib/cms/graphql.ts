import { fetchWP } from "./fetch";

/**
 * GraphQL query function for WordPress content
 */

export async function wpQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate: number = 300
) {
  const wpGraphqlUrl = process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT;

  if (!wpGraphqlUrl) {
    throw new Error(
      "NEXT_PUBLIC_WPGRAPHQL_ENDPOINT environment variable is not set. Please configure it in your .env.local file."
    );
  }

  try {
    return await fetchWP<T>({ query, variables, revalidate });
  } catch (error) {
    const cause =
      error instanceof Error && "cause" in error ? error.cause : null;
    const isENotFound =
      (error instanceof Error &&
        "code" in error &&
        error.code === "ENOTFOUND") ||
      (cause instanceof Error && "code" in cause && cause.code === "ENOTFOUND");

    if (isENotFound) {
      throw new Error(
        `Cannot resolve WordPress GraphQL endpoint hostname: ${wpGraphqlUrl}. Please check your NEXT_PUBLIC_WPGRAPHQL_ENDPOINT environment variable and ensure the WordPress server is running and accessible.`
      );
    }
    throw new Error(
      `Failed to connect to WordPress GraphQL endpoint: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
