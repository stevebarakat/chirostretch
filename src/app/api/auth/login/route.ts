import { NextRequest, NextResponse } from "next/server";
import { wpGraphQLFetch } from "@/lib/wpgraphql";
import { setAuthCookies } from "@/lib/auth/cookies";
import { LOGIN_MUTATION } from "@/lib/auth/queries";
import type { LoginResponse, LoginCredentials } from "@/lib/auth/types";

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

    // Set httpOnly cookies
    await setAuthCookies(authToken, refreshToken);

    // Return user data (without tokens)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        databaseId: user.databaseId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    // Check if it's a GraphQL error (invalid credentials)
    const errorMessage =
      error instanceof Error ? error.message : "Authentication failed";

    if (errorMessage.includes("invalid") || errorMessage.includes("incorrect")) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
