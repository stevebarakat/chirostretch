import { wpGraphQLFetch } from "@/lib/wpgraphql";
import {
  VIEWER_STAFF_PROFILE_QUERY,
  type StaffProfile,
  type ViewerStaffProfileResponse,
} from "@/lib/graphql/queries/staff";

/**
 * Get the current viewer's staff profile
 * Requires authentication (JWT/cookie-based)
 *
 * @returns Staff profile or null if not authenticated or no staff profile linked
 */
export async function getViewerStaffProfile(): Promise<StaffProfile | null> {
  try {
    const data = await wpGraphQLFetch<ViewerStaffProfileResponse>({
      query: VIEWER_STAFF_PROFILE_QUERY,
      auth: true,
    });

    return data.viewer?.staffProfile ?? null;
  } catch (error) {
    console.error("Failed to fetch viewer staff profile:", error);
    return null;
  }
}
