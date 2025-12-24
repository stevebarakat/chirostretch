import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WP_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://chirostretch-copy.local";

type StoreApiOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: unknown;
};

/**
 * Make a request to WooCommerce Store API with session cookie forwarding
 */
export async function storeApiFetch({ method, path, body }: StoreApiOptions) {
  const cookieStore = await cookies();

  // Build cookie header for WC session
  // Forward all WooCommerce-related cookies
  const wcCookies = cookieStore
    .getAll()
    .filter(
      (c) =>
        c.name.startsWith("wp_woocommerce_session") ||
        c.name.startsWith("woocommerce_")
    )
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (wcCookies) {
    headers["cookie"] = wcCookies;
  }

  const res = await fetch(`${WP_URL}/wp-json/wc/store/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json();

  // Collect Set-Cookie headers to forward
  const setCookieHeaders: string[] = [];
  const rawSetCookie = res.headers.get("set-cookie");
  if (rawSetCookie) {
    setCookieHeaders.push(...rawSetCookie.split(/,(?=\s*(?:woocommerce_|wp_woocommerce_))/));
  }

  return {
    data,
    status: res.status,
    setCookieHeaders,
  };
}

/**
 * Create a NextResponse with WC session cookies forwarded
 */
export function createCartResponse(
  data: unknown,
  status: number,
  setCookieHeaders: string[]
) {
  const response = NextResponse.json(data, { status });

  // Forward WooCommerce session cookies
  for (const cookieHeader of setCookieHeaders) {
    response.headers.append("Set-Cookie", cookieHeader);
  }

  return response;
}
