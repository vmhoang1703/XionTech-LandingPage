import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";
import { SHELL } from "@/i18n/shell";

// The not-found boundary's title is replaced by the layout's after the page
// loads (i18n retest, 2026-10-15), so this page carries the same title.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: SHELL[isLocale(locale) ? locale : DEFAULT_LOCALE].notFound.metaTitle,
  };
}

// An unknown path under a locale ends here, so it gets that locale's Not found page
// (the global one cannot know the locale).
export default function CatchAll(): never {
  notFound();
}
