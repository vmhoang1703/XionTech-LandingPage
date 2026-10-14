export const LOCALES = ["en", "vi", "ja", "fr", "ko", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

/** Each language's name in that language: the same in every locale. */
export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
  ja: "日本語",
  fr: "Français",
  ko: "한국어",
  zh: "简体中文",
};

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

export const LOCALE_COOKIE = "locale";

/** The `<html lang>` value: Chinese is Simplified, so "zh" pages say "zh-Hans". */
export function htmlLang(locale: Locale): string {
  return locale === "zh" ? "zh-Hans" : locale;
}
