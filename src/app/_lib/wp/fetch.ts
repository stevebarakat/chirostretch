const WP_GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ??
  "http://chirostretch-copy.local/graphql";

const FETCH_TIMEOUT = 30000; // 30 seconds (less than Next.js 60s build timeout)

type FetchWPOptions = {
  query: string;
  variables?: Record<string, unknown>;
  revalidate?: number;
};

export async function fetchWP<T>({
  query,
  variables,
  revalidate = 300,
}: FetchWPOptions): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  let res: Response;
  try {
    res = await fetch(WP_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Disable cache in development, use revalidate with tags in production
      ...(process.env.NODE_ENV === "development"
        ? { cache: "no-store" as const }
        : {
            next: {
              revalidate,
              tags: ["wordpress-content"],
            },
          }),
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    // Clear timeout on successful fetch
    clearTimeout(timeoutId);
  } catch (error) {
    // Clear timeout on error
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `WPGraphQL request timed out after ${FETCH_TIMEOUT}ms. The WordPress server may be slow or unreachable.`
      );
    }

    const cause =
      error instanceof Error && "cause" in error ? error.cause : null;
    const isENotFound =
      (error instanceof Error &&
        "code" in error &&
        error.code === "ENOTFOUND") ||
      (cause instanceof Error && "code" in cause && cause.code === "ENOTFOUND");

    if (isENotFound) {
      throw new Error(
        `Cannot resolve WordPress GraphQL endpoint hostname: ${WP_GRAPHQL_ENDPOINT}. Please check your NEXT_PUBLIC_WPGRAPHQL_ENDPOINT environment variable and ensure the WordPress server is running and accessible.`
      );
    }

    throw new Error(
      `Failed to connect to WordPress GraphQL endpoint: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  let json: { data?: T; errors?: unknown };
  try {
    json = (await res.json()) as { data?: T; errors?: unknown };
  } catch {
    if (!res.ok) {
      throw new Error(
        `WPGraphQL fetch failed: ${res.status} ${res.statusText}. Could not parse response as JSON.`
      );
    }
    throw new Error("WPGraphQL response was not valid JSON");
  }

  if (!res.ok) {
    const errorMessage = `WPGraphQL fetch failed: ${res.status} ${res.statusText}`;
    if (json.errors) {
      const errorsStr = JSON.stringify(json.errors, null, 2);
      console.error("WPGraphQL errors:", errorsStr);
      throw new Error(`${errorMessage}\nGraphQL errors:\n${errorsStr}`);
    }
    throw new Error(errorMessage);
  }

  if (!json.data) {
    if (json.errors) {
      const errorsStr = JSON.stringify(json.errors, null, 2);
      console.error("WPGraphQL errors:", errorsStr);
      throw new Error(
        `WPGraphQL response had no data.\nGraphQL errors:\n${errorsStr}`
      );
    }
    throw new Error("WPGraphQL response had no data");
  }

  return json.data;
}
