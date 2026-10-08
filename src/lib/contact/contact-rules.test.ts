import { describe, expect, it } from "vitest";
import {
  CONTACT_ERRORS,
  isValidEmail,
  isValidPhone,
  MESSAGE_REQUIRED_ERROR,
  validateContact,
  type ContactValues,
} from "./contact-rules";

const TODAY = "2026-10-02";

describe("isValidEmail", () => {
  it("accepts a normal address (free mail allowed)", () => {
    expect(isValidEmail("ana@gmail.com")).toBe(true);
  });

  it("rejects an address whose domain has no dot", () => {
    expect(isValidEmail("ana@school")).toBe(false);
  });
});

const valid: ContactValues = {
  name: "Ana Tran",
  email: "ana@gmail.com",
  org: "Sunrise School",
  phone: "",
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
    for (const email of ["a@b.c", "a@.com"]) {
      expect(validateContact("demo", { ...valid, email }, TODAY)).toEqual({
        email: CONTACT_ERRORS.email,
      });
    }
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

  it("counts a CRLF line break as one character", () => {
    // 1,000 + line break + 999 = 2,000 characters; CRLF would count 2,001.
    const message = `${"a".repeat(1000)}\r\n${"b".repeat(999)}`;
    expect(validateContact("demo", { ...valid, message }, TODAY)).toEqual({});
  });
});

describe("validateContact caps and date format", () => {
  it("rejects a 201-character name and organisation, accepts 200", () => {
    expect(
      validateContact("demo", { ...valid, name: "a".repeat(200) }, TODAY),
    ).toEqual({});
    expect(
      validateContact("demo", { ...valid, name: "a".repeat(201) }, TODAY),
    ).toEqual({ name: "Please keep this under 200 characters." });
    expect(
      validateContact("project", { ...valid, org: "a".repeat(201) }, TODAY),
    ).toEqual({ org: "Please keep this under 200 characters." });
  });

  it("rejects a 255-character email, accepts 254", () => {
    const email = (length: number) => `${"a".repeat(length - 11)}@school.edu`;
    expect(
      validateContact("demo", { ...valid, email: email(254) }, TODAY),
    ).toEqual({});
    expect(
      validateContact("demo", { ...valid, email: email(255) }, TODAY),
    ).toEqual({ email: "Please enter a valid email address." });
  });

  it.each(["2026-12-5", "2026-1-5", "2026-13-01", "2026-11-31", "tomorrow"])(
    "rejects the date %s on the demo tab",
    (date) => {
      expect(validateContact("demo", { ...valid, date }, TODAY)).toEqual({
        date: "Please choose today or a later date.",
      });
    },
  );

  it("ignores a badly formatted date on the project tab", () => {
    expect(
      validateContact("project", { ...valid, date: "2026-12-5" }, TODAY),
    ).toEqual({});
  });
});

describe("isValidPhone", () => {
  it.each(["", "(+1) 469 322 9899", "+84 908.107-552", "1234567"])(
    "accepts %j",
    (phone) => {
      expect(isValidPhone(phone)).toBe(true);
    },
  );

  it.each([
    "12",
    "+1234567890123456",
    "12345ab",
    "123456",
    "+",
    "+1 469\n322 9899",
    "+1 469\t322 9899",
  ])("rejects %j", (phone) => {
    expect(isValidPhone(phone)).toBe(false);
  });
});

describe("validateContact general type", () => {
  const general: ContactValues = {
    ...valid,
    org: "",
    message: "Hello there",
  };

  it("needs no organisation and no phone", () => {
    expect(validateContact("general", general, TODAY)).toEqual({});
  });

  it("rejects phone 12", () => {
    expect(
      validateContact("general", { ...general, phone: "12" }, TODAY),
    ).toEqual({ phone: CONTACT_ERRORS.phone });
  });

  it("requires a message", () => {
    expect(
      validateContact("general", { ...general, message: "  " }, TODAY),
    ).toEqual({ message: MESSAGE_REQUIRED_ERROR });
  });

  it("still limits the message length", () => {
    expect(
      validateContact(
        "general",
        { ...general, message: "a".repeat(2001) },
        TODAY,
      ),
    ).toEqual({ message: CONTACT_ERRORS.message });
  });

  it("ignores the date", () => {
    expect(
      validateContact("general", { ...general, date: "2020-01-01" }, TODAY),
    ).toEqual({});
  });

  it("keeps the organisation and an empty message optional for demo and project", () => {
    expect(validateContact("demo", { ...valid, phone: "12" }, TODAY)).toEqual(
      {},
    );
    expect(
      validateContact("project", { ...valid, message: "" }, TODAY),
    ).toEqual({});
    expect(validateContact("demo", { ...valid, org: "" }, TODAY)).toEqual({
      org: CONTACT_ERRORS.org,
    });
  });
});
