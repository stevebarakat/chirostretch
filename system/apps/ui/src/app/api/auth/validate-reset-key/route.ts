import { NextRequest, NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Validate Password Reset Key
 *
 * Proxies request to WordPress API to validate that a password reset key
 * is valid and hasn't expired.
 *
 * Flow:
 * 1. Receive login and key from set-password page
 * 2. Call WordPress validation endpoint
 * 3. Return validation result
 */
export async function POST(request: NextRequest) {
  try {
    const { login, key } = await request.json();

    if (!login || !key) {
      return NextResponse.json(
        { error: "Login and key are required" },
        { status: 400 }
      );
    }

    if (!WP_URL) {
      console.error("[Validate Reset Key] Missing NEXT_PUBLIC_BACKEND_URL");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${WP_URL}/wp-json/chirostretch/v1/auth/validate-reset-key`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, key }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Validate Reset Key] Unexpected error:", error);
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
