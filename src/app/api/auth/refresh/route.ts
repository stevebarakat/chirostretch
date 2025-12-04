import { NextRequest, NextResponse } from "next/server";
import { getRefreshToken, setAuthCookies } from "@/lib/auth/cookies";
import { wpGraphQLFetch } from "@/lib/wpgraphql";
import { REFRESH_TOKEN_MUTATION } from "@/lib/auth/queries";
import type { RefreshTokenResponse } from "@/lib/auth/types";

/**
 * POST /api/auth/refresh
 * Refresh the auth token using the refresh token
 */
export async function POST(request: NextRequest) {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token found" },
        { status: 401 }
      );
    }

    // Call WPGraphQL refresh mutation
    const data = await wpGraphQLFetch<RefreshTokenResponse>({
      query: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken },
      auth: false, // Don't use auth for refresh
    });

    const newAuthToken = data.refreshToken?.authToken;

    if (!newAuthToken) {
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: 401 }
      );
    }

    // Set new auth token (keep the same refresh token)
    await setAuthCookies(newAuthToken, refreshToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Token refresh error:", error);

    return NextResponse.json(
      { error: "Failed to refresh authentication token" },
      { status: 401 }
    );
  }
}
