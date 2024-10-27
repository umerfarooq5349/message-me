import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// export { default } from 'next-auth/middleware';

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/sign-up", "/", "/verify/:path*"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const url = request.nextUrl;

  // console.log(token);
  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
