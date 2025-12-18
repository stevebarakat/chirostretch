import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Dashboard routes that require authentication
const DASHBOARD_ROUTES = [
  "/dashboard",
  "/profile",
  "/addresses",
  "/payment-methods",
  "/orders",
  "/downloads",
  "/franchisee",
  "/staff",
  "/application",
  "/logout",
];

// Staff roles that should use the staff dashboard
const STAFF_ROLES = ["location_manager"];

function isDashboardRoute(pathname: string): boolean {
  return DASHBOARD_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authToken = request.cookies.get("wp-auth-token")?.value;
  const userRole = request.cookies.get("wp-user-role")?.value;

  // Protect dashboard routes
  if (isDashboardRoute(pathname)) {
    // Redirect to login if no auth token found
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based routing
    if (userRole === "franchise_applicant") {
      // Franchise applicants can only access /application and /logout
      if (!pathname.startsWith("/application") && pathname !== "/logout") {
        return NextResponse.redirect(new URL("/application", request.url));
      }
    } else if (userRole === "franchisee") {
      // Franchisees can access shared routes + /franchisee/*
      // They cannot access /staff or /application
      if (pathname.startsWith("/staff") || pathname.startsWith("/application")) {
        return NextResponse.redirect(new URL("/franchisee", request.url));
      }
    } else if (userRole && STAFF_ROLES.includes(userRole)) {
      // Staff members can access shared routes + /staff/*
      // They cannot access /franchisee or /application
      if (
        pathname.startsWith("/franchisee") ||
        pathname.startsWith("/application")
      ) {
        return NextResponse.redirect(new URL("/staff", request.url));
      }
    }
    // Other roles (customer, subscriber, etc.) can access shared routes
    // but not role-specific routes
    else if (
      pathname.startsWith("/franchisee") ||
      pathname.startsWith("/staff") ||
      pathname.startsWith("/application")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
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
