import "server-only";
import {
  aboutCta,
  aboutFaq,
  aboutHero,
  aboutMeta,
  aboutOffices,
  aboutStory,
  aboutValuesHeading,
} from "@/content/about";
import { APP_TAGLINES } from "@/content/apps";
import {
  careersGain,
  careersGeneralApplication,
  careersHero,
  careersLife,
  careersMeta,
  careersRoles,
} from "@/content/careers";
import {
  homeApps,
  homeCapabilities,
  homeDoors,
  homeFaq,
  homeHero,
  homeMeta,
  homeOutcomes,
  homeProcess,
  homeStats,
} from "@/content/home";
import {
  jobDetails,
  jobForm,
  jobHero,
  jobMeta,
  ROLE_TYPES,
} from "@/content/job";
import {
  categoryLabels,
  homeNews,
  newsMeta,
  newsPage,
  newsStory,
} from "@/content/news";
import {
  footerOffices,
  hcmc,
  offices,
  otherLocations,
  plano,
} from "@/content/offices";
import { PRIVACY } from "@/content/privacy";
import { processFlow } from "@/content/process";
import {
  journeyBoard,
  journeyMap,
  productDetails,
  productRoad,
  productsMeta,
  productsShowcase,
  roadDialog,
} from "@/content/products";
import {
  servicesMeta,
  servicesOutcomes,
  servicesPage,
  servicesProcess,
  servicesSection,
} from "@/content/services";
import { aboutValues, homeValuesHeading } from "@/content/values";
import {
  CONTACT_ERROR_MESSAGES,
  CONTACT_STRINGS,
} from "@/components/contact/contact-strings";
import type { Localized } from "./content";
import { DICTIONARIES } from "./dictionaries";
import type { Locale } from "./locales";
import type { ShellDictionary } from "./shell";
import type { SiteMeta } from "./site-meta";

/**
 * Every English content value a page picks by locale, by name. A locale's
 * dictionary (src/i18n/dictionaries/<locale>.ts) gives the same names in its
 * language. Read on first use, since content modules import pickLocale's file.
 */
export function english() {
  return {
    aboutCta,
    aboutFaq,
    aboutHero,
    aboutMeta,
    aboutOffices,
    aboutStory,
    aboutValues,
    aboutValuesHeading,
    appTaglines: APP_TAGLINES,
    careersGain,
    careersGeneralApplication,
    careersHero,
    careersLife,
    careersMeta,
    careersRoles,
    categoryLabels,
    contactErrors: CONTACT_ERROR_MESSAGES,
    contactStrings: CONTACT_STRINGS,
    footerOffices,
    hcmc,
    homeApps,
    homeCapabilities,
    homeDoors,
    homeFaq,
    homeHero,
    homeMeta,
    homeNews,
    homeOutcomes,
    homeProcess,
    homeStats,
    homeValuesHeading,
    jobDetails,
    jobForm,
    jobHero,
    jobMeta,
    journeyBoard,
    journeyMap,
    newsMeta,
    newsPage,
    newsStory,
    offices,
    otherLocations,
    plano,
    privacy: PRIVACY,
    processFlow,
    productDetails,
    productRoad,
    productsMeta,
    productsShowcase,
    roadDialog,
    roleTypes: ROLE_TYPES,
    servicesMeta,
    servicesOutcomes,
    servicesPage,
    servicesProcess,
    servicesSection,
  };
}

type English = ReturnType<typeof english>;

/**
 * One locale's whole translation: every content value plus the site shell and
 * the site-wide meta. A locale file typed `Dictionaries` is complete (the
 * compiler rejects a missing key); `Partial<Dictionaries>` while it is filled.
 */
export type Dictionaries = { [K in keyof English]: Localized<English[K]> } & {
  shell: ShellDictionary;
  meta: SiteMeta;
};

// A fixed-size lookup (one entry per English value), built on first use.
let byEnglish: Map<unknown, keyof English> | undefined;

function keyOf(en: unknown): keyof English | undefined {
  byEnglish ??= new Map(
    Object.entries(english()).map(([key, value]) => [
      value,
      key as keyof English,
    ]),
  );
  return byEnglish.get(en);
}

/** Whether a value is one of the English values the registry names. */
export function isRegistered(en: unknown): boolean {
  return keyOf(en) !== undefined;
}

/** The registered translation of an English content value, if the locale has one. */
export function registeredTranslation<T>(locale: Locale, en: T): T | undefined {
  const dictionary = DICTIONARIES[locale];
  const key = dictionary && keyOf(en);
  // Localized<T> has the shape of T with strings widened; the registry holds
  // the translation of exactly this English value.
  return key ? (dictionary[key] as T | undefined) : undefined;
}
