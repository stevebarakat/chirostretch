import { NextRequest, NextResponse } from "next/server";
import {
  executeMutation,
  RESET_PASSWORD,
  ResetPasswordResult,
  GraphQLMutationError,
} from "@/lib/graphql/mutations";

/**
 * Reset Password
 *
 * Proxies request to WordPress GraphQL to reset a user's password.
 *
 * Flow:
 * 1. Receive login, key, and new password from set-password page
 * 2. Validate password strength (8+ characters)
 * 3. Call WordPress resetPassword mutation
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

    const data = await executeMutation<ResetPasswordResult>(RESET_PASSWORD, {
      key,
      login,
      password,
    });

    const result = data.resetPassword;

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "reset_failed",
          message: result.message || "Failed to reset password",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("[Reset Password] Error:", error);

    if (error instanceof GraphQLMutationError) {
      return NextResponse.json(
        {
          error: "graphql_error",
          message: error.message,
        },
        { status: 400 }
      );
    }

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
