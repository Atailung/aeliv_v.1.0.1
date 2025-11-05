import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  // Get session cookie
  const sessionCookie = getSessionCookie(request);

  // If no session cookie, redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For admin routes, we rely on server-side validation
  // The actual role checking will be done in the page/layout components
  // and the requireAdmin() function in server actions

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Add other protected routes here if needed
    // "/dashboard/:path*",
    // "/profile/:path*",
  ],
};
