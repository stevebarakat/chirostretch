import { cookies } from "next/headers";

const WP_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://chirostretch-copy.local";

export type StoreCartItem = {
  key: string;
  id?: number;
  product_id?: number;
  quantity: number;
  name: string;
  prices?: {
    price?: string;
    regular_price?: string;
    sale_price?: string;
  };
  totals?: {
    line_subtotal?: string;
    line_total?: string;
  };
  variation?: {
    id?: number;
  };
  [key: string]: unknown;
};

export type StoreCartTotals = {
  total_price?: string;
  total_items?: string;
  total_items_tax?: string;
  total_fees?: string;
  total_discount?: string;
  total_shipping?: string | null;
  total_tax?: string;
  [key: string]: unknown;
};

export type StoreCart = {
  items?: StoreCartItem[];
  items_count?: number;
  totals?: StoreCartTotals | null;
  [key: string]: unknown;
};

export async function getServerCart(): Promise<StoreCart | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const res = await fetch(`${WP_URL}/wp-json/wc/store/v1/cart`, {
    method: "GET",
    headers: {
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch server cart", res.status);
    return null;
  }

  return res.json();
}
