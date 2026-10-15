import { describe, expect, it } from "vitest";
import { contentMismatches } from "@/i18n/content";
import {
  CONTACT_STRINGS,
  CONTACT_STRINGS_VI,
  localizeError,
  localizeErrors,
} from "./contact-strings";
import { JOB_ERRORS } from "@/lib/careers/application-rules";
import {
  CONTACT_ERRORS,
  LENGTH_ERROR,
  MESSAGE_REQUIRED_ERROR,
} from "@/lib/contact/contact-rules";

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

describe("every English rule error", () => {
  it.each([
    ...Object.values(CONTACT_ERRORS),
    ...Object.values(JOB_ERRORS),
    MESSAGE_REQUIRED_ERROR,
    LENGTH_ERROR,
  ])("%s has its own Vietnamese text", (message) => {
    const vi = localizeError(message, "vi");
    expect(vi).not.toBe(CONTACT_STRINGS_VI.form.sendError);
    expect(vi).not.toBe(message);
  });

  it("writes the limits the Vietnamese way", () => {
    expect(localizeError(LENGTH_ERROR, "vi")).toBe(
      "Vui lòng nhập dưới 200 ký tự.",
    );
    expect(localizeError(JOB_ERRORS.note, "vi")).toBe(
      "Vui lòng giữ lời nhắn dưới 2.000 ký tự.",
    );
  });
});
