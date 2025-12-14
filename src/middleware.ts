import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// WordPress admin URL
const WP_ADMIN_URL =
  process.env.WORDPRESS_URL || "http://chirostretch-copy.local";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authToken = request.cookies.get("wp-auth-token")?.value;
  const userRole = request.cookies.get("wp-user-role")?.value;

  // Protect /my-account routes
  if (pathname.startsWith("/my-account")) {
    // Redirect to login if no auth token found
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based routing for /my-account
    if (userRole === "franchise_applicant") {
      // Franchise applicants can only access /my-account/application and /my-account/logout
      if (!pathname.startsWith("/my-account/application") && pathname !== "/my-account/logout") {
        return NextResponse.redirect(
          new URL("/my-account/application", request.url)
        );
      }
    } else if (userRole === "franchisee") {
      // Franchisees should use wp-admin profile page
      return NextResponse.redirect(`${WP_ADMIN_URL}/wp-admin/profile.php`);
    }
    // Other roles (customer, subscriber, etc.) can access /my-account normally
  }

  const response = NextResponse.next();

  // Set pathname header for server components to access
  response.headers.set("x-pathname", pathname);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
