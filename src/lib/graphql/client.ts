const WP_GRAPHQL_ENDPOINT =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT ??
  process.env.WP_GRAPHQL_ENDPOINT ??
  "http://chirostretch-copy.local/graphql";

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error(JSON.stringify(json.errors));
  }

  return json.data;
}
