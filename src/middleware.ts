import { NextResponse, type NextRequest } from "next/server";

const supportedLangs = ["fr", "nl", "en"] as const;
type Lang = (typeof supportedLangs)[number];

const COOKIE = "moconsult_lang";

function isSupported(lang: string): lang is Lang {
  return (supportedLangs as readonly string[]).includes(lang);
}

function stripTrailingSlash(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = stripTrailingSlash(url.pathname);

  // Skip Next internals / assets.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const first = segments[1] || "";

  // Persist language preference in a cookie whenever we're on a locale route.
  if (isSupported(first)) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE, first, { path: "/" });
    return res;
  }

  // Root: redirect to preferred language (cookie) or /fr.
  if (pathname === "/") {
    const preferred = req.cookies.get(COOKIE)?.value;
    const lang = preferred && isSupported(preferred) ? preferred : "fr";
    return NextResponse.redirect(new URL(`/${lang}`, req.url));
  }

  // If user types an unsupported locale-like prefix, redirect to /fr preserving the rest:
  // /es/services -> /fr/services
  if (first.length === 2) {
    const rest = segments.slice(2).join("/");
    const target = rest ? `/fr/${rest}` : "/fr";
    return NextResponse.redirect(new URL(target, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

