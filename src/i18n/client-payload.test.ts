import { describe, expect, it } from "vitest";
import { CLIENT_KEYS } from "./client-strings";
import { DICTIONARIES } from "./dictionaries";
import { english } from "./translations";

// The [locale] layout passes these to a client component, so they must be plain data.
describe("client strings", () => {
  const sources: [string, Record<string, unknown>][] = [
    ["en", english()],
    ...Object.entries(DICTIONARIES).map(
      ([locale, dictionary]): [string, Record<string, unknown>] => [
        locale,
        dictionary ?? {},
      ],
    ),
  ];

  it.each(sources)("%s survives a JSON round trip", (_, dictionary) => {
    for (const key of CLIENT_KEYS) {
      const value = dictionary[key];
      if (value === undefined) continue;
      expect(JSON.parse(JSON.stringify(value)), key).toEqual(value);
      expect(structuredClone(value), key).toEqual(value);
    }
  });
});
