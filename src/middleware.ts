import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const STAFF_PATHS = ["/staff"];
const CLIENT_PATHS = ["/dashboard", "/account"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;

    // Staff-only area
    if (STAFF_PATHS.some((p) => pathname.startsWith(p))) {
      if (role !== "STAFF" && role !== "ATTORNEY") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;
        const requiresAuth = [...STAFF_PATHS, ...CLIENT_PATHS].some((p) =>
          pathname.startsWith(p)
        );
        if (requiresAuth) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)" ],
};
