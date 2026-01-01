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
