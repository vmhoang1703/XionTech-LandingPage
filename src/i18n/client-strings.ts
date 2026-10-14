import "server-only";
import {
  CONTACT_ERROR_MESSAGES,
  CONTACT_STRINGS,
  type ContactErrorText,
} from "@/components/contact/contact-strings";
import { CONTACT_ERRORS } from "@/lib/contact/contact-rules";
import { pickLocale } from "./content";
import { DICTIONARIES } from "./dictionaries";
import type { Locale } from "./locales";
import type { Dictionaries } from "./translations";

/** The dictionaries client components read; en and vi stay twins in their bundles. */
export const CLIENT_KEYS = [
  "appTaglines",
  "careersGrowth",
  "categoryLabels",
  "contactStrings",
  "dayRoad",
  "homeHero",
  "jobForm",
  "journeyBoard",
  "newsPage",
  "productDetails",
  "productsShowcase",
  "roadDialog",
] as const satisfies readonly (keyof Dictionaries)[];

export type ClientKey = (typeof CLIENT_KEYS)[number];

export interface ClientStrings {
  dictionary: Partial<Pick<Dictionaries, ClientKey>>;
  errors: ContactErrorText;
}

/**
 * What a page's client components need in a locale that is not en or vi: its
 * translations of the client dictionaries and its contact errors. Sent from
 * the [locale] layout, so a visitor downloads only the page's language.
 */
export function clientStrings(locale: Locale): ClientStrings | undefined {
  if (locale === "en" || locale === "vi") return undefined;
  const all = DICTIONARIES[locale] ?? {};
  const dictionary: Partial<Pick<Dictionaries, ClientKey>> = {};
  for (const key of CLIENT_KEYS) {
    if (all[key] !== undefined) Object.assign(dictionary, { [key]: all[key] });
  }
  return { dictionary, errors: contactErrorText(locale) };
}

/** Each English contact error with its translation in `locale`, and the generic send error. */
function contactErrorText(locale: Locale): ContactErrorText {
  const strings = pickLocale(locale, { en: CONTACT_STRINGS });
  const others = pickLocale(locale, { en: CONTACT_ERROR_MESSAGES });
  return {
    pairs: [
      ...Object.entries(CONTACT_ERRORS).map(
        ([field, english]): [string, string] => [
          english,
          strings.errors[field as keyof typeof CONTACT_ERRORS],
        ],
      ),
      ...Object.entries(CONTACT_ERROR_MESSAGES).map(
        ([key, english]): [string, string] => [
          english,
          others[key as keyof typeof CONTACT_ERROR_MESSAGES],
        ],
      ),
    ],
    fallback: strings.form.sendError,
  };
}
