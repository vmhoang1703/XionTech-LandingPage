"use client";

import Link from "next/link";
import {
  createContext,
  type ComponentProps,
  type ReactNode,
  useContext,
} from "react";
import { DEFAULT_LOCALE, localeHref, type Locale } from "@/i18n/locales";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** Tells client code below it which locale the page is in (the `[locale]` layout sets it). */
export function LocaleProvider({
  locale,
  children,
}: Readonly<{ locale: Locale; children: ReactNode }>) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** A `next/link` for an internal path ("/products#x") that adds the page's locale. */
export function LocaleLink({
  href,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  return <Link href={localeHref(useLocale(), href)} {...props} />;
}
