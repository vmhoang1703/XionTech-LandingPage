import type { Metadata } from "next";
import { isLocale } from "./locales";

interface PageMeta {
  title: string;
  description?: string;
}

const PLACEHOLDER = "[Placeholder] ";

// Page copy is not translated yet, so a vi title and description are the English text
// marked as placeholder (spec decision 4); en is unchanged.
export function forLocale(locale: string, meta: PageMeta): Metadata {
  if (!isLocale(locale) || locale === "en") return { ...meta };
  const mark = (text: string) =>
    text.startsWith(PLACEHOLDER) ? text : `${PLACEHOLDER}${text}`;
  return {
    title: mark(meta.title),
    ...(meta.description === undefined
      ? {}
      : { description: mark(meta.description) }),
  };
}

/** A page's generateMetadata from its English title and description. */
export function localeMetadata(meta: PageMeta) {
  return async ({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> => forLocale((await params).locale, meta);
}
