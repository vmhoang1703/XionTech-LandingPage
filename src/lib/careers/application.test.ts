// @vitest-environment node
import { describe, expect, it } from "vitest";
import { JOB_ERRORS } from "@/lib/careers/application-rules";
import { parseApplication } from "./application";

const valid = {
  slug: "placeholder-sample-job",
  name: "  Nam Tran ",
  email: " nam@example.com ",
  phone: " +84 90 000 0000 ",
  note: "Hello",
  cv: "cv/application-AbC123.pdf",
  website: "",
};

describe("parseApplication", () => {
  it("returns the trimmed application for a good body", () => {
    expect(parseApplication(valid)).toEqual({
      ok: true,
      application: {
        slug: "placeholder-sample-job",
        name: "Nam Tran",
        email: "nam@example.com",
        phone: "+84 90 000 0000",
        note: "Hello",
        cv: "cv/application-AbC123.pdf",
      },
    });
  });

  it("treats a missing phone and note as empty", () => {
    const { phone, note, ...rest } = valid;
    expect(phone).toBeTruthy();
    expect(note).toBeTruthy();
    expect(parseApplication(rest)).toMatchObject({
      ok: true,
      application: { phone: "", note: "" },
    });
  });

  it.each([null, undefined, "text", 42])("rejects a body of %s", (body) => {
    expect(parseApplication(body)).toEqual({ ok: false, bad: true });
  });

  it("answers the honeypot before any other check", () => {
    expect(parseApplication({ website: "http://spam.example" })).toEqual({
      ok: false,
      honeypot: true,
    });
  });

  it.each([
    ["slug missing", { slug: undefined }],
    ["slug empty", { slug: "" }],
    ["slug not a string", { slug: 5 }],
    ["cv missing", { cv: undefined }],
    ["cv empty", { cv: "" }],
    ["phone too long", { phone: "1".repeat(201) }],
    ["cv outside cv/", { cv: "other/application-x.pdf" }],
    ["cv in a subfolder", { cv: "cv/a/b.pdf" }],
    ["cv with dots up", { cv: "cv/../secret.pdf" }],
    ["cv with two dots", { cv: "cv/a.b.pdf" }],
    ["cv wrong extension", { cv: "cv/application-x.png" }],
    ["cv no extension", { cv: "cv/application-x" }],
    ["cv with a space", { cv: "cv/my cv.pdf" }],
  ])("rejects a bad body: %s", (_label, change) => {
    expect(parseApplication({ ...valid, ...change })).toEqual({
      ok: false,
      bad: true,
    });
  });

  it("accepts a phone of exactly 200 characters", () => {
    expect(
      parseApplication({ ...valid, phone: "1".repeat(200) }),
    ).toMatchObject({ ok: true });
  });

  it.each(["cv/a.PDF", "cv/a_b-1.Doc", "cv/a.docx"])("accepts %s", (cv) => {
    expect(parseApplication({ ...valid, cv })).toMatchObject({ ok: true });
  });

  it("returns field errors in the client wording", () => {
    expect(
      parseApplication({
        ...valid,
        name: "   ",
        email: "nope",
        note: "x".repeat(2001),
      }),
    ).toEqual({
      ok: false,
      errors: {
        name: JOB_ERRORS.name,
        email: JOB_ERRORS.email,
        note: JOB_ERRORS.note,
      },
    });
  });
});
