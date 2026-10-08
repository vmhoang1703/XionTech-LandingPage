import { describe, expect, it } from "vitest";
import { CONTACT_STRINGS } from "@/components/contact/contact-strings";
import {
  CONTACT_ERRORS,
  LENGTH_ERROR,
  MESSAGE_REQUIRED_ERROR,
} from "./contact-rules";
import { parseSubmission } from "./submission";

// Midday UTC on 2026-10-10: the earliest local date on Earth is 2026-10-09.
const NOW = new Date("2026-10-10T12:00:00Z");

const demoBody = {
  type: "demo",
  name: "Ana Tran",
  email: "ana@sunrise.edu",
  org: "Sunrise School",
  role: "Principal",
  message: "Hello",
  products: ["Parent Hub", "Staff Hub"],
  schoolSize: CONTACT_STRINGS.schoolSizes[0],
  date: "2026-10-20",
  website: "",
};

const projectBody = {
  type: "project",
  name: "Ana Tran",
  email: "ana@sunrise.edu",
  org: "Sunrise School",
  role: "",
  message: "",
  service: CONTACT_STRINGS.services[0],
  startTiming: CONTACT_STRINGS.startTimings[0],
  website: "",
};

const generalBody = {
  type: "general",
  name: "Ana Tran",
  email: "ana@sunrise.edu",
  phone: "",
  message: "Hello team",
  website: "",
};

const BAD = { ok: false, bad: true };

/** A copy of the body with the field left out, like a client that never sent it. */
function without(body: Record<string, unknown>, field: string) {
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => key !== field),
  );
}

describe("parseSubmission valid bodies", () => {
  it("accepts a demo request and keeps only the demo fields", () => {
    const body = { ...demoBody, service: "Not sure yet", startTiming: "x" };
    expect(parseSubmission(body, NOW)).toEqual({
      ok: true,
      submission: {
        type: "demo",
        name: "Ana Tran",
        email: "ana@sunrise.edu",
        org: "Sunrise School",
        role: "Principal",
        message: "Hello",
        products: ["Parent Hub", "Staff Hub"],
        schoolSize: CONTACT_STRINGS.schoolSizes[0],
        date: "2026-10-20",
      },
    });
  });

  it("accepts a project request and ignores the demo fields", () => {
    const body = {
      ...projectBody,
      products: ["nope"],
      schoolSize: "nope",
      date: "2020-01-01",
    };
    expect(parseSubmission(body, NOW)).toEqual({
      ok: true,
      submission: {
        type: "project",
        name: "Ana Tran",
        email: "ana@sunrise.edu",
        org: "Sunrise School",
        role: "",
        message: "",
        service: CONTACT_STRINGS.services[0],
        startTiming: CONTACT_STRINGS.startTimings[0],
      },
    });
  });

  it("trims name, email and organisation like the client", () => {
    const body = {
      ...demoBody,
      name: "  Ana Tran ",
      email: " ana@sunrise.edu ",
      org: " Sunrise School  ",
    };
    expect(parseSubmission(body, NOW)).toMatchObject({
      ok: true,
      submission: {
        name: "Ana Tran",
        email: "ana@sunrise.edu",
        org: "Sunrise School",
      },
    });
  });

  it("accepts no products, an empty date and a missing role", () => {
    const body = { ...without(demoBody, "role"), products: [], date: "" };
    expect(parseSubmission(body, NOW)).toMatchObject({
      ok: true,
      submission: { products: [], date: "", role: "" },
    });
  });

  it("accepts every option of every select", () => {
    for (const schoolSize of CONTACT_STRINGS.schoolSizes) {
      expect(parseSubmission({ ...demoBody, schoolSize }, NOW).ok).toBe(true);
    }
    for (const service of CONTACT_STRINGS.services) {
      expect(parseSubmission({ ...projectBody, service }, NOW).ok).toBe(true);
    }
    for (const startTiming of CONTACT_STRINGS.startTimings) {
      expect(parseSubmission({ ...projectBody, startTiming }, NOW).ok).toBe(
        true,
      );
    }
    expect(
      parseSubmission(
        { ...demoBody, products: [...CONTACT_STRINGS.productPills] },
        NOW,
      ).ok,
    ).toBe(true);
  });
});

