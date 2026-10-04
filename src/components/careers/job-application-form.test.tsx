import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CV_MAX_BYTES, JOB_ERRORS } from "@/lib/careers/application-rules";
import { JobApplicationForm } from "./job-application-form";

const uploadMock = vi.hoisted(() => vi.fn());
vi.mock("@vercel/blob/client", () => ({ uploadPresigned: uploadMock }));

const SEND_ERROR = "We could not send your application. Please try again.";
const RATE_ERROR =
  "You have sent several requests in a short time. Please try again in a few minutes.";
const PATHNAME = "cv/application-x1y2.pdf";

const fetchMock = vi.fn();
const reply = (status: number, body: unknown) =>
  Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
const field = (id: string) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`missing #${id}`);
  return el as HTMLInputElement;
};
const fill = (id: string, value: string) =>
  fireEvent.change(field(id), { target: { value } });
const pick = (file: File) =>
  fireEvent.change(field("a-cv"), { target: { files: [file] } });
const pdf = (name = "Ana CV.PDF") =>
  new File(["cv"], name, { type: "application/pdf" });
const submit = () =>
  fireEvent.click(screen.getByRole("button", { name: /Send|Sending/ }));
const button = () => screen.getByRole("button", { name: /Send|Sending/ });
const liveRegion = () => {
  const el = document.querySelector('[aria-live="polite"]');
  if (!el) throw new Error("missing live region");
  return el;
};
const describedText = (id: string) =>
  (field(id).getAttribute("aria-describedby") ?? "")
    .split(" ")
    .map((ref) => document.getElementById(ref)?.textContent)
    .join(" ");
const settle = () => act(async () => {});
const sentBody = (call = 0) => JSON.parse(fetchMock.mock.calls[call][1].body);
const fillValid = (file = pdf()) => {
  fill("a-name", "Ana Tran");
  fill("a-email", "ana@gmail.com");
  fill("a-phone", "0901");
  fill("a-note", "Hello");
  pick(file);
};

