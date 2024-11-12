import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
import { auth } from "./auth";
// export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const session = await auth();
  // const token = await getToken({
  //   req: request,
  //   secret: process.env.AUTH_SECRET,
  // });
  const url = request.nextUrl;

  console.log(
    `i'm in middlwarre befor you actualy visit your required endpoint`
  );
  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    session &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!session && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup", "/", "/verify/:path*"],
};