describe("parseSubmission bypassed client", () => {
  it.each(["demo", "project"] as const)(
    "returns the client wording for a missing name, bad email and no organisation on %s",
    (type) => {
      const base = type === "demo" ? demoBody : projectBody;
      const body = { ...base, name: "", email: "ana@school", org: " " };
      expect(parseSubmission(body, NOW)).toEqual({
        ok: false,
        errors: {
          name: CONTACT_ERRORS.name,
          email: CONTACT_ERRORS.email,
          org: CONTACT_ERRORS.org,
        },
      });
    },
  );

  it("treats a field that is missing or not text as empty", () => {
    expect(parseSubmission(without(demoBody, "name"), NOW)).toEqual({
      ok: false,
      errors: { name: CONTACT_ERRORS.name },
    });
    expect(parseSubmission({ ...demoBody, email: 42 }, NOW)).toEqual({
      ok: false,
      errors: { email: CONTACT_ERRORS.email },
    });
  });

  it("rejects a message over 2,000 characters", () => {
    const body = { ...demoBody, message: "a".repeat(2001) };
    expect(parseSubmission(body, NOW)).toEqual({
      ok: false,
      errors: { message: CONTACT_ERRORS.message },
    });
    const limit = { ...demoBody, message: "a".repeat(2000) };
    expect(parseSubmission(limit, NOW).ok).toBe(true);
  });

  it("rejects over-length name, organisation and email", () => {
    const body = {
      ...demoBody,
      name: "a".repeat(201),
      org: "b".repeat(201),
      email: `${"c".repeat(250)}@d.edu`,
    };
    expect(parseSubmission(body, NOW)).toEqual({
      ok: false,
      errors: {
        name: LENGTH_ERROR,
        org: LENGTH_ERROR,
        email: CONTACT_ERRORS.email,
      },
    });
  });

  it("rejects a past date and a badly formatted date on the demo tab", () => {
    for (const date of ["2026-10-08", "2026-10-9", "2026-02-30", "soon"]) {
      expect(parseSubmission({ ...demoBody, date }, NOW)).toEqual({
        ok: false,
        errors: { date: CONTACT_ERRORS.date },
      });
    }
  });

  it("ignores the date on the project tab", () => {
    const body = { ...projectBody, date: "2020-1-1" };
    expect(parseSubmission(body, NOW).ok).toBe(true);
  });

  it("counts a role of 200 characters as valid and 201 as a bad body", () => {
    expect(
      parseSubmission({ ...demoBody, role: "r".repeat(200) }, NOW).ok,
    ).toBe(true);
    expect(
      parseSubmission({ ...demoBody, role: "r".repeat(201) }, NOW),
    ).toEqual(BAD);
    expect(
      parseSubmission({ ...projectBody, role: "r".repeat(201) }, NOW),
    ).toEqual(BAD);
  });
});

describe("parseSubmission bad bodies", () => {
  it.each([
    ["null", null],
    ["undefined", undefined],
    ["a string", "demo"],
    ["a number", 7],
    ["an array", [demoBody]],
  ])("rejects %s as a body", (_label, body) => {
    expect(parseSubmission(body, NOW)).toEqual(BAD);
  });

  it.each([
    ["unknown", { ...demoBody, type: "careers" }],
    ["missing", { ...demoBody, type: undefined }],
    ["not text", { ...demoBody, type: ["demo"] }],
    ["wrong case", { ...demoBody, type: "Demo" }],
  ])("rejects a %s type", (_label, body) => {
    expect(parseSubmission(body, NOW)).toEqual(BAD);
  });

  it("rejects a school size that is not in the list", () => {
    expect(parseSubmission({ ...demoBody, schoolSize: "Huge" }, NOW)).toEqual(
      BAD,
    );
    expect(parseSubmission({ ...demoBody, schoolSize: 1 }, NOW)).toEqual(BAD);
    expect(parseSubmission(without(demoBody, "schoolSize"), NOW)).toEqual(BAD);
  });

  it("rejects products that are not in the list or not a list", () => {
    for (const products of [
      ["Parent Hub", "ERP"],
      "Parent Hub",
      ["PXP"],
      ["AI Tutor"],
      [1],
      null,
    ]) {
      expect(parseSubmission({ ...demoBody, products }, NOW)).toEqual(BAD);
    }
  });

  it("rejects more products than there are options", () => {
    const products = Array<string>(4).fill("Parent Hub");
    expect(parseSubmission({ ...demoBody, products }, NOW)).toEqual(BAD);
  });

  it("rejects a service or start timing that is not in the list", () => {
    expect(parseSubmission({ ...projectBody, service: "Spam" }, NOW)).toEqual(
      BAD,
    );
    expect(
      parseSubmission({ ...projectBody, startTiming: "Yesterday" }, NOW),
    ).toEqual(BAD);
  });

  it("does not check the select values of the other tab", () => {
    expect(
      parseSubmission({ ...demoBody, service: "Spam", startTiming: 1 }, NOW).ok,
    ).toBe(true);
  });
});

