import fetch from "node-fetch";
import https from "https";

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

  const isDevelopment = process.env.NODE_ENV === "development";
  const agent = isDevelopment
    ? new https.Agent({
        rejectUnauthorized: false,
      })
    : undefined;

  const res = await fetch(wpGraphqlUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    agent,
  });

  const json = await res.json();

  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error("WPGraphQL query failed.");
  }

  return json.data as T;
}
