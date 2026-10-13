export const LOCALES = ["en", "vi"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

/** Prefix an internal path ("/", "/products#x", "/?a=1") with the locale. */
export function localeHref(locale: Locale, path: string): string {
  if (path === "/") return `/${locale}`;
  if (path.startsWith("/?") || path.startsWith("/#")) {
    return `/${locale}${path.slice(1)}`;
  }
  return `/${locale}${path}`;
}
