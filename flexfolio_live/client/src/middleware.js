import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";

  // Local subdomain
  const isLocalhost = host.includes(".localhost");

  // Flexfolio subdomain
  const isProductionSubdomain =
    host.endsWith(".flexfolio.online") &&
    host !== "flexfolio.online" &&
    host !== "www.flexfolio.online";

  if (isLocalhost || isProductionSubdomain) {
    const subdomain = host.split(".")[0];

    return NextResponse.rewrite(
      new URL(`/portfolio/${subdomain}`, req.url)
    );
  }

  // Domains that belong to platform
  const platformDomains = [
    "flexfolio.online",
    "www.flexfolio.online",
    "localhost:3000",
  ];

  const isCustomDomain =
    !platformDomains.includes(host) &&
    !host.endsWith(".flexfolio.online") &&
    !host.includes("vercel.app");

  if (isCustomDomain) {
    return NextResponse.rewrite(
      new URL(`/domain/${host}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|images|assets).*)",
  ],
};