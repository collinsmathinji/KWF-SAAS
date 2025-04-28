import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected and public routes
const protectedPaths = [
  "/dashboard",
  "/profile",
  "/settings",
];

const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/about",
  "/api/proxy/auth/register",
  "/api/proxy/auth/login",
];

// Helper to normalize paths (remove trailing slash except root)
function normalizePath(path: string) {
  return path !== "/" ? path.replace(/\/$/, "") : path;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalizedPathname = normalizePath(pathname);
  
  // Debug - check if middleware is running
  console.log(`Middleware running for path: ${pathname}`);
  
  // Check authentication
  const token = request.cookies.get("auth-token")?.value;
  console.log(`Auth token exists: ${!!token}`);
  
  // Check for protected path
  const isProtectedPath = protectedPaths.some(path => {
    const normalizedProtectedPath = normalizePath(path);
    return normalizedPathname === normalizedProtectedPath || 
           normalizedPathname.startsWith(`${normalizedProtectedPath}/`);
  });
  console.log(`Is protected path: ${isProtectedPath}`);
  
  // Protected route check - unauthenticated access
  if (isProtectedPath && !token) {
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // Redirect authenticated users from login/signup
  if (token && (normalizedPathname === "/login" || normalizedPathname === "/signup")) {
    console.log("Redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

// Simplified matcher configuration
export const config = {
  matcher: [
    // Include specific paths we want to protect
    "/dashboard/:path*",
    "/profile/:path*", 
    "/settings/:path*",
    // Auth pages for redirect when authenticated
    "/login",
    "/signup"
  ],
};