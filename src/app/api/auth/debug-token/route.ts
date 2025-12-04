import { NextResponse } from "next/server";
import { getAuthToken, getRefreshToken } from "@/lib/auth/cookies";

/**
 * GET /api/auth/debug-token
 * Debug endpoint to check what tokens are stored in cookies
 */
export async function GET() {
  try {
    const authToken = await getAuthToken();
    const refreshToken = await getRefreshToken();

    return NextResponse.json(
      {
        hasAuthToken: !!authToken,
        hasRefreshToken: !!refreshToken,
        authTokenPreview: authToken ? `${authToken.substring(0, 20)}...` : null,
        refreshTokenPreview: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Debug token error:", error);
    return NextResponse.json(
      {
        error: "Failed to debug tokens",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
