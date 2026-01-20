import { NextRequest, NextResponse } from "next/server";
import {
  executeMutation,
  VALIDATE_PASSWORD_RESET_KEY,
  ValidatePasswordResetKeyResult,
  GraphQLMutationError,
} from "@/lib/graphql/mutations";

/**
 * Validate Password Reset Key
 *
 * Proxies request to WordPress GraphQL to validate that a password reset key
 * is valid and hasn't expired.
 *
 * Flow:
 * 1. Receive login and key from set-password page
 * 2. Call WordPress validatePasswordResetKey mutation
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

    const data = await executeMutation<ValidatePasswordResetKeyResult>(
      VALIDATE_PASSWORD_RESET_KEY,
      { login, key }
    );

    const result = data.validatePasswordResetKey;

    if (!result.valid) {
      return NextResponse.json(
        {
          valid: false,
          error: result.error || "invalid_key",
          message: result.message || "Invalid password reset link",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      user_login: result.userLogin,
    });
  } catch (error) {
    console.error("[Validate Reset Key] Error:", error);

    if (error instanceof GraphQLMutationError) {
      return NextResponse.json(
        {
          valid: false,
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
