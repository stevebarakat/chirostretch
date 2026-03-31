import { fetchWP, CacheTag, CACHE_TAGS } from "./fetch";

export { CACHE_TAGS, type CacheTag };

type QueryOptions = {
  revalidate?: number;
  tags?: CacheTag[];
};

export async function wpQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: QueryOptions = {}
) {
  const { revalidate = 300, tags = [] } = options;

  const wpGraphqlUrl = process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT;

  if (!wpGraphqlUrl) {
    throw new Error(
      "NEXT_PUBLIC_WPGRAPHQL_ENDPOINT environment variable is not set. Please configure it in your .env.local file."
    );
  }

  try {
    return await fetchWP<T>({ query, variables, revalidate, tags });
  } catch (error) {
    console.error(
      "WordPress GraphQL fetch failed:",
      error instanceof Error ? error.message : String(error)
    );
    return {} as T;
  }
}
