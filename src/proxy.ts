import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth-jwt";

const PROTECTED_ROUTES = ["/", "/planner", "/weather", "/activities", "/forecast", "/settings"];
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const user = token ? await verifyJWT(token) : null;

  // Logged-in user visiting auth pages → redirect to dashboard
  if (user && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Guest visiting protected routes → redirect to login
  if (!user && PROTECTED_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
