import type { Locale } from "./locales";
import { registeredTranslation } from "./translations";

/** The shape of an English content value with its strings widened, so a translated dictionary type-checks against it. */
export type Localized<T> = T extends string
  ? string
  : T extends (...args: never[]) => unknown
    ? T
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;

/**
 * A content value in `locale`: the twin passed in (en, vi), else the locale's
 * registered translation of the English value (src/i18n/translations.ts),
 * else the English value itself.
 */
export function pickLocale<T>(
  locale: Locale,
  dictionary: { en: T } & Partial<Record<Locale, T>>,
): T {
  return (
    dictionary[locale] ??
    registeredTranslation(locale, dictionary.en) ??
    dictionary.en
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function childPath(path: string, key: string): string {
  return path ? `${path}.${key}` : key;
}

function arrayMismatches(en: unknown[], vi: unknown, path: string): string[] {
  if (!Array.isArray(vi)) return [`${path || "(root)"}: expected array`];
  const found =
    en.length === vi.length
      ? []
      : [`${path || "(root)"}: length ${en.length} in en, ${vi.length} in vi`];
  for (let i = 0; i < Math.min(en.length, vi.length); i++) {
    found.push(...contentMismatches(en[i], vi[i], `${path}[${i}]`));
  }
  return found;
}

function objectMismatches(
  en: Record<string, unknown>,
  vi: unknown,
  path: string,
): string[] {
  if (!isRecord(vi)) return [`${path || "(root)"}: expected object`];
  const found: string[] = [];
  for (const key of Object.keys(en)) {
    const at = childPath(path, key);
    if (key in vi) found.push(...contentMismatches(en[key], vi[key], at));
    else found.push(`${at}: missing in vi`);
  }
  for (const key of Object.keys(vi)) {
    if (!(key in en)) found.push(`${childPath(path, key)}: not in en`);
  }
  return found;
}

/**
 * Differences between an English content value and its translation: a missing
 * or extra key, an array of another length, a value of another kind. Empty
 * when `vi` has exactly the shape of `en`. Every dictionary gets a test that
 * expects an empty list.
 */
export function contentMismatches(
  en: unknown,
  vi: unknown,
  path = "",
): string[] {
  if (Array.isArray(en)) return arrayMismatches(en, vi, path);
  if (isRecord(en)) return objectMismatches(en, vi, path);
  return typeof en === typeof vi
    ? []
    : [`${path || "(root)"}: expected ${typeof en}`];
}

/** A `lang` value for a block whose text is in `fieldLang`: set only when it differs from the page locale. */
export function fallbackLang(
  fieldLang: string | null | undefined,
  locale: Locale,
): string | undefined {
  return fieldLang && fieldLang !== locale ? fieldLang : undefined;
}
