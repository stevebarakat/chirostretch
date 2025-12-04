import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/cookies";

const VIEWER_QUERY = `
  query ViewerTest {
    viewer {
      id
      username
      email
    }
  }
`;

/**
 * GET /api/auth/test-viewer
 * Test endpoint to verify token is being sent correctly to WordPress
 */
export async function GET() {
  try {
    const authToken = await getAuthToken();

    if (!authToken) {
      return NextResponse.json(
        {
          error: "No auth token found in cookies",
        },
        { status: 401 }
      );
    }

    const wpGraphqlUrl =
      process.env.WORDPRESS_GRAPHQL_ENDPOINT ??
      process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ??
      process.env.WP_GRAPHQL_ENDPOINT ??
      "http://chirostretch-copy.local/graphql";

    // Test direct request with token
    const response = await fetch(wpGraphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: VIEWER_QUERY,
      }),
    });

    const data = await response.json();

    return NextResponse.json(
      {
        hasToken: true,
        tokenPreview: `${authToken.substring(0, 30)}...`,
        responseStatus: response.status,
        responseData: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Test viewer error:", error);
    return NextResponse.json(
      {
        error: "Failed to test viewer query",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
