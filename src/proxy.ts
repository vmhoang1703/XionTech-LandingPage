import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/i18n/locales";
import type { Locale } from "@/i18n/locales";

function fromAcceptLanguage(header: string | null): Locale | undefined {
  const ranked = (header ?? "")
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const weight = q ? Number(q.trim().slice(2)) : 1;
      return {
        language: tag.trim().toLowerCase().split("-")[0],
        weight: Number.isNaN(weight) ? 0 : weight,
      };
    })
    .filter((entry) => entry.weight > 0 && isLocale(entry.language))
    .sort((a, b) => b.weight - a.weight);
  const best = ranked[0]?.language;
  return isLocale(best) ? best : undefined;
}

function resolveLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;
  return (
    fromAcceptLanguage(request.headers.get("accept-language")) ?? DEFAULT_LOCALE
  );
}

// Japanese, French, Korean and Chinese were offered from 2026-10-14 to
// 2026-10-15 (lead): their old links move permanently to English.
const REMOVED_LOCALES = new Set(["ja", "fr", "ko", "zh"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = /^\/([a-z]{2})(\/|$)/.exec(pathname)?.[1];
  if (isLocale(first)) return NextResponse.next();
  if (first && REMOVED_LOCALES.has(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname.slice(3)}`;
    return NextResponse.redirect(url, 308);
  }
  // An unsupported locale ("/de/products") matches the [locale] routes, so
  // global-not-found never answers it and Next shows its bare 404. Rewriting to
  // /en/de/products lets the [...rest] catch-all serve the site's 404 (status 404).
  if (first) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.rewrite(url);
  }
  const url = request.nextUrl.clone();
  url.pathname = `/${resolveLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ["/((?!api/|api$|_next/|.*[.].*).*)"],
};
