/**
 * Formatting utility functions for orders, prices, and dates
 * These are pure functions that can be used in both client and server components
 */

/**
 * Format order status for display
 */
export function formatOrderStatus(status?: string | null): string {
  if (!status) return "Unknown";

  // Remove "wc-" prefix if present
  const cleanStatus = status.replace(/^wc-/, "");

  // Convert to title case with spaces
  return cleanStatus
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format order date for display
 */
export function formatOrderDate(date?: string | null): string {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

/**
 * Format price string (e.g., "$100.00")
 */
export function formatPrice(price?: string | null): string {
  if (!price) return "$0.00";

  // If already formatted, return as-is
  if (price.includes("$")) return price;

  // Parse and format
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numPrice);
}
