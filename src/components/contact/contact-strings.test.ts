import { describe, expect, it } from "vitest";
import { contentMismatches } from "@/i18n/content";
import {
  CONTACT_STRINGS,
  CONTACT_STRINGS_VI,
  localizeError,
  localizeErrors,
} from "./contact-strings";

describe("CONTACT_STRINGS_VI", () => {
  it("has exactly the keys of the English strings", () => {
    expect(contentMismatches(CONTACT_STRINGS, CONTACT_STRINGS_VI)).toEqual([]);
  });
});

describe("localizeError", () => {
  it("keeps English as is", () => {
    expect(localizeError("Anything.", "en")).toBe("Anything.");
    const errors = { name: "Please enter your name." };
    expect(localizeErrors(errors, "en")).toBe(errors);
  });

  it("maps a known message and falls back to the generic error", () => {
    expect(
      localizeErrors(
        { name: "Please enter your name.", email: "Unknown.", org: "" },
        "vi",
      ),
    ).toEqual({
      name: "Vui lòng nhập họ tên.",
      email: CONTACT_STRINGS_VI.form.sendError,
    });
  });
});
