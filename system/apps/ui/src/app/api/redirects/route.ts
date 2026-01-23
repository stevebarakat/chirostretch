import { NextResponse } from "next/server";
import { fetchRedirects } from "@/lib/redirects/fetch";

/**
 * GET /api/redirects
 *
 * Returns the current redirect rules from WordPress.
 * Used by middleware in development mode.
 */
export async function GET() {
  try {
    const rules = await fetchRedirects();
    return NextResponse.json(rules);
  } catch (error) {
    console.error("[api/redirects] Error fetching redirects:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch redirects",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
