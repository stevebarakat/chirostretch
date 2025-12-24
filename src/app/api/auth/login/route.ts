import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { wpGraphQLFetch } from "@/lib/wpgraphql";
import { LOGIN_MUTATION } from "@/lib/auth/queries";
import type { LoginResponse, LoginCredentials } from "@/lib/auth/types";

const WP_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://chirostretch-copy.local";

// Staff roles that should use the staff dashboard
const STAFF_ROLES = [
  "chiropractor",
  "office_manager",
  "massage_therapist",
  "physical_therapist",
  "stretch_therapist",
  "acupuncturist",
];

type CartRestoreResponse = {
  success: boolean;
  cart_token?: string;
  cart?: {
    items: Array<{
      key: string;
      id: number;
      quantity: number;
      name: string;
      price: string;
      line_total: number;
    }>;
    items_count: number;
    total: string;
  };
};

/**
 * Restore user's persistent cart after login
 * Returns WC session cookies and cart data
 */
async function restorePersistentCart(
  authToken: string,
  existingCookies: string
): Promise<{
  setCookieHeaders: string[];
  cart: CartRestoreResponse["cart"] | null;
}> {
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    };

    // Forward existing session cookies so WordPress can access the guest cart
    if (existingCookies) {
      headers["Cookie"] = existingCookies;
      console.log("Forwarding cookies to cart/restore:", existingCookies);
    }

    const res = await fetch(`${WP_URL}/wp-json/chirostretch/v1/cart/restore`, {
      method: "POST",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to restore persistent cart:", await res.text());
      return { setCookieHeaders: [], cart: null };
    }

    // Collect all Set-Cookie headers
    const setCookieHeaders: string[] = [];
    const rawSetCookie = res.headers.get("set-cookie");
    console.log("Raw Set-Cookie from cart/restore:", rawSetCookie);
    if (rawSetCookie) {
      // Split on comma followed by a cookie name pattern (handles multiple cookies)
      // WooCommerce cookies start with woocommerce_ or wp_woocommerce_
      setCookieHeaders.push(...rawSetCookie.split(/,(?=\s*(?:woocommerce_|wp_woocommerce_))/));
      console.log("Parsed Set-Cookie headers:", setCookieHeaders.length);
    }

    const data = (await res.json()) as CartRestoreResponse;
    return {
      setCookieHeaders,
      cart: data.cart || null,
    };
  } catch (error) {
    console.error("Error restoring persistent cart:", error);
    return { setCookieHeaders: [], cart: null };
  }
}

/**
 * Get the default redirect URL based on user role
 */
function getRedirectForRole(role: string): string {
  if (STAFF_ROLES.includes(role)) {
    return "/staff";
  }
  if (role === "franchise_applicant") {
    return "/application";
  }
  if (role === "franchisee") {
    return "/franchisee";
  }
  if (role === "lead") {
    return "/dashboard";
  }
  // Default for customers and other roles
  return "/dashboard";
}

/**
 * POST /api/auth/login
 * Authenticate user with WPGraphQL JWT and set httpOnly cookies
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginCredentials;
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Call WPGraphQL login mutation
    const data = await wpGraphQLFetch<LoginResponse>({
      query: LOGIN_MUTATION,
      variables: { username, password },
      auth: false, // Don't use auth for login
    });

    const { authToken, refreshToken, user } = data.login;

    if (!authToken || !refreshToken) {
      return NextResponse.json(
        { error: "Authentication failed: No tokens received" },
        { status: 401 }
      );
    }

    // Extract user roles
    const roles = user.roles?.nodes?.map((r) => r.name) || [];
    // Get primary role (first role, or 'subscriber' as fallback)
    const primaryRole = roles[0] || "subscriber";

    // Get role-based redirect URL
    const redirectUrl = getRedirectForRole(primaryRole);

    // Create response with user data and redirect URL
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        databaseId: user.databaseId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        roles,
      },
      redirectUrl,
    });

    // Set httpOnly cookies on the response
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    response.cookies.set("wp-auth-token", authToken, {
      ...cookieOptions,
      maxAge: 3600, // 1 hour
    });

    response.cookies.set("wp-refresh-token", refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    // Set user role cookie (NOT httpOnly so middleware can read it)
    response.cookies.set("wp-user-role", primaryRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    // Get existing WC session cookies from the browser to forward to WordPress
    // This allows WordPress to access any guest cart that existed before login
    const cookieStore = await cookies();
    const existingWcCookies = cookieStore
      .getAll()
      .filter(
        (c) =>
          c.name.startsWith("wp_woocommerce_session") ||
          c.name.startsWith("woocommerce_")
      )
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Restore user's persistent cart and forward WC session cookies
    // The cart/restore endpoint creates a guest session for Store API compatibility
    const { setCookieHeaders } = await restorePersistentCart(
      authToken,
      existingWcCookies
    );
    for (const cookieHeader of setCookieHeaders) {
      response.headers.append("Set-Cookie", cookieHeader);
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);

    // Log full error details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Check if it's a GraphQL error (invalid credentials)
    const errorMessage =
      error instanceof Error ? error.message : "Authentication failed";

    if (errorMessage.includes("invalid") || errorMessage.includes("incorrect")) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Return detailed error in development
    return NextResponse.json(
      {
        error: "An error occurred during login",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