describe("parseSubmission honeypot", () => {
  it("flags a filled website field", () => {
    expect(
      parseSubmission({ ...demoBody, website: "https://spam.example" }, NOW),
    ).toEqual({ ok: false, honeypot: true });
    expect(
      parseSubmission({ ...projectBody, website: "https://spam.example" }, NOW),
    ).toEqual({ ok: false, honeypot: true });
  });

  it("flags it before any other check", () => {
    const body = {
      type: "demo",
      website: "x",
      name: "",
      role: "r".repeat(300),
      schoolSize: "nope",
    };
    expect(parseSubmission(body, NOW)).toEqual({ ok: false, honeypot: true });
  });

  it("flags a website value that is not text", () => {
    expect(parseSubmission({ ...demoBody, website: true }, NOW)).toEqual({
      ok: false,
      honeypot: true,
    });
  });

  it("does not flag an empty or missing website field", () => {
    expect(parseSubmission({ ...demoBody, website: "" }, NOW).ok).toBe(true);
    expect(parseSubmission(without(demoBody, "website"), NOW).ok).toBe(true);
  });

  it("still reports a bad type when the honeypot is filled", () => {
    expect(parseSubmission({ type: "careers", website: "x" }, NOW)).toEqual(
      BAD,
    );
  });
});

const captureBody = {
  type: "capture",
  kind: "demo",
  email: "lan@school.edu.vn",
  website: "",
};

describe("parseSubmission capture", () => {
  it.each(["demo", "project"] as const)(
    "accepts a %s capture and keeps only the kind and the email",
    (kind) => {
      const body = { ...captureBody, kind, name: "Lan", org: "School" };
      expect(parseSubmission(body, NOW)).toEqual({
        ok: true,
        submission: { type: "capture", kind, email: "lan@school.edu.vn" },
      });
    },
  );

  it("trims the email like the client", () => {
    expect(
      parseSubmission({ ...captureBody, email: "  lan@school.edu.vn " }, NOW),
    ).toMatchObject({ ok: true, submission: { email: "lan@school.edu.vn" } });
  });

  it("accepts an email of exactly 254 characters", () => {
    const email = `${"a".repeat(254 - "@d.edu".length)}@d.edu`;
    expect(email).toHaveLength(254);
    expect(parseSubmission({ ...captureBody, email }, NOW).ok).toBe(true);
  });

  it.each([
    ["without a dot in the domain", "lan@school"],
    ["empty", ""],
    ["only spaces", "   "],
    ["with a space inside", "lan @school.edu.vn"],
    ["over 254 characters", `${"a".repeat(255 - "@d.edu".length)}@d.edu`],
  ])("returns the client wording for an email %s", (_label, email) => {
    expect(parseSubmission({ ...captureBody, email }, NOW)).toEqual({
      ok: false,
      errors: { email: CONTACT_ERRORS.email },
    });
  });

  it("treats a missing or non-text email as empty", () => {
    expect(parseSubmission(without(captureBody, "email"), NOW)).toEqual({
      ok: false,
      errors: { email: CONTACT_ERRORS.email },
    });
    expect(parseSubmission({ ...captureBody, email: 42 }, NOW)).toEqual({
      ok: false,
      errors: { email: CONTACT_ERRORS.email },
    });
  });

  it.each([
    ["unknown", "careers"],
    ["wrong case", "Demo"],
    ["not text", ["demo"]],
    ["missing", undefined],
    ["a capture", "capture"],
  ])("rejects a %s kind as a bad body", (_label, kind) => {
    expect(parseSubmission({ ...captureBody, kind }, NOW)).toEqual(BAD);
  });

  it("judges the kind before the email", () => {
    expect(
      parseSubmission({ ...captureBody, kind: "x", email: "lan@school" }, NOW),
    ).toEqual(BAD);
  });

  it("flags a filled website field before the kind and the email", () => {
    const honeypot = { ok: false, honeypot: true };
    expect(
      parseSubmission({ ...captureBody, website: "https://spam.example" }, NOW),
    ).toEqual(honeypot);
    expect(
      parseSubmission(
        { ...captureBody, kind: "x", email: "no", website: "x" },
        NOW,
      ),
    ).toEqual(honeypot);
  });

  it("does not flag an empty or missing website field", () => {
    expect(parseSubmission(without(captureBody, "website"), NOW).ok).toBe(true);
  });
});

