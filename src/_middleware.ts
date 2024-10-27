import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
import { auth } from "./auth";
// export { default } from 'next-auth/middleware';

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/", "/verify/:path*"],
};

export async function middleware(request: NextRequest) {
  const session = await auth();
  const url = request.nextUrl;
  console.log("session:\n\n\n\n\n");
  console.log(session?.user);
  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    session?.user &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!session?.user && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  return NextResponse.next();
}
