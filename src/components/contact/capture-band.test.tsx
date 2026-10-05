import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CaptureBand } from "./capture-band";
import { CAPTURE_EMAIL_KEY } from "./capture-storage";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const EMAIL = "lan@school.edu.vn";
const INVALID_EMAIL = "Please enter a valid email address.";
const SEND_ERROR = "We could not send your request. Please try again.";
const RATE_ERROR =
  "You have sent several requests in a short time. Please try again in a few minutes.";

const BANDS = {
  demo: {
    heading: "See it working at your school.",
    lede: "Leave your work email and we'll arrange a walkthrough built around your school.",
    placeholder: "name@school.edu.vn",
    button: "Book a demo",
    consent: "We only use your email to arrange your demo.",
    destination: "/demo#form",
  },
  project: {
    heading: "Tell us what you're building.",
    lede: "Leave your work email and we'll reach out to start Discovery.",
    placeholder: "name@company.com",
    button: "Start a project",
    consent: "We only use your details to respond to this request.",
    destination: "/demo#project",
  },
} as const;

const fetchMock = vi.fn();
const reply = (status: number, body: unknown) =>
  Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
const pendingFetch = () => new Promise<Response>(() => {});
const sentBody = (call = 0) => JSON.parse(fetchMock.mock.calls[call][1].body);

const emailField = () => screen.getByLabelText("Work email");
const honeypot = () => {
  const el = document.querySelector<HTMLInputElement>('input[name="website"]');
  if (!el) throw new Error("missing honeypot");
  return el;
};
const button = () => screen.getByRole("button", { name: /Book|Start|Sending/ });
const type = (value: string) =>
  fireEvent.change(emailField(), { target: { value } });
const submit = () => fireEvent.click(button());
/** Wait for the fetch promise and the state updates that follow it. */
const settle = () => act(async () => {});
const submitAndSettle = async () => {
  submit();
  await settle();
};

const setItem = vi.fn();

const CUSTOM_COPY = {
  heading: "See our apps in action.",
  lede: "Leave your work email and we'll arrange a walkthrough of PXP, LXP and SXP.",
};

