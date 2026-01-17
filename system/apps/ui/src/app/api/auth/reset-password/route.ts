import { NextRequest, NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Reset Password
 *
 * Proxies request to WordPress API to reset a user's password.
 *
 * Flow:
 * 1. Receive login, key, and new password from set-password page
 * 2. Validate password strength (8+ characters)
 * 3. Call WordPress reset password endpoint
 * 4. Return success/error result
 */
export async function POST(request: NextRequest) {
  try {
    const { login, key, password } = await request.json();

    if (!login || !key || !password) {
      return NextResponse.json(
        { error: "Login, key, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!WP_URL) {
      console.error("[Reset Password] Missing NEXT_PUBLIC_BACKEND_URL");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log(`[Reset Password] Resetting password for user: ${login}`);

    const response = await fetch(
      `${WP_URL}/wp-json/chirostretch/v1/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, key, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[Reset Password] WordPress API error:", data);
      return NextResponse.json(data, { status: response.status });
    }

    console.log(`[Reset Password] Password reset successful for user: ${login}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Reset Password] Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
