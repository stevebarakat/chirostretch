export function parsePrice(price?: string | number): number {
  if (!price) return 0;
  const priceStr = typeof price === "string" ? price : price.toString();
  const cleaned = priceStr.replace(/[^0-9.]/g, "");
  let numPrice = parseFloat(cleaned);
  if (isNaN(numPrice)) return 0;

  if (!cleaned.includes(".") && numPrice >= 100) {
    numPrice = numPrice / 100;
  }

  return numPrice;
}

export function formatPrice(price?: string | number) {
  const numPrice = parsePrice(price);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(numPrice);
}
