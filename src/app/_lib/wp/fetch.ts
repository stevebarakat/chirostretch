const WP_GRAPHQL_ENDPOINT =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT ??
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
      next: { revalidate },
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
        `Cannot resolve WordPress GraphQL endpoint hostname: ${WP_GRAPHQL_ENDPOINT}. Please check your WORDPRESS_GRAPHQL_ENDPOINT environment variable and ensure the WordPress server is running and accessible.`
      );
    }

    throw new Error(
      `Failed to connect to WordPress GraphQL endpoint: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  if (!res.ok) {
    throw new Error(`WPGraphQL fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown };

  if (!json.data) {
    if (json.errors) {
      console.error("WPGraphQL errors:", JSON.stringify(json.errors, null, 2));
    }
    throw new Error("WPGraphQL response had no data");
  }

  return json.data;
}
