import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/site";
import { pickLocale } from "./content";
import { isLocale, type Locale } from "./locales";

interface PageMeta {
  title: string;
  description?: string;
}

type PageMetas = { en: PageMeta } & Partial<Record<Locale, PageMeta>>;

/**
 * A page's title and description for one locale: the twin passed in, else the
 * registered translation of the English, else the English. A `[Placeholder]`
 * prefix appears in a translation only where the English source has one.
 */
export function forLocale(locale: string, meta: PageMetas): Metadata {
  return { ...pickLocale(isLocale(locale) ? locale : "en", meta) };
}

/**
 * A page's generateMetadata from its title and description by locale, with
 * its canonical URL, hreflang alternates, Open Graph and Twitter card.
 * `path` is the page's path after the locale ("/" for Home).
 */
export function localeMetadata(meta: PageMetas, path: string) {
  return async ({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> => {
    const { locale: param } = await params;
    const locale = isLocale(param) ? param : "en";
    return seoMetadata(locale, path, pickLocale(locale, meta));
  };
}
