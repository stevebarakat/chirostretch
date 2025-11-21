const WP_GRAPHQL_ENDPOINT =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT ?? "http://chirostretch.local/graphql";

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
  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate },
    body: JSON.stringify({ query, variables }),
  });

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
