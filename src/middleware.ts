import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check auth status
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/settings",
    "/polls/create",
    "/opinions/create",
    "/groups/create",
  ];

  // Admin-only routes
  const adminRoutes = [
    "/admin",
    "/polls-management",
    "/users-management",
    "/moderation",
    "/analytics",
    "/system-settings",
  ];

  const path = req.nextUrl.pathname;

  // Check if accessing a protected route without being logged in
  if (protectedRoutes.some((route) => path.startsWith(route)) && !session) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check if accessing admin routes without admin privileges
  if (adminRoutes.some((route) => path.startsWith(route))) {
    if (!session) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("from", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check for admin role
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!user || user.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if ((path === "/login" || path === "/register") && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public|assets).*)"],
};
