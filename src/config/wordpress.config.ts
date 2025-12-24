export const wordpressConfig = {
  graphqlEndpoint:
    process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ||
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
    "",
  siteUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || "",
  revalidationTime: 300,
  enabledPostTypes: ["page", "post", "product"],
  enabledMenus: ["main-menu", "shop"],
} as const;
