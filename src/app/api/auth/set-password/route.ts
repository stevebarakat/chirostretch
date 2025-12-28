import { NextRequest, NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

type SetPasswordRequest = {
  key: string;
  login: string;
  password: string;
};

/**
 * POST /api/auth/set-password
 * Validate reset key and set new password via WordPress REST API
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SetPasswordRequest;
    const { key, login, password } = body;

    // Validate input
    if (!key || !login || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Call WordPress REST API to reset password
    // WordPress provides this endpoint: /wp-json/wp/v2/users/reset-password
    // But it requires a custom endpoint or we use the validate/reset approach

    // First, validate the key using WordPress
    const validateResponse = await fetch(
      `${WP_URL}/wp-json/chirostretch/v1/auth/validate-reset-key`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, login }),
      }
    );

    if (!validateResponse.ok) {
      const error = await validateResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.message || "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    // Now set the password
    const resetResponse = await fetch(
      `${WP_URL}/wp-json/chirostretch/v1/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, login, password }),
      }
    );

    if (!resetResponse.ok) {
      const error = await resetResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.message || "Failed to set password" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password set successfully",
    });
  } catch (error) {
    console.error("Set password error:", error);

    return NextResponse.json(
      {
        error: "An error occurred while setting password",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
