import React from "react";

/**
 * Utility functions for handling image URLs and fallbacks
 */

// Default fallback images
export const FALLBACK_IMAGES = {
  hero: "/images/carAccident.webp",
  featured:
    "https://res.cloudinary.com/stevebarakat/images/v1761144049/chiropractic-serivces_81321a89/chiropractic-serivces_81321a89.jpg",
  general: "/images/notFound.webp",
} as const;

/**
 * Production CMS URL for URL rewriting
 */
const PRODUCTION_CMS_URL = "https://cms.chirostretch.site";

/**
 * Local development hostnames that need to be rewritten
 * Note: No global flag to avoid lastIndex state issues
 */
const LOCAL_DEV_PATTERNS = [
  /https?:\/\/chirostretch-copy\.local/,
  /https?:\/\/localhost:8080/,
  /https?:\/\/127\.0\.0\.1:8080/,
];

/**
 * Replaces local development URLs with production CMS URLs.
 * Exported for use in components that need to transform image URLs.
 */
export function rewriteImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (process.env.NODE_ENV === "development") return url;
  let result = url;
  for (const pattern of LOCAL_DEV_PATTERNS) {
    result = result.replace(pattern, PRODUCTION_CMS_URL);
  }
  return result;
}

/**
 * Gets a safe image URL with fallback
 */
export function getSafeImageUrl(
  originalUrl: string | undefined | null,
  fallbackType: keyof typeof FALLBACK_IMAGES = "general"
): string {
  if (!originalUrl) {
    return FALLBACK_IMAGES[fallbackType];
  }

  // Replace local development URLs with production CMS URLs
  const processedUrl = rewriteImageUrl(originalUrl);

  return processedUrl;
}

/**
 * Hook for managing image fallbacks with React state
 */
export function useImageFallback(initialUrl: string, fallbackUrl: string) {
  const [currentUrl, setCurrentUrl] = React.useState(initialUrl);
  const [hasError, setHasError] = React.useState(false);

  const handleError = React.useCallback(() => {
    console.error("Image failed to load:", currentUrl);
    if (!hasError && currentUrl !== fallbackUrl) {
      setCurrentUrl(fallbackUrl);
      setHasError(true);
    }
  }, [currentUrl, fallbackUrl, hasError]);

  return {
    currentUrl,
    handleError,
    hasError,
  };
}

const CMS_UPLOAD_PATTERN =
  /^https:\/\/cms\.chirostretch\.site\/wp-content\/uploads\/(.+)$/;

/**
 * Pattern to match local development WordPress upload URLs
 */
const LOCAL_DEV_UPLOAD_PATTERN =
  /^https?:\/\/(?:chirostretch-copy\.local|localhost:8080|127\.0\.0\.1:8080)\/wp-content\/uploads\/(.+)$/;

/**
 * Proxies CMS upload URLs through Next.js to avoid CORS issues with mask-image.
 * URLs like https://cms.chirostretch.site/wp-content/uploads/2025/12/icon.svg
 * become /cms-assets/2025/12/icon.svg
 *
 * Also handles local development URLs by converting them to the proxy path.
 */
export function proxyCmsUrl(url: string | undefined | null): string {
  if (!url) return "";

  // Check for production CMS URL
  const prodMatch = url.match(CMS_UPLOAD_PATTERN);
  if (prodMatch) {
    return `/cms-assets/${prodMatch[1]}`;
  }

  // Check for local development URLs and also proxy them
  const localMatch = url.match(LOCAL_DEV_UPLOAD_PATTERN);
  if (localMatch) {
    return `/cms-assets/${localMatch[1]}`;
  }

  return url;
}