describe("parseSubmission time zones", () => {
  // The visitor's own date is never earlier than the UTC date minus one day
  // (UTC-12), so the server cut-off is the UTC date minus one day.
  it("accepts the local date of a visitor in UTC-12", () => {
    // 2026-10-10 00:30 UTC is 2026-10-09 12:30 in UTC-12.
    const now = new Date("2026-10-10T00:30:00Z");
    expect(parseSubmission({ ...demoBody, date: "2026-10-09" }, now).ok).toBe(
      true,
    );
  });

  it("accepts the local date of a visitor in UTC+14", () => {
    // 2026-10-10 23:59 UTC is 2026-10-11 13:59 in UTC+14.
    const now = new Date("2026-10-10T23:59:59Z");
    expect(parseSubmission({ ...demoBody, date: "2026-10-11" }, now).ok).toBe(
      true,
    );
  });

  it("rejects a date two days before the UTC date", () => {
    const now = new Date("2026-10-10T00:30:00Z");
    expect(parseSubmission({ ...demoBody, date: "2026-10-08" }, now)).toEqual({
      ok: false,
      errors: { date: CONTACT_ERRORS.date },
    });
  });

  it("steps back over a month and year end", () => {
    const monthStart = new Date("2026-11-01T00:00:00Z");
    expect(
      parseSubmission({ ...demoBody, date: "2026-10-31" }, monthStart).ok,
    ).toBe(true);
    expect(
      parseSubmission({ ...demoBody, date: "2026-10-30" }, monthStart).ok,
    ).toBe(false);
    const yearStart = new Date("2027-01-01T05:00:00Z");
    expect(
      parseSubmission({ ...demoBody, date: "2026-12-31" }, yearStart).ok,
    ).toBe(true);
    expect(
      parseSubmission({ ...demoBody, date: "2026-12-30" }, yearStart).ok,
    ).toBe(false);
  });
});

describe("parseSubmission general", () => {
  it("accepts a general message and keeps only the general fields", () => {
    const body = {
      ...generalBody,
      phone: " (+1) 469 322 9899 ",
      org: "Ignored Ltd",
      role: "x",
    };
    expect(parseSubmission(body, NOW)).toEqual({
      ok: true,
      submission: {
        type: "general",
        name: "Ana Tran",
        email: "ana@sunrise.edu",
        phone: "(+1) 469 322 9899",
        message: "Hello team",
      },
    });
  });

  it("accepts an empty phone and a missing phone", () => {
    const result = parseSubmission(without(generalBody, "phone"), NOW);
    expect(result).toMatchObject({
      ok: true,
      submission: { type: "general", phone: "" },
    });
  });

  it("rejects phone 12 with the phone error", () => {
    expect(parseSubmission({ ...generalBody, phone: "12" }, NOW)).toEqual({
      ok: false,
      errors: { phone: CONTACT_ERRORS.phone },
    });
  });

  it("rejects a blank message with the required error", () => {
    expect(parseSubmission({ ...generalBody, message: "  " }, NOW)).toEqual({
      ok: false,
      errors: { message: MESSAGE_REQUIRED_ERROR },
    });
  });

  it("answers a bot without reading the fields", () => {
    expect(
      parseSubmission({ ...generalBody, website: "x", phone: "12" }, NOW),
    ).toEqual({ ok: false, honeypot: true });
  });
});
