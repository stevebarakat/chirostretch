import { siteConfig } from "@/config/site.config";
import { themeConfig } from "@/config/theme.config";
import { componentsConfig } from "@/config/components.config";
import { integrationsConfig } from "@/config/integrations.config";
import { wordpressConfig } from "@/config/wordpress.config";

/**
 * Configuration utility functions for safe access and validation
 */

/**
 * Validates that required environment variables are present
 */
export function validateEnvironmentVariables(): {
  isValid: boolean;
  missing: string[];
} {
  const required = ["NEXT_PUBLIC_GRAPHQL_ENDPOINT", "NEXT_PUBLIC_SITE_URL"];

  const missing = required.filter((key) => !process.env[key]);

  return {
    isValid: missing.length === 0,
    missing,
  };
}

/**
 * Gets site configuration with fallback values
 */
export function getSiteConfig() {
  return {
    ...siteConfig,
    url: process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url,
  };
}

/**
 * Gets theme configuration
 */
export function getThemeConfig() {
  return themeConfig;
}

/**
 * Gets components configuration
 */
export function getComponentsConfig() {
  return componentsConfig;
}

/**
 * Gets integrations configuration with environment variable fallbacks
 */
export function getIntegrationsConfig() {
  return {
    ...integrationsConfig,
    googleAnalytics: {
      ...integrationsConfig.googleAnalytics,
      measurementId:
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
        integrationsConfig.googleAnalytics.measurementId,
    },
    cloudinary: {
      ...integrationsConfig.cloudinary,
      cloudName:
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        integrationsConfig.cloudinary.cloudName,
    },
    formspree: {
      ...integrationsConfig.formspree,
      formId:
        process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ||
        integrationsConfig.formspree.formId,
    },
    googleMaps: {
      ...integrationsConfig.googleMaps,
      apiKey:
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
        integrationsConfig.googleMaps.apiKey,
    },
  };
}

/**
 * Gets WordPress configuration with environment variable fallbacks
 */
export function getWordPressConfig() {
  return {
    ...wordpressConfig,
    graphqlEndpoint:
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
      wordpressConfig.graphqlEndpoint,
  };
}

/**
 * Checks if a component is enabled
 */
export function isComponentEnabled(
  componentName: keyof ComponentsConfig
): boolean {
  const config = getComponentsConfig();
  const component = config[componentName];

  if (typeof component === "object" && "enabled" in component) {
    return component.enabled;
  }

  return false;
}

/**
 * Checks if an integration is enabled
 */
export function isIntegrationEnabled(
  integrationName: keyof IntegrationsConfig
): boolean {
  const config = getIntegrationsConfig();
  const integration = config[integrationName];

  if (typeof integration === "object" && "enabled" in integration) {
    return integration.enabled;
  }

  return false;
}

/**
 * Gets a theme color value
 */
export function getThemeColor(
  colorName: keyof ThemeConfig["colors"]
): string | ThemeConfig["colors"]["text"] {
  const config = getThemeConfig();
  return config.colors[colorName];
}

/**
 * Validates all configurations
 */
export function validateAllConfigs(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate environment variables
  const envValidation = validateEnvironmentVariables();
  if (!envValidation.isValid) {
    errors.push(
      `Missing environment variables: ${envValidation.missing.join(", ")}`
    );
  }

  // Validate WordPress endpoint
  const wpConfig = getWordPressConfig();
  if (!wpConfig.graphqlEndpoint) {
    errors.push("WordPress GraphQL endpoint is not configured");
  }

  // Validate site configuration
  const siteConfig = getSiteConfig();
  if (!siteConfig.name || !siteConfig.description) {
    errors.push("Site name and description are required");
  }

  if (!siteConfig.contact.phone || !siteConfig.contact.email) {
    errors.push("Contact phone and email are required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
