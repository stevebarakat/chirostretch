import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearAuthCookies, getAuthToken } from "@/lib/auth/cookies";

const WP_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://chirostretch-copy.local";

/**
 * Save the user's cart to persistent storage before logout
 */
async function savePersistentCart(authToken: string): Promise<void> {
  const cookieStore = await cookies();

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
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  if (wcCookies) {
    headers["cookie"] = wcCookies;
  }

  try {
    const res = await fetch(`${WP_URL}/wp-json/chirostretch/v1/cart/save`, {
      method: "POST",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to save persistent cart:", await res.text());
    }
  } catch (error) {
    console.error("Error saving persistent cart:", error);
  }
}

/**
 * Clear the WooCommerce session on the WordPress side
 */
async function clearWooCommerceSession(): Promise<void> {
  const cookieStore = await cookies();
  const existingCookies = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    await fetch(`${WP_URL}/wp-json/chirostretch/v1/cart/clear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(existingCookies ? { cookie: existingCookies } : {}),
      },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Error clearing WooCommerce session:", error);
  }
}

async function clearWooCommerceSessionCookies() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  for (const cookie of allCookies) {
    if (
      cookie.name.startsWith("wp_woocommerce_session") ||
      cookie.name.startsWith("woocommerce_")
    ) {
      cookieStore.delete(cookie.name);
    }
  }
}

/**
 * POST /api/auth/logout
 * 1. Save the current cart to user meta (persistent cart)
 * 2. Clear WooCommerce session on WordPress side
 * 3. Clear session cookies on Next.js side
 * 4. Clear auth cookies
 *
 * JWT expires naturally - no server-side revocation needed.
 * The cart is preserved in user meta and restored on next login.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  try {
    // Get auth token before clearing
    const authToken = await getAuthToken();

    // Save the cart to persistent storage before logout (if authenticated)
    if (authToken) {
      await savePersistentCart(authToken);
    }

    // Clear WooCommerce session on WordPress side
    await clearWooCommerceSession();

    // Clear WooCommerce session cookies on Next.js side
    await clearWooCommerceSessionCookies();

    // Clear auth cookies - JWT expires naturally, no server revocation needed
    await clearAuthCookies();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);

    // Still clear cookies even if there's an error
    try {
      await clearAuthCookies();
    } catch {
      // Ignore cookie clearing errors
    }

    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
