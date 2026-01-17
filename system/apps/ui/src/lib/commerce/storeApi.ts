import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

  let data: unknown;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    // Response wasn't JSON (could be HTML error page)
    console.error(
      "[storeApiFetch] Non-JSON response:",
      res.status,
      text.substring(0, 500)
    );
    data = { error: "Store API error", status: res.status };
  }

  // Collect Set-Cookie headers to forward
  // Note: res.headers.get("set-cookie") only returns the FIRST cookie header
  // We need to use getSetCookie() to get all of them
  const setCookieHeaders: string[] = [];

  if (typeof res.headers.getSetCookie === "function") {
    // Modern approach: getSetCookie() returns array of all Set-Cookie headers
    setCookieHeaders.push(...res.headers.getSetCookie());
  } else {
    // Fallback for older Node versions
    const rawSetCookie = res.headers.get("set-cookie");
    if (rawSetCookie) {
      setCookieHeaders.push(
        ...rawSetCookie.split(/,(?=\s*(?:woocommerce_|wp_woocommerce_))/)
      );
    }
  }

  // Debug logging to help troubleshoot cookie issues
  if (setCookieHeaders.length > 0) {
    console.log(`[storeApi] Forwarding ${setCookieHeaders.length} Set-Cookie headers from WordPress`);
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

  // Debug logging
  if (setCookieHeaders.length > 0) {
    console.log(`[createCartResponse] Set ${setCookieHeaders.length} cookies in response`);
  } else {
    console.warn("[createCartResponse] No cookies to set - this may cause session issues");
  }

  return response;
}
