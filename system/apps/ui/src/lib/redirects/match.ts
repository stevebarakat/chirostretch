import type { RedirectRule, MatchResult } from "./types";

/**
 * Normalize a path for consistent matching:
 * - Lowercase
 * - Strip trailing slash (except for root "/")
 * - Decode URI components
 */
export function normalizePath(path: string): string {
  try {
    // Decode URI components first
    let normalized = decodeURIComponent(path);

    // Lowercase for case-insensitive matching
    normalized = normalized.toLowerCase();

    // Strip trailing slash (except for root)
    if (normalized !== "/" && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  } catch {
    // If decoding fails (invalid URI), use the raw path
    return path.toLowerCase().replace(/\/$/, "") || "/";
  }
}

/**
 * Check if a from pattern is a wildcard pattern (ends with /*)
 */
function isWildcardPattern(fromPath: string): boolean {
  return fromPath.endsWith("/*");
}

/**
 * Get the prefix from a wildcard pattern (everything before /*)
 */
function getWildcardPrefix(fromPath: string): string {
  return fromPath.slice(0, -2); // Remove "/*"
}

/**
 * Match a single redirect rule against a path
 * Returns the captured wildcard portion if applicable
 */
function matchRule(
  normalizedPath: string,
  rule: RedirectRule
): { matches: boolean; captured?: string } {
  const normalizedFrom = normalizePath(rule.fromPath);

  if (isWildcardPattern(normalizedFrom)) {
    const prefix = getWildcardPrefix(normalizedFrom);

    // Path must start with prefix and have something after it
    // OR path exactly matches the prefix (e.g., /blog matches /blog/*)
    if (normalizedPath === prefix) {
      return { matches: true, captured: "" };
    }

    if (
      normalizedPath.startsWith(prefix + "/") &&
      normalizedPath.length > prefix.length + 1
    ) {
      const captured = normalizedPath.slice(prefix.length + 1);
      return { matches: true, captured };
    }

    return { matches: false };
  }

  // Exact match
  return { matches: normalizedPath === normalizedFrom };
}

/**
 * Build the destination URL, replacing $1 with captured wildcard content
 */
function buildDestination(
  toPath: string,
  captured: string | undefined,
  queryString: string
): string {
  let destination = toPath;

  // Replace $1 with captured wildcard content
  if (captured !== undefined) {
    destination = destination.replace(/\$1/g, captured);
  }

  // Append query string if present
  if (queryString) {
    // Check if destination already has query params
    if (destination.includes("?")) {
      destination += "&" + queryString;
    } else {
      destination += "?" + queryString;
    }
  }

  return destination;
}

/**
 * Find a matching redirect rule for a given path
 *
 * @param path - The incoming request path (may include query string)
 * @param rules - Array of redirect rules (processed in order, first match wins)
 * @returns MatchResult with destination and status code, or matched: false
 */
export function findMatchingRedirect(
  path: string,
  rules: RedirectRule[]
): MatchResult {
  // Separate path and query string
  const [pathPart, queryString = ""] = path.split("?");
  const normalizedPath = normalizePath(pathPart);

  for (const rule of rules) {
    const { matches, captured } = matchRule(normalizedPath, rule);

    if (matches) {
      const destination = buildDestination(rule.toPath, captured, queryString);
      return {
        matched: true,
        destination,
        statusCode: rule.statusCode,
      };
    }
  }

  return { matched: false };
}
