import { NextRequest, NextResponse } from "next/server";
import { LOGIN_MUTATION } from "@/lib/auth/queries";
import type { LoginResponse, LoginCredentials } from "@/lib/auth/types";

const WP_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://chirostretch-copy.local";

const WP_GRAPHQL_ENDPOINT =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT ??
  process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ??
  `${WP_URL}/graphql`;

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
async function restorePersistentCart(authToken: string): Promise<{
  setCookieHeaders: string[];
  cart: CartRestoreResponse["cart"] | null;
}> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/chirostretch/v1/cart/restore`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to restore persistent cart:", await res.text());
      return { setCookieHeaders: [], cart: null };
    }

    // Collect all Set-Cookie headers
    const setCookieHeaders: string[] = [];
    const rawSetCookie = res.headers.get("set-cookie");
    if (rawSetCookie) {
      // Split on comma followed by a cookie name pattern (handles multiple cookies)
      // WooCommerce cookies start with woocommerce_ or wp_woocommerce_
      setCookieHeaders.push(...rawSetCookie.split(/,(?=\s*(?:woocommerce_|wp_woocommerce_))/));
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
 * Extract WC session cookies from Set-Cookie header
 */
function parseWcSessionCookies(rawSetCookie: string | null): string[] {
  if (!rawSetCookie) return [];

  // Split on comma followed by a cookie name pattern
  // WooCommerce cookies start with woocommerce_ or wp_woocommerce_
  return rawSetCookie.split(/,(?=\s*(?:woocommerce_|wp_woocommerce_))/);
}

/**
 * POST /api/auth/login
 * Authenticate user with WPGraphQL JWT and set httpOnly cookies
 * Also captures WC session cookies set during GraphQL login
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

    // Make direct fetch to GraphQL to capture Set-Cookie headers
    // (wpGraphQLFetch helper doesn't expose response headers)
    const graphqlRes = await fetch(WP_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: LOGIN_MUTATION,
        variables: { username, password },
      }),
      cache: "no-store",
    });

    // Capture WC session cookies from GraphQL response
    // These are set by the wc-session-graphql-login.php hook
    const graphqlSetCookies = parseWcSessionCookies(
      graphqlRes.headers.get("set-cookie")
    );

    const json = (await graphqlRes.json()) as {
      data?: { login: LoginResponse["login"] };
      errors?: Array<{ message: string }>;
    };

    if (json.errors) {
      const errorMessage = json.errors[0]?.message || "Authentication failed";
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    if (!json.data?.login) {
      return NextResponse.json(
        { error: "Authentication failed: No login data" },
        { status: 401 }
      );
    }

    const { authToken, refreshToken, user } = json.data.login;

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

    // Forward WC session cookies from GraphQL login
    // These are set by the wc-session-graphql-login.php hook
    for (const cookieHeader of graphqlSetCookies) {
      response.headers.append("Set-Cookie", cookieHeader);
    }

    // Restore user's persistent cart (uses the session created during login)
    // This also returns additional Set-Cookie headers if session was updated
    const { setCookieHeaders } = await restorePersistentCart(authToken);
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
