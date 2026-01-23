import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import { RedirectRulesSchema, type RedirectRule } from "./types";

const REDIRECTS_QUERY = /* GraphQL */ `
  query GetRedirects {
    chsRedirects {
      fromPath
      toPath
      statusCode
      enabled
    }
  }
`;

type RedirectsQueryResponse = {
  chsRedirects: Array<{
    fromPath: string;
    toPath: string;
    statusCode: number;
    enabled: boolean;
  }> | null;
};

/**
 * Fetch redirect rules from WordPress GraphQL API
 * Returns only enabled rules
 */
export async function fetchRedirects(): Promise<RedirectRule[]> {
  const data = await wpQuery<RedirectsQueryResponse>(REDIRECTS_QUERY, {}, {
    revalidate: 60,
    tags: [CACHE_TAGS.redirects],
  });

  const rules = data.chsRedirects ?? [];

  // Validate with Zod and filter to enabled only
  const parsed = RedirectRulesSchema.parse(rules);
  return parsed.filter((rule) => rule.enabled);
}
