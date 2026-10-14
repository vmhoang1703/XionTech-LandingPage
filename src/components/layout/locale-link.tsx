"use client";

import Link from "next/link";
import {
  createContext,
  type ComponentProps,
  type ReactNode,
  useContext,
} from "react";
import type { ContactErrorText } from "@/components/contact/contact-strings";
import type { ClientKey, ClientStrings } from "@/i18n/client-strings";
import { DEFAULT_LOCALE, localeHref, type Locale } from "@/i18n/locales";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);
const StringsContext = createContext<ClientStrings | undefined>(undefined);

/**
 * Tells client code below it which locale the page is in, and, in a locale
 * other than en and vi, gives it that locale's client strings (the `[locale]`
 * layout resolves them on the server with clientStrings).
 */
export function LocaleProvider({
  locale,
  strings,
  children,
}: Readonly<{ locale: Locale; strings?: ClientStrings; children: ReactNode }>) {
  return (
    <LocaleContext value={locale}>
      <StringsContext value={strings}>{children}</StringsContext>
    </LocaleContext>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/**
 * A client dictionary in the page's locale: the en or vi twin from the client
 * bundle, else the translation the layout sent for `key`, else English.
 */
export function useLocalized<K extends ClientKey, T>(
  key: K,
  dictionary: { en: T; vi: T },
): T {
  const locale = useLocale();
  const strings = useContext(StringsContext);
  if (locale === "en" || locale === "vi") return dictionary[locale];
  return (strings?.dictionary[key] as T | undefined) ?? dictionary.en;
}

/** The page's contact errors for localizeError, in a locale other than en and vi. */
export function useContactErrorText(): ContactErrorText | undefined {
  return useContext(StringsContext)?.errors;
}

/** A `next/link` for an internal path ("/products#x") that adds the page's locale. */
export function LocaleLink({
  href,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  return <Link href={localeHref(useLocale(), href)} {...props} />;
}
