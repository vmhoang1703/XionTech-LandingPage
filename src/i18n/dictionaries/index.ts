import "server-only";
import type { Locale } from "../locales";
import type { Dictionaries } from "../translations";
import { fr } from "./fr";
import { ja } from "./ja";
import { ko } from "./ko";
import { zh } from "./zh";

/**
 * The registered translations by locale. English is the source and Vietnamese
 * keeps its twin exports next to the English, so neither is listed here.
 */
export const DICTIONARIES: Partial<Record<Locale, Partial<Dictionaries>>> = {
  ja,
  fr,
  ko,
  zh,
};
