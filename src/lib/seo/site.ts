import type { Metadata } from "next";
import { htmlLang, LOCALES, type Locale } from "@/i18n/locales";

/** Where the site is hosted until the final domain is chosen (2026-10-16). */
export const DEFAULT_SITE_URL = "https://xiontech-hoangvu-dev.vercel.app";

/**
 * The site origin, from NEXT_PUBLIC_SITE_URL (no trailing slash), else the
 * challenge host. Canonical, hreflang, Open Graph, JSON-LD, robots and
 * sitemap URLs use it.
 */
export function siteUrl(value = process.env.NEXT_PUBLIC_SITE_URL): string {
  let url = value?.trim() || DEFAULT_SITE_URL;
  while (url.endsWith("/")) url = url.slice(0, -1);
  return url;
}

export const SITE_URL = siteUrl();

/** "/en/services" from a locale and a path that starts with "/" ("/" is the locale home). */
export function localePath(locale: Locale, path: string): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** hreflang alternates for every locale the site serves, x-default on English. */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[htmlLang(locale)] = localePath(locale, path);
  }
  languages["x-default"] = localePath("en", path);
  return languages;
}

const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  vi: "vi_VN",
};

/** The site's share image (src/app/opengraph-image.tsx). */
export const DEFAULT_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "XionTech: Build smarter. Ship faster. Get IT done.",
};

export interface SeoOptions {
  /** The canonical locale when it differs from the page's (content only in English). */
  canonicalLocale?: Locale;
  /** Leave hreflang alternates out (a page whose other-locale versions are not translations). */
  noAlternates?: boolean;
  /** Share image URL (a news cover); the default is DEFAULT_IMAGE. */
  image?: string | null;
  type?: "website" | "article";
}

/**
 * A page's metadata: title and description, the canonical URL, hreflang
 * alternates, Open Graph and a large Twitter card with the same text.
 */
export function seoMetadata(
  locale: Locale,
  path: string,
  meta: { title: string; description?: string },
  options: SeoOptions = {},
): Metadata {
  const url = localePath(locale, path);
  const canonical = localePath(options.canonicalLocale ?? locale, path);
  const images = options.image ? [options.image] : [DEFAULT_IMAGE];
  return {
    ...meta,
    alternates: {
      canonical,
      ...(options.noAlternates ? {} : { languages: languageAlternates(path) }),
    },
    openGraph: {
      ...meta,
      url,
      siteName: "XionTech",
      locale: OG_LOCALES[locale],
      type: options.type ?? "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      ...meta,
      images,
    },
  };
}

/** About 155 characters of a summary for a meta description, cut at a word. */
export function summaryDescription(text: string, max = 155): string {
  const flat = text.replaceAll(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  const kept = space > max / 2 ? cut.slice(0, space) : cut;
  let end = kept.length;
  while (end > 0 && " ,.;:".includes(kept[end - 1])) end--;
  return `${kept.slice(0, end)}…`;
}
