// GROQ for a field stored per locale ({ en, vi }). The locale's value counts
// only when non-empty, so a blank "" or [] vi field falls back to English.
const present = (field: string) => `length(${field}[$locale]) > 0`;

export function localized(field: string): string {
  return `select(${present(field)} => ${field}[$locale], ${field}.en)`;
}

/** The language `localized(field)` returned: the locale, or "en" on fallback. */
export function localizedLang(field: string): string {
  return `select(${present(field)} => $locale, "en")`;
}
