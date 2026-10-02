import { describe, expect, it } from "vitest";
import {
  CONTACT_ERRORS,
  validateContact,
  type ContactValues,
} from "./contact-rules";

const TODAY = "2026-10-02";

const valid: ContactValues = {
  name: "Ana Tran",
  email: "ana@gmail.com",
  org: "Sunrise School",
  date: "",
  message: "",
};

describe("validateContact", () => {
  it("returns no errors for valid values (free mail allowed)", () => {
    expect(validateContact("demo", valid, TODAY)).toEqual({});
    expect(validateContact("project", valid, TODAY)).toEqual({});
  });

  it("requires name, email and organisation on both tabs", () => {
    const empty: ContactValues = { ...valid, name: " ", email: "", org: "" };
    const expected = {
      name: CONTACT_ERRORS.name,
      email: CONTACT_ERRORS.email,
      org: CONTACT_ERRORS.org,
    };
    expect(validateContact("demo", empty, TODAY)).toEqual(expected);
    expect(validateContact("project", empty, TODAY)).toEqual(expected);
  });

  it("rejects a malformed email and trims a valid one", () => {
    expect(
      validateContact("demo", { ...valid, email: "ana@school" }, TODAY),
    ).toEqual({ email: "Please enter a valid email address." });
    expect(
      validateContact("demo", { ...valid, email: "  ana@school.edu " }, TODAY),
    ).toEqual({});
  });

  it("rejects a date before today on the demo tab only", () => {
    const past = { ...valid, date: "2026-10-01" };
    expect(validateContact("demo", past, TODAY)).toEqual({
      date: "Please choose today or a later date.",
    });
    expect(validateContact("demo", { ...valid, date: TODAY }, TODAY)).toEqual(
      {},
    );
    expect(
      validateContact("demo", { ...valid, date: "2026-12-31" }, TODAY),
    ).toEqual({});
  });

  it("ignores the date when the project tab is active", () => {
    expect(
      validateContact("project", { ...valid, date: "2020-01-01" }, TODAY),
    ).toEqual({});
  });

  it("limits the message to 2,000 characters on both tabs", () => {
    const ok = { ...valid, message: "a".repeat(2000) };
    const long = { ...valid, message: "a".repeat(2001) };
    expect(validateContact("demo", ok, TODAY)).toEqual({});
    expect(validateContact("demo", long, TODAY)).toEqual({
      message: "Please keep your message under 2,000 characters.",
    });
    expect(validateContact("project", long, TODAY)).toEqual({
      message: CONTACT_ERRORS.message,
    });
  });
});
