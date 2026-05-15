import { NextResponse } from "next/server";

export function proxy(req) {
  const token = req.cookies.get("token");

  const protectedRoutes = [
    "/builder",
  ];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(
      new URL("/auth/login", req.url)
    );
  }

  return NextResponse.next();
}