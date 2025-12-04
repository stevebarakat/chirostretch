import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth/cookies";

/**
 * GET /api/auth/clear
 * Clear authentication cookies
 */
export async function GET() {
  try {
    await clearAuthCookies();

    return NextResponse.json(
      {
        success: true,
        message: "Authentication cookies cleared",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Clear cookies error:", error);
    return NextResponse.json(
      {
        error: "Failed to clear cookies",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
