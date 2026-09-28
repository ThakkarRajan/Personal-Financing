import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth) {
    const url = new URL("/signin", req.nextUrl.origin);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/data-entry/:path*",
    "/bills/:path*",
    "/api/dashboard/:path*",
    "/api/month/:path*",
    "/api/categories/:path*",
    "/api/transactions/:path*",
    "/api/bills/:path*",
  ],
};
