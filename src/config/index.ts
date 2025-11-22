export { siteConfig } from "./site.config";
export { wordpressConfig } from "./wordpress.config";

export function getSiteConfig() {
  return {
    ...siteConfig,
    url: process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url,
  };
}

export function getWordPressConfig() {
  return {
    ...wordpressConfig,
    graphqlEndpoint:
      process.env.WORDPRESS_GRAPHQL_ENDPOINT ||
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
      wordpressConfig.graphqlEndpoint,
    siteUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || wordpressConfig.siteUrl,
  };
}

export function validateEnvironmentVariables(): {
  isValid: boolean;
  missing: string[];
} {
  const required: string[] = [];
  const optional = [
    "WORDPRESS_GRAPHQL_ENDPOINT",
    "NEXT_PUBLIC_GRAPHQL_ENDPOINT",
    "NEXT_PUBLIC_WORDPRESS_URL",
    "NEXT_PUBLIC_SITE_URL",
  ];

  const missing = required.filter((key) => !process.env[key]);

  return {
    isValid: missing.length === 0,
    missing,
  };
}
