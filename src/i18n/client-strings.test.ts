import { describe, expect, it, vi } from "vitest";
import {
  CONTACT_ERROR_MESSAGES,
  CONTACT_STRINGS,
} from "@/components/contact/contact-strings";
import { CONTACT_ERRORS } from "@/lib/contact/contact-rules";
import { clientStrings } from "./client-strings";

vi.mock("./dictionaries", () => ({
  DICTIONARIES: {
    ja: {
      homeHero: { title: "ja hero" },
      aboutFaq: { title: "server only" },
    },
  },
}));

describe("clientStrings", () => {
  it("sends nothing for en and vi, whose twins are in the client bundle", () => {
    expect(clientStrings("en")).toBeUndefined();
    expect(clientStrings("vi")).toBeUndefined();
  });

  it("sends only the client dictionaries a locale has", () => {
    expect(clientStrings("ja")?.dictionary).toEqual({
      homeHero: { title: "ja hero" },
    });
    expect(clientStrings("ko")?.dictionary).toEqual({});
  });

  it("pairs every English contact error with its translation", () => {
    const errors = clientStrings("fr")?.errors;
    expect(errors?.pairs).toContainEqual([
      CONTACT_ERRORS.email,
      CONTACT_ERRORS.email,
    ]);
    expect(errors?.pairs).toContainEqual([
      CONTACT_ERROR_MESSAGES.cv,
      CONTACT_ERROR_MESSAGES.cv,
    ]);
    expect(errors?.fallback).toBe(CONTACT_STRINGS.form.sendError);
  });
});
