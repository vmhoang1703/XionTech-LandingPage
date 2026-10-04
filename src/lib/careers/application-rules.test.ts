import { describe, expect, it } from "vitest";
import { LENGTH_ERROR } from "@/lib/contact/contact-rules";
import {
  CV_MAX_BYTES,
  CV_TYPES,
  JOB_ERRORS,
  cvError,
  storedCvError,
  validateApplication,
  type ApplicationValues,
} from "./application-rules";

const PDF = "application/pdf";
const DOC = "application/msword";
const DOCX =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const valid: ApplicationValues = {
  name: "Nam Tran",
  email: "nam@example.com",
  note: "",
};

describe("constants", () => {
  it("limits the CV to 5 MiB", () => {
    expect(CV_MAX_BYTES).toBe(5 * 1024 * 1024);
  });

  it("maps each extension to its MIME type", () => {
    expect(CV_TYPES).toEqual({ pdf: PDF, doc: DOC, docx: DOCX });
  });

  it("uses the client wording", () => {
    expect(JOB_ERRORS).toEqual({
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      cv: "Please upload your CV as a PDF or Word file, up to 5 MB.",
      note: "Please keep your note under 2,000 characters.",
    });
  });
});

describe("cvError", () => {
  it.each([
    ["cv.pdf", 1],
    ["cv.doc", 100],
    ["cv.docx", 100],
    ["CV.PDF", 100],
    ["My.Resume.DocX", 100],
    ["cv.pdf", CV_MAX_BYTES],
  ])("accepts %s at %d bytes", (name, size) => {
    expect(cvError({ name, size })).toBeUndefined();
  });

  it.each([
    ["cv.png", 100],
    ["cv", 100],
    ["cv.", 100],
    ["pdf", 100],
    ["cv.pdf.exe", 100],
    ["cv.pdf", 0],
    ["cv.pdf", CV_MAX_BYTES + 1],
  ])("rejects %s at %d bytes", (name, size) => {
    expect(cvError({ name, size })).toBe(JOB_ERRORS.cv);
  });
});

describe("storedCvError", () => {
  const stored = { pathname: "cv/application-x1.pdf", size: 10 };

  it.each([
    ["cv/application-x1.pdf", PDF],
    ["cv/application-x1.PDF", PDF],
    ["cv/application-x1.doc", DOC],
    ["cv/application-x1.docx", DOCX],
    ["cv/application-x1.pdf", `${PDF}; charset=binary`],
  ])("accepts %s as %s", (pathname, contentType) => {
    expect(storedCvError({ ...stored, pathname, contentType })).toBeUndefined();
  });

  it("accepts exactly 5 MiB and rejects one byte more", () => {
    const ok = { ...stored, contentType: PDF };
    expect(storedCvError({ ...ok, size: CV_MAX_BYTES })).toBeUndefined();
    expect(storedCvError({ ...ok, size: CV_MAX_BYTES + 1 })).toBe(
      JOB_ERRORS.cv,
    );
  });

  it("rejects 0 bytes", () => {
    expect(storedCvError({ ...stored, size: 0, contentType: PDF })).toBe(
      JOB_ERRORS.cv,
    );
  });

  it("rejects an extension that is not allowed", () => {
    expect(
      storedCvError({ ...stored, pathname: "cv/a.png", contentType: PDF }),
    ).toBe(JOB_ERRORS.cv);
  });

  it("rejects a MIME type that does not match the extension", () => {
    expect(storedCvError({ ...stored, contentType: DOC })).toBe(JOB_ERRORS.cv);
  });

  it("rejects a MIME type that is not allowed", () => {
    expect(storedCvError({ ...stored, contentType: "image/png" })).toBe(
      JOB_ERRORS.cv,
    );
  });
});

describe("validateApplication", () => {
  it("accepts a valid application", () => {
    expect(validateApplication(valid)).toEqual({});
  });

  it("flags an empty name and a long name", () => {
    expect(validateApplication({ ...valid, name: "  " }).name).toBe(
      JOB_ERRORS.name,
    );
    expect(validateApplication({ ...valid, name: "a".repeat(201) }).name).toBe(
      LENGTH_ERROR,
    );
    expect(
      validateApplication({ ...valid, name: "a".repeat(200) }).name,
    ).toBeUndefined();
  });

  it("flags a bad or too long email", () => {
    expect(validateApplication({ ...valid, email: "nam" }).email).toBe(
      JOB_ERRORS.email,
    );
    const long = `${"a".repeat(250)}@b.co`;
    expect(validateApplication({ ...valid, email: long }).email).toBe(
      JOB_ERRORS.email,
    );
  });

  it("counts a CRLF in the note as one character", () => {
    const edge = "a\r\n".repeat(1000);
    expect(validateApplication({ ...valid, note: edge }).note).toBeUndefined();
    expect(validateApplication({ ...valid, note: `${edge}a` }).note).toBe(
      JOB_ERRORS.note,
    );
  });

  it("returns every error at once", () => {
    expect(
      Object.keys(
        validateApplication({
          name: "",
          email: "x",
          note: "a".repeat(2001),
        }),
      ).sort(),
    ).toEqual(["email", "name", "note"]);
  });
});
