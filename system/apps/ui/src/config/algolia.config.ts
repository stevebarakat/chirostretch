export const algoliaConfig = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  searchOnlyApiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || "",
  adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY || "",
  indices: {
    products: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PRODUCTS || "products",
    events: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_EVENTS || "events",
    articles: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_ARTICLES || "articles",
    locations: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_LOCATIONS || "locations",
  },
} as const;

export function getAlgoliaConfig() {
  return {
    ...algoliaConfig,
    appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || algoliaConfig.appId,
    searchOnlyApiKey:
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ||
      algoliaConfig.searchOnlyApiKey,
    adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY || algoliaConfig.adminApiKey,
  };
}
