import type { Metadata } from "next";
import { isLocale, type Locale } from "./locales";

interface PageMeta {
  title: string;
  description?: string;
}

/**
 * A page's title and description for one locale. Each page passes both; a
 * `[Placeholder]` prefix appears in vi only where the English source has one.
 */
export function forLocale(
  locale: string,
  meta: Record<Locale, PageMeta>,
): Metadata {
  return { ...meta[isLocale(locale) ? locale : "en"] };
}

/** A page's generateMetadata from its English and Vietnamese title and description. */
export function localeMetadata(meta: Record<Locale, PageMeta>) {
  return async ({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> => forLocale((await params).locale, meta);
}
