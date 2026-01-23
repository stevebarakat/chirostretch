import { NextResponse, type NextRequest } from "next/server";
import { findMatchingRedirect } from "@/lib/redirects/match";
import { fetchRedirects } from "@/lib/redirects/fetch";
import { RedirectRulesSchema, type RedirectRule } from "@/lib/redirects/types";

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next (Next.js internals)
     * - api (API routes)
     * - Static files (images, fonts, etc.)
     */
    "/((?!_next|api|favicon.ico|.*\\..*).*)",
  ],
};

// Module-level cache for redirect rules
let cachedRules: RedirectRule[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

/**
 * Load redirect rules from the pre-generated JSON file (production)
 * or directly from WordPress GraphQL (development)
 */
async function loadRedirectRules(): Promise<RedirectRule[]> {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // Development: fetch directly from WordPress with module-level cache
    const now = Date.now();
    if (cachedRules && now - cacheTimestamp < CACHE_TTL_MS) {
      return cachedRules;
    }

    try {
      cachedRules = await fetchRedirects();
      cacheTimestamp = now;
      return cachedRules;
    } catch (error) {
      console.error("[Redirects] Error fetching rules:", error);
      return cachedRules ?? [];
    }
  }

  // Production: use pre-generated JSON file
  try {
    const { default: rules } = await import("../generated-redirects.json");
    const parsed = RedirectRulesSchema.safeParse(rules);

    if (!parsed.success) {
      console.error("[Redirects] Invalid generated rules:", parsed.error);
      return [];
    }

    return parsed.data;
  } catch {
    console.warn("[Redirects] No generated-redirects.json found");
    return [];
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Load redirect rules
  const rules = await loadRedirectRules();

  if (rules.length === 0) {
    return NextResponse.next();
  }

  // Check for matching redirect
  const path = search ? `${pathname}${search}` : pathname;
  const match = findMatchingRedirect(path, rules);

  if (!match.matched) {
    return NextResponse.next();
  }

  // Build redirect URL
  const destination = match.destination.startsWith("http")
    ? match.destination
    : new URL(match.destination, request.url).toString();

  return NextResponse.redirect(destination, match.statusCode);
}
