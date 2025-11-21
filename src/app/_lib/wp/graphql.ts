export async function wpQuery<T>(
  query: string,
  variables: Record<string, unknown> = {}
) {
  const wpGraphqlUrl = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

  if (!wpGraphqlUrl) {
    throw new Error(
      "WORDPRESS_GRAPHQL_ENDPOINT environment variable is not set. Please configure it in your .env.local file."
    );
  }

  let res: Response;
  try {
    res = await fetch(wpGraphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
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
        `Cannot resolve WordPress GraphQL endpoint hostname: ${wpGraphqlUrl}. Please check your WORDPRESS_GRAPHQL_ENDPOINT environment variable and ensure the WordPress server is running and accessible.`
      );
    }
    throw new Error(
      `Failed to connect to WordPress GraphQL endpoint: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  const json = await res.json();

  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error("WPGraphQL query failed.");
  }

  return json.data as T;
}