beforeEach(() => {
  fetchMock.mockReset();
  push.mockReset();
  setItem.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("sessionStorage", { setItem });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe.each(["demo", "project"] as const)("CaptureBand kind %s", (kind) => {
  const band = BANDS[kind];

  it("shows the heading, lede, field, button, consent and Privacy link inline", () => {
    render(<CaptureBand kind={kind} />);
    const region = screen.getByRole("region", { name: band.heading });
    expect(region.tagName).toBe("SECTION");
    expect(
      screen.getByRole("heading", { level: 2, name: band.heading }),
    ).toBeTruthy();
    expect(screen.getByText(band.lede)).toBeTruthy();
    expect(emailField().getAttribute("placeholder")).toBe(band.placeholder);
    expect(emailField().getAttribute("type")).toBe("email");
    expect(emailField().getAttribute("autocomplete")).toBe("email");
    expect(button().textContent).toBe(band.button);
    expect(button().className).toBe("btn btn-navy");
    expect(screen.queryByRole("dialog")).toBeNull();
    const consent = screen.getByText(band.consent);
    const link = screen.getByRole("link", { name: "Privacy policy" });
    expect(link.getAttribute("href")).toBe("/privacy");
    expect(consent.parentElement?.contains(link)).toBe(true);
  });

  it("has a hidden honeypot that keyboard and screen reader users skip", () => {
    render(<CaptureBand kind={kind} />);
    expect(honeypot().tabIndex).toBe(-1);
    expect(honeypot().getAttribute("aria-hidden")).toBe("true");
    expect(honeypot().getAttribute("autocomplete")).toBe("off");
    expect(honeypot().value).toBe("");
  });

  it("posts the form natively, so a press before hydration never puts the email in the URL", () => {
    render(<CaptureBand kind={kind} />);
    expect(emailField().closest("form")?.getAttribute("method")).toBe("post");
  });

  it("ignores a late 200 after the visitor left the page", async () => {
    let finish: (response: Response) => void = () => {};
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        finish = resolve;
      }),
    );
    const { unmount } = render(<CaptureBand kind={kind} />);
    type(EMAIL);
    submit();
    unmount();
    finish(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    await settle();

    expect(setItem).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("posts a valid email, stores it, then goes to the right form tab", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    render(<CaptureBand kind={kind} />);
    type(EMAIL);
    await submitAndSettle();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentBody()).toEqual({
      type: "capture",
      kind,
      email: EMAIL,
      website: "",
    });
    expect(setItem).toHaveBeenCalledExactlyOnceWith(CAPTURE_EMAIL_KEY, EMAIL);
    expect(setItem.mock.invocationCallOrder[0]).toBeLessThan(
      push.mock.invocationCallOrder[0],
    );
    expect(push).toHaveBeenCalledExactlyOnceWith(band.destination);
    expect(push.mock.calls[0][0]).not.toContain(EMAIL);
    expect(push.mock.calls[0][0]).not.toContain("@");
  });

  // An email input drops surrounding spaces from its value in the browser; the
  // band trims too, so it and the server agree on the same rule.
  it("sends the email without surrounding spaces", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    render(<CaptureBand kind={kind} />);
    type(`  ${EMAIL}  `);
    await submitAndSettle();

    expect(sentBody().email).toBe(EMAIL);
    expect(setItem).toHaveBeenCalledWith(CAPTURE_EMAIL_KEY, EMAIL);
    expect(push).toHaveBeenCalledTimes(1);
  });

  it("sends the honeypot value and still goes on when the server answers 200", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    render(<CaptureBand kind={kind} />);
    type(EMAIL);
    fireEvent.change(honeypot(), { target: { value: "https://spam.test" } });
    await submitAndSettle();

    expect(sentBody().website).toBe("https://spam.test");
    expect(push).toHaveBeenCalledExactlyOnceWith(band.destination);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("still goes to the right tab with no error when session storage throws", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    setItem.mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    const logs = [
      vi.spyOn(console, "error"),
      vi.spyOn(console, "warn"),
      vi.spyOn(console, "log"),
    ];
    render(<CaptureBand kind={kind} />);
    type(EMAIL);
    await submitAndSettle();

    expect(push).toHaveBeenCalledExactlyOnceWith(band.destination);
    expect(screen.queryByRole("alert")).toBeNull();
    for (const log of logs) expect(log).not.toHaveBeenCalled();
  });

  it.each([
    ["an address with no domain dot", "lan@school"],
    ["an empty field", ""],
    ["only spaces", "   "],
    ["an address over 254 characters", `${"a".repeat(250)}@school.edu.vn`],
  ])("does not post %s and explains it inline", async (_label, value) => {
    render(<CaptureBand kind={kind} />);
    type(value);
    await submitAndSettle();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    const error = screen.getByRole("alert");
    expect(error.textContent).toBe(INVALID_EMAIL);
    expect(emailField().getAttribute("aria-invalid")).toBe("true");
    expect(emailField().getAttribute("aria-describedby")).toBe(error.id);
    expect(document.activeElement).toBe(emailField());
    expect(button().textContent).toBe(band.button);
  });

  it("clears the error and aria-invalid as the visitor types", async () => {
    render(<CaptureBand kind={kind} />);
    type("lan@school");
    await submitAndSettle();
    expect(screen.getByRole("alert")).toBeTruthy();

    type("lan@school.");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(emailField().hasAttribute("aria-invalid")).toBe(false);
    expect(emailField().hasAttribute("aria-describedby")).toBe(false);
  });

  it("disables the button and reads Sending... while it waits for the answer", async () => {
    fetchMock.mockReturnValue(pendingFetch());
    render(<CaptureBand kind={kind} />);
    type(EMAIL);
    await submitAndSettle();

    expect(button().textContent).toBe("Sending...");
    expect((button() as HTMLButtonElement).disabled).toBe(true);
    expect(push).not.toHaveBeenCalled();
  });

  it.each([
    ["502", 502, { error: "send" }, SEND_ERROR],
    ["500", 500, {}, SEND_ERROR],
    ["429", 429, { error: "rate" }, RATE_ERROR],
  ])(
    "keeps the email and stays on the band after a %s",
    async (_label, status, body, message) => {
      fetchMock.mockReturnValue(reply(status, body));
      render(<CaptureBand kind={kind} />);
      type(EMAIL);
      await submitAndSettle();

      expect(screen.getByRole("alert").textContent).toBe(message);
      expect((emailField() as HTMLInputElement).value).toBe(EMAIL);
      expect(button().textContent).toBe(band.button);
      expect((button() as HTMLButtonElement).disabled).toBe(false);
      expect(document.activeElement).toBe(button());
      expect(emailField().hasAttribute("aria-invalid")).toBe(false);
      expect(setItem).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
    },
  );

  it("shows the send message when the network fails", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<CaptureBand kind={kind} />);
    type(EMAIL);
    await submitAndSettle();

    expect(screen.getByRole("alert").textContent).toBe(SEND_ERROR);
    expect(push).not.toHaveBeenCalled();
  });

  it("retries with the same button and goes on after a failure", async () => {
    fetchMock
      .mockReturnValueOnce(reply(502, { error: "send" }))
      .mockReturnValueOnce(reply(200, { ok: true }));
    render(<CaptureBand kind={kind} />);
    type(EMAIL);
    await submitAndSettle();
    expect(screen.getByRole("alert").textContent).toBe(SEND_ERROR);

    await submitAndSettle();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sentBody(1).email).toBe(EMAIL);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(push).toHaveBeenCalledExactlyOnceWith(band.destination);
  });

  it("hides the old failure message while a retry is sending", async () => {
    fetchMock
      .mockReturnValueOnce(reply(502, { error: "send" }))
      .mockReturnValueOnce(pendingFetch());
    render(<CaptureBand kind={kind} />);
    type(EMAIL);
    await submitAndSettle();
    expect(screen.getByRole("alert")).toBeTruthy();

    await submitAndSettle();

    expect(screen.queryByRole("alert")).toBeNull();
    expect(button().textContent).toBe("Sending...");
  });

  it("shows the email error when the server rejects the email", async () => {
    fetchMock.mockReturnValue(reply(400, { errors: { email: INVALID_EMAIL } }));
    render(<CaptureBand kind={kind} />);
    type(EMAIL);
    await submitAndSettle();

    const error = screen.getByRole("alert");
    expect(error.textContent).toBe(INVALID_EMAIL);
    expect(emailField().getAttribute("aria-invalid")).toBe("true");
    expect(emailField().getAttribute("aria-describedby")).toBe(error.id);
    expect(document.activeElement).toBe(emailField());
    expect(button().textContent).toBe(band.button);
    expect(push).not.toHaveBeenCalled();
  });

  it("submits with Enter in the field", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    render(<CaptureBand kind={kind} />);
    type(EMAIL);
    const form = emailField().closest("form");
    if (!form) throw new Error("missing form");
    fireEvent.submit(form);
    await settle();

    expect(push).toHaveBeenCalledExactlyOnceWith(band.destination);
  });

  it("with custom copy prop, shows the custom heading and lede while keeping button, placeholder and redirect from the kind", () => {
    render(<CaptureBand kind={kind} copy={CUSTOM_COPY} />);
    const region = screen.getByRole("region", { name: CUSTOM_COPY.heading });
    expect(region.tagName).toBe("SECTION");
    expect(
      screen.getByRole("heading", { level: 2, name: CUSTOM_COPY.heading }),
    ).toBeTruthy();
    expect(screen.getByText(CUSTOM_COPY.lede)).toBeTruthy();
    expect(screen.queryByText(band.heading)).toBeNull();
    expect(screen.queryByText(band.lede)).toBeNull();
    expect(emailField().getAttribute("placeholder")).toBe(band.placeholder);
    expect(button().textContent).toBe(band.button);
    expect(screen.getByText(band.consent)).toBeTruthy();
  });

  it("with custom copy prop, still redirects to the kind's destination on successful submission", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    render(<CaptureBand kind={kind} copy={CUSTOM_COPY} />);
    type(EMAIL);
    await submitAndSettle();

    expect(push).toHaveBeenCalledExactlyOnceWith(band.destination);
  });
});
