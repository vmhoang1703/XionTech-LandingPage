import { cache } from "react";
import { DEFAULT_LOCALE, type Locale } from "./locales";

// A Not found page gets no route params, so the [locale] layout leaves the locale here for it.
// `cache` makes the box live for one server render only; it is never shared between requests.
const requestLocale = cache((): { locale: Locale } => ({
  locale: DEFAULT_LOCALE,
}));

export function setRequestLocale(locale: Locale): void {
  requestLocale().locale = locale;
}

export function getRequestLocale(): Locale {
  return requestLocale().locale;
}
