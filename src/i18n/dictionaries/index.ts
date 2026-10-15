import "server-only";
import type { Locale } from "../locales";
import type { Dictionaries } from "../translations";

/**
 * The registered translations by locale. English is the source and Vietnamese
 * keeps its twin exports next to the English, so neither is listed here.
 */
export const DICTIONARIES: Partial<Record<Locale, Partial<Dictionaries>>> = {};
