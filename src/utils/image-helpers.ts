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
export function isLocalhostUrl(url: string): boolean {
  return url.includes("localhost:8080") || url.includes("127.0.0.1:8080");
}

/**
 * Replaces localhost URLs with production URLs
 */
export function replaceLocalhostWithProduction(url: string): string {
  if (isLocalhostUrl(url)) {
    // Replace localhost:8080 with your production WordPress URL
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
 * Handles image loading errors with fallback
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string
): void {
  const target = event.currentTarget;
  console.error("Image failed to load:", target.src);

  // Only fallback if we haven't already tried the fallback
  if (target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  } else {
    // If fallback also fails, hide the image
    target.style.display = "none";
  }
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
