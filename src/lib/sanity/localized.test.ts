import { describe, expect, it } from "vitest";
import { localized, localizedLang } from "./localized";

describe("localized GROQ fields", () => {
  it("picks the locale's field only when it is non-empty, else English", () => {
    expect(localized("title")).toBe(
      "select(length(title[$locale]) > 0 => title[$locale], title.en)",
    );
  });

  it("marks the field's language the same way, so a blank vi field reads as en", () => {
    expect(localizedLang("body")).toBe(
      'select(length(body[$locale]) > 0 => $locale, "en")',
    );
  });
});
