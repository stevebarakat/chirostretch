import { NextResponse } from "next/server";
import {
  getAccessToken,
  updateLeadStatus,
  isZohoConfigured,
} from "@/lib/zoho/client";

/**
 * Test Route for Zoho Integration (Development Only)
 *
 * Verifies the refresh token flow works correctly.
 * GET /api/zoho/test - Test token refresh
 * GET /api/zoho/test?email=test@example.com - Test lead status update
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Only available in development" },
      { status: 403 }
    );
  }

  if (!isZohoConfigured()) {
    return NextResponse.json(
      { error: "Zoho CRM not configured. Check environment variables." },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  try {
    // Test 1: Verify token refresh works
    const accessToken = await getAccessToken();
    const tokenTest = {
      success: true,
      message: "Access token obtained successfully",
      tokenPreview: `${accessToken.substring(0, 10)}...`,
    };

    // If no email provided, just test token refresh
    if (!email) {
      return NextResponse.json({
        tokenTest,
        hint: "Add ?email=lead@example.com to test lead status update",
      });
    }

    // Test 2: Test lead status update (uses a harmless status for testing)
    const leadTest = await updateLeadStatus(email, "Test - OAuth Verified");

    return NextResponse.json({
      tokenTest,
      leadTest: {
        email,
        success: leadTest,
        message: leadTest
          ? "Lead status updated successfully"
          : "Lead not found or update failed",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
