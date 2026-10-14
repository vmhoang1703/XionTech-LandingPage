import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/i18n/locales";
import type { Locale } from "@/i18n/locales";

// Chinese is offered in Simplified only: zh, zh-CN, zh-SG and zh-Hans(-*) map
// to it (zh-Hans-TW too); zh-TW, zh-HK, zh-MO and zh-Hant(-*) become
// "zh-hant", which is no locale, so they fall through.
function languageOf(tag: string): string {
  const [language, ...subtags] = tag.toLowerCase().split("-");
  if (language !== "zh") return language;
  if (subtags.includes("hans")) return "zh";
  const traditional = subtags.some((s) =>
    ["hant", "tw", "hk", "mo"].includes(s),
  );
  return traditional ? "zh-hant" : "zh";
}

function fromAcceptLanguage(header: string | null): Locale | undefined {
  const entries = (header ?? "").split(",").map((part) => {
    const [tag = "", ...params] = part.trim().split(";");
    const q = params.find((p) => p.trim().startsWith("q="));
    const weight = q ? Number(q.trim().slice(2)) : 1;
    return {
      bare: tag.trim().toLowerCase() === "zh",
      language: languageOf(tag.trim()),
      weight: Number.isNaN(weight) ? 0 : weight,
    };
  });
  // A Traditional browser lists bare "zh" as its fallback ("zh-TW,zh;q=0.9"):
  // that zh means Traditional too, so it does not pick Simplified. A refused
  // Traditional tag (q=0) does not count.
  const traditional = entries.some(
    (entry) => entry.language === "zh-hant" && entry.weight > 0,
  );
  const ranked = entries
    .filter(
      (entry) =>
        entry.weight > 0 &&
        isLocale(entry.language) &&
        !(traditional && entry.bare),
    )
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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = /^\/([a-z]{2})(\/|$)/.exec(pathname)?.[1];
  if (isLocale(first)) return NextResponse.next();
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
