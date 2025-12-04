import { NextResponse } from "next/server";
import { getAuthToken, getRefreshToken } from "@/lib/auth/cookies";
import { wpGraphQLFetch } from "@/lib/wpgraphql";

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
 * GET /api/auth/test-flow
 * Test endpoint to debug the entire authentication flow
 */
export async function GET() {
  try {
    const authToken = await getAuthToken();
    const refreshToken = await getRefreshToken();

    const result: Record<string, unknown> = {
      step1_cookiesCheck: {
        hasAuthToken: !!authToken,
        hasRefreshToken: !!refreshToken,
        authTokenPreview: authToken ? `${authToken.substring(0, 40)}...` : null,
      },
    };

    if (!authToken) {
      result.error = "No auth token in cookies - user not logged in";
      return NextResponse.json(result, { status: 401 });
    }

    // Test wpGraphQLFetch with auth
    try {
      const viewerData = await wpGraphQLFetch<{ viewer: { id: string; username: string; email: string } | null }>({
        query: VIEWER_QUERY,
        auth: true,
      });

      result.step2_wpGraphQLFetch = {
        success: true,
        viewer: viewerData.viewer,
      };
    } catch (error) {
      result.step2_wpGraphQLFetch = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Test flow error:", error);
    return NextResponse.json(
      {
        error: "Failed to test auth flow",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
