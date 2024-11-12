// import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
// import { authConfig } from "./auth.config";
// import { getToken } from "next-auth/jwt";
// import { auth } from "next-auth/";
// export { default } from 'next-auth/middleware';

// const { auth } = NextAuth(authConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(req: NextRequest) {
  const cookies = req.cookies.getAll();
  const cookieNames = cookies.map((cookie) => cookie.name); // Extract cookie names

  const isAuthenticated =
    cookieNames.includes("__Secure-authjs.session-token") ||
    cookieNames.includes("authjs.session-token");

  // const session = await auth();
  // const token = await getToken({
  //   req: request,
  //   secret: process.env.AUTH_SECRET,
  // });
  const url = req.nextUrl;

  console.log(
    `i'm in middlwarre befor you actualy visit your required endpoint`
  );
  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    isAuthenticated &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthenticated && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/signin",
    "/signup",
    "/",
    "/verify/:path*",
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
