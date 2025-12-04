import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, getAuthToken } from "@/lib/auth/cookies";
import { wpGraphQLFetch } from "@/lib/wpgraphql";
import { LOGOUT_MUTATION } from "@/lib/auth/queries";

/**
 * POST /api/auth/logout
 * Clear auth cookies and call WPGraphQL logout mutation
 */
export async function POST(request: NextRequest) {
  try {
    // Get auth token before clearing
    const authToken = await getAuthToken();

    // Call WPGraphQL logout mutation if authenticated
    if (authToken) {
      try {
        await wpGraphQLFetch({
          query: LOGOUT_MUTATION,
          auth: true,
        });
      } catch (error) {
        // Continue even if logout mutation fails
        console.error("Logout mutation error:", error);
      }
    }

    // Clear cookies
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
