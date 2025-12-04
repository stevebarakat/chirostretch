import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /my-account routes
  if (pathname.startsWith("/my-account")) {
    const authToken = request.cookies.get("wp-auth-token")?.value;

    // Redirect to login if no auth token found
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      // Add redirect parameter to return user to intended page after login
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
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
