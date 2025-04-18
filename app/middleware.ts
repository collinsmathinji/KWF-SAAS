import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define which paths are protected (require authentication)
const protectedPaths = [
  "/dashboard",
  "/profile",
  "/settings",
  // Add other protected routes here
]

// Define which paths are public (accessible without authentication)
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/about",
  "/api/proxy/auth/register",
  "/api/proxy/auth/login",
  // Add other public routes here
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/api/") && !pathname.includes("/auth/")) {
    return NextResponse.next()
  }
  const token = request.cookies.get("auth-token")?.value

  const isAuthenticated = !!token
  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  if (isProtectedPath && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Specify which paths the middleware should run on
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/proxy/auth/* (authentication API routes)
     * 2. /_next (Next.js internals)
     * 3. /fonts, /images (static files)
     * 4. /favicon.ico, /robots.txt (static files)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|images/|fonts/).*)",
  ],
}
