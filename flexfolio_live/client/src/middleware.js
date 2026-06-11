import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";

  // Local testing
  const isLocalhost = host.includes(".localhost");

  // Production
  const isProductionSubdomain =
    host.endsWith(".flexfolio.online") &&
    host !== "flexfolio.online" &&
    host !== "www.flexfolio.online";

  if (!isLocalhost && !isProductionSubdomain) {
    return NextResponse.next();
  }

  const subdomain = host.split(".")[0];

  return NextResponse.rewrite(
    new URL(`/portfolio/${subdomain}`, req.url)
  );
}

export const config = {
  matcher: [
    /*
      Don't rewrite:
      /api/*
      /_next/*
      static files
      favicon
    */
    "/((?!api|_next|favicon.ico|images|assets).*)",
  ],
};