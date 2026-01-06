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
 * Checks if an image URL is from localhost (development)
 */
function isLocalhostUrl(url: string): boolean {
  return url.includes("localhost:8080") || url.includes("127.0.0.1:8080");
}

/**
 * Replaces localhost URLs with production URLs
 */
function replaceLocalhostWithProduction(url: string): string {
  if (isLocalhostUrl(url)) {
    return url.replace(
      /http:\/\/localhost:8080/,
      "https://www.northfloridachiropracticphysicaltherapy.com"
    );
  }
  return url;
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

  // Replace localhost URLs with production URLs
  const processedUrl = replaceLocalhostWithProduction(originalUrl);

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
 * Proxies CMS upload URLs through Next.js to avoid CORS issues with mask-image.
 * URLs like https://cms.chirostretch.site/wp-content/uploads/2025/12/icon.svg
 * become /cms-assets/2025/12/icon.svg
 */
export function proxyCmsUrl(url: string | undefined | null): string {
  if (!url) return "";
  const match = url.match(CMS_UPLOAD_PATTERN);
  if (match) {
    return `/cms-assets/${match[1]}`;
  }
  return url;
}