beforeEach(() => {
  fetchMock.mockReset();
  uploadMock.mockReset();
  uploadMock.mockResolvedValue({ pathname: PATHNAME });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("JobApplicationForm fields", () => {
  it("renders the heading, fields in order, help and consent link", () => {
    render(<JobApplicationForm slug="role" />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Apply for this role",
    );
    const ids = [...document.querySelectorAll("input, textarea")]
      .map((el) => el.id)
      .filter(Boolean);
    expect(ids).toEqual(["a-name", "a-email", "a-phone", "a-cv", "a-note"]);
    expect(field("a-name").getAttribute("maxlength")).toBe("200");
    expect(field("a-email").getAttribute("maxlength")).toBe("254");
    expect(field("a-email").type).toBe("email");
    expect(field("a-phone").type).toBe("tel");
    expect(field("a-phone").getAttribute("maxlength")).toBe("200");
    expect(field("a-cv").type).toBe("file");
    expect(field("a-cv").required).toBe(true);
    expect(field("a-cv").getAttribute("accept")).toContain(".docx");
    expect(describedText("a-cv")).toBe("PDF or Word, up to 5 MB.");
    expect(
      screen.getByRole("link", { name: "Privacy policy" }).getAttribute("href"),
    ).toBe("/privacy");
    expect(
      screen.getByText(
        "We only use your details and CV to consider your application.",
      ),
    ).toBeTruthy();
  });

  it("hides the honeypot from keyboard and screen readers", () => {
    render(<JobApplicationForm slug="role" />);
    const input = document.querySelector<HTMLInputElement>('[name="website"]');
    expect(input?.getAttribute("tabindex")).toBe("-1");
    expect(input?.getAttribute("aria-hidden")).toBe("true");
    expect(input?.classList.contains("sr-only")).toBe(true);
  });
});

describe("JobApplicationForm CV check on change", () => {
  it.each([
    ["a .png", new File(["x"], "me.png", { type: "image/png" })],
    ["an empty file", new File([], "cv.pdf")],
    [
      "a file over 5 MiB",
      new File([new Uint8Array(CV_MAX_BYTES + 1)], "cv.pdf"),
    ],
  ])("flags %s at once and announces it", (_name, file) => {
    render(<JobApplicationForm slug="role" />);
    pick(file);
    expect(field("a-cv").getAttribute("aria-invalid")).toBe("true");
    expect(describedText("a-cv")).toContain(JOB_ERRORS.cv);
    expect(field("a-cv").closest(".field")?.classList.contains("bad")).toBe(
      true,
    );
    expect(liveRegion().textContent).toContain(JOB_ERRORS.cv);
  });

  it("clears the error when a valid file is chosen", () => {
    render(<JobApplicationForm slug="role" />);
    pick(new File(["x"], "me.png"));
    pick(pdf());
    expect(field("a-cv").hasAttribute("aria-invalid")).toBe(false);
    expect(describedText("a-cv")).toBe("PDF or Word, up to 5 MB.");
    expect(liveRegion().textContent).toBe("");
  });

  it("flags a cleared file input", () => {
    render(<JobApplicationForm slug="role" />);
    fireEvent.change(field("a-cv"), { target: { files: [] } });
    expect(field("a-cv").getAttribute("aria-invalid")).toBe("true");
  });
});

describe("JobApplicationForm submit errors", () => {
  it("shows every error, announces them and focuses the first", () => {
    render(<JobApplicationForm slug="role" />);
    fill("a-note", "a".repeat(2001));
    submit();
    expect(field("a-name").getAttribute("aria-invalid")).toBe("true");
    expect(field("a-email").getAttribute("aria-invalid")).toBe("true");
    expect(field("a-cv").getAttribute("aria-invalid")).toBe("true");
    expect(field("a-note").getAttribute("aria-invalid")).toBe("true");
    expect(describedText("a-name")).toBe("Please enter your name.");
    expect(describedText("a-note")).toContain("under 2,000");
    const announced = liveRegion().textContent ?? "";
    expect(announced).toContain("Please fix the following:");
    expect(announced).toContain(JOB_ERRORS.cv);
    expect(document.activeElement).toBe(field("a-name"));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(uploadMock).not.toHaveBeenCalled();
  });

  it("focuses the CV when only the CV is missing", () => {
    render(<JobApplicationForm slug="role" />);
    fill("a-name", "Ana");
    fill("a-email", "ana@gmail.com");
    submit();
    expect(document.activeElement).toBe(field("a-cv"));
  });

  it("clears a field's error when the visitor types in it", () => {
    render(<JobApplicationForm slug="role" />);
    submit();
    fill("a-name", "A");
    expect(field("a-name").hasAttribute("aria-invalid")).toBe(false);
    expect(field("a-email").getAttribute("aria-invalid")).toBe("true");
  });

  it("does not touch the CV error when other fields change", () => {
    render(<JobApplicationForm slug="role" />);
    pick(new File(["x"], "me.png"));
    fill("a-phone", "1");
    expect(field("a-cv").getAttribute("aria-invalid")).toBe("true");
  });
});

describe("JobApplicationForm sending", () => {
  it("disables the button and reads Sending... during the upload", async () => {
    uploadMock.mockReturnValue(new Promise(() => {}));
    render(<JobApplicationForm slug="role" />);
    fillValid();
    submit();
    await settle();
    expect(button().hasAttribute("disabled")).toBe(true);
    expect(button().textContent).toBe("Sending...");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("uploads, then posts JSON with the pathname and no file name", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    const file = pdf();
    render(<JobApplicationForm slug="sample-role" />);
    fillValid(file);
    submit();
    await settle();
    expect(uploadMock).toHaveBeenCalledTimes(1);
    const [path, body, options] = uploadMock.mock.calls[0];
    expect(path).toBe("cv/application.pdf");
    expect(body).toBe(file);
    expect(options).toMatchObject({
      access: "private",
      handleUploadUrl: "/api/careers/cv-upload",
      contentType: "application/pdf",
      multipart: false,
    });
    expect(options.abortSignal).toBeInstanceOf(AbortSignal);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/careers/apply");
    expect(sentBody()).toEqual({
      slug: "sample-role",
      name: "Ana Tran",
      email: "ana@gmail.com",
      phone: "0901",
      note: "Hello",
      cv: PATHNAME,
      website: "",
    });
    expect(JSON.stringify(sentBody())).not.toContain("Ana CV");
    expect(setTimeoutSpy.mock.calls.map(([, ms]) => ms)).toContain(35_000);
  });

  it("replaces the form with the success panel, focused", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    render(<JobApplicationForm slug="role" />);
    fillValid();
    submit();
    await settle();
    const panel = screen.getByRole("status");
    expect(panel.textContent).toContain("Thank you!");
    expect(panel.textContent).toContain("will be in touch if it's a match.");
    expect(panel.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(panel);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });

  it("does not abort an upload answered in time", async () => {
    vi.useFakeTimers();
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    render(<JobApplicationForm slug="role" />);
    fillValid();
    submit();
    await settle();
    const { abortSignal } = uploadMock.mock.calls[0][2];
    await act(async () => {
      vi.advanceTimersByTime(70_000);
    });
    expect(abortSignal.aborted).toBe(false);
  });

  it("aborts the upload after 60 seconds and shows the send error", async () => {
    vi.useFakeTimers();
    uploadMock.mockImplementation(
      (_p: string, _f: File, options: { abortSignal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          options.abortSignal.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    render(<JobApplicationForm slug="role" />);
    fillValid();
    submit();
    await settle();
    await act(async () => {
      vi.advanceTimersByTime(59_999);
    });
    expect(button().textContent).toBe("Sending...");
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole("alert").textContent).toBe(SEND_ERROR);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("JobApplicationForm failures", () => {
  const expectKept = (file: File) => {
    expect(field("a-name").value).toBe("Ana Tran");
    expect(field("a-email").value).toBe("ana@gmail.com");
    expect(field("a-phone").value).toBe("0901");
    expect(field("a-note").value).toBe("Hello");
    expect(field("a-cv").files?.[0]).toBe(file);
    expect(button().hasAttribute("disabled")).toBe(false);
    expect(button().textContent).toBe("Send application");
    expect(document.activeElement).toBe(button());
    expect(
      screen.getByRole("alert").compareDocumentPosition(button()) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  };

  it("keeps values and the file when the upload fails", async () => {
    uploadMock.mockRejectedValue(new Error("blob down"));
    const file = pdf();
    render(<JobApplicationForm slug="role" />);
    fillValid(file);
    submit();
    await settle();
    expect(screen.getByRole("alert").textContent).toBe(SEND_ERROR);
    expect(fetchMock).not.toHaveBeenCalled();
    expectKept(file);
  });

  it("shows the rate message and keeps values when the upload limit is used up", async () => {
    // @vercel/blob 2.8.0 throws this for the token route's rate-limit answer.
    uploadMock.mockRejectedValue(
      new Error("Vercel Blob: Missing presignedUrlPayload"),
    );
    const file = pdf();
    render(<JobApplicationForm slug="role" />);
    fillValid(file);
    submit();
    await settle();
    expect(screen.getByRole("alert").textContent).toBe(RATE_ERROR);
    expect(fetchMock).not.toHaveBeenCalled();
    expectKept(file);
  });

  it("re-uploads on retry after an upload failure", async () => {
    uploadMock.mockRejectedValueOnce(new Error("blob down"));
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    render(<JobApplicationForm slug="role" />);
    fillValid();
    submit();
    await settle();
    submit();
    await settle();
    expect(uploadMock).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it.each([
    ["a 502", () => reply(502, { error: "send" }), SEND_ERROR],
    ["a 429", () => reply(429, { error: "rate" }), RATE_ERROR],
    ["a network error", () => Promise.reject(new TypeError("x")), SEND_ERROR],
  ])("keeps values and the file on %s", async (_n, answer, message) => {
    fetchMock.mockImplementation(answer);
    const file = pdf();
    render(<JobApplicationForm slug="role" />);
    fillValid(file);
    submit();
    await settle();
    expect(screen.getByRole("alert").textContent).toBe(message);
    expectKept(file);
  });

  it.each([
    ["a send failure", () => reply(502, { error: "send" })],
    ["a rate limit", () => reply(429, { error: "rate" })],
    [
      "server field errors",
      () => reply(400, { errors: { note: JOB_ERRORS.note } }),
    ],
  ])(
    "uploads the same CV again on the next submit after %s, because the server deleted it",
    async (_label, failure) => {
      fetchMock.mockReturnValueOnce(failure());
      render(<JobApplicationForm slug="role" />);
      fillValid();
      submit();
      await settle();
      fetchMock.mockReturnValueOnce(reply(200, { ok: true }));
      submit();
      expect(screen.queryByRole("alert")).toBeNull();
      await settle();
      expect(uploadMock).toHaveBeenCalledTimes(2);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(sentBody(1).cv).toBe(PATHNAME);
      expect(screen.getByRole("status")).toBeTruthy();
    },
  );

  it("uploads again when another file is chosen", async () => {
    fetchMock.mockReturnValueOnce(reply(502, { error: "send" }));
    render(<JobApplicationForm slug="role" />);
    fillValid();
    submit();
    await settle();
    fetchMock.mockReturnValueOnce(reply(200, { ok: true }));
    pick(pdf("other.pdf"));
    submit();
    await settle();
    expect(uploadMock).toHaveBeenCalledTimes(2);
  });

  it("shows server field errors, focuses the first and keeps values", async () => {
    fetchMock.mockReturnValue(
      reply(400, {
        errors: { email: "Please enter a valid email address.", note: "Bad" },
      }),
    );
    render(<JobApplicationForm slug="role" />);
    fillValid();
    submit();
    await settle();
    expect(field("a-email").getAttribute("aria-invalid")).toBe("true");
    expect(describedText("a-email")).toBe(
      "Please enter a valid email address.",
    );
    expect(field("a-note").getAttribute("aria-invalid")).toBe("true");
    expect(liveRegion().textContent).toContain("Please fix the following:");
    expect(document.activeElement).toBe(field("a-email"));
    expect(field("a-name").value).toBe("Ana Tran");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(button().hasAttribute("disabled")).toBe(false);
  });

  it("uploads again after the server flags the CV", async () => {
    fetchMock.mockReturnValueOnce(
      reply(400, { errors: { cv: JOB_ERRORS.cv } }),
    );
    const file = pdf();
    render(<JobApplicationForm slug="role" />);
    fillValid(file);
    submit();
    await settle();
    expect(field("a-cv").getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(field("a-cv"));
    fetchMock.mockReturnValueOnce(reply(200, { ok: true }));
    fill("a-name", "Ana T");
    pick(file);
    submit();
    await settle();
    expect(uploadMock).toHaveBeenCalledTimes(2);
  });
});
