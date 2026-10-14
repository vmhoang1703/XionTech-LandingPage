import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CaptureBand } from "./capture-band";
import { CAPTURE_EMAIL_KEY } from "./capture-storage";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const EMAIL = "lan@school.edu.vn";
const INVALID_EMAIL = "Please enter a valid email address.";
// The Demo page is inactive: every band leads to the Home Get in touch form.
const DESTINATION = "/#contact";

const BANDS = {
  demo: {
    heading: "See it working at your school.",
    lede: "Leave your work email and we'll arrange a walkthrough built around your school.",
    placeholder: "name@school.edu.vn",
    consent: "We only use your email to arrange your demo.",
  },
  project: {
    heading: "Tell us what you're building.",
    lede: "Leave your work email and we'll reach out to start Discovery.",
    placeholder: "name@company.com",
    consent: "We only use your details to respond to this request.",
  },
} as const;

const CUSTOM_COPY = {
  heading: "See our apps in action.",
  lede: "Leave your work email and we'll arrange a walkthrough of Parent Hub and Staff Hub.",
};

const fetchMock = vi.fn();
const setItem = vi.fn();
const emailField = () => screen.getByLabelText("Work email");
const button = () => screen.getByRole("button", { name: "Get in touch" });
const type = (value: string) =>
  fireEvent.change(emailField(), { target: { value } });
const submit = () => fireEvent.click(button());

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

describe("CaptureBand look", () => {
  it("puts the optional id on the section, and none by default", () => {
    const { container, rerender } = render(<CaptureBand kind="demo" />);
    expect(container.querySelector("section")?.hasAttribute("id")).toBe(false);

    rerender(<CaptureBand kind="demo" id="book" />);
    expect(container.querySelector("section")?.id).toBe("book");
  });

  const section = () => screen.getByRole("region").className;

  it("keeps the amber band and the navy button when no look is given", () => {
    render(<CaptureBand kind="demo" />);
    expect(section()).toContain("surface-amber");
    expect(section()).not.toContain("capture-plain");
    expect(button().className).toBe("btn btn-navy");
  });

  it.each([
    ["white", "surface-paper"],
    ["page", "hero-light"],
    ["navy", "surface-navy"],
  ] as const)("look %s is plain, with a primary button", (look, surface) => {
    render(<CaptureBand kind="demo" look={look} />);
    expect(section()).toContain(surface);
    expect(section()).toContain("capture-plain");
    expect(section()).not.toContain("surface-amber");
    expect(button().className).toBe("btn btn-primary");
    expect(screen.getByRole("link", { name: "Privacy policy" })).toBeTruthy();
  });
});

describe.each(["demo", "project"] as const)("CaptureBand kind %s", (kind) => {
  const band = BANDS[kind];

  it("shows the heading, lede, field, Get in touch button, consent and Privacy link", () => {
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
    expect(button().textContent).toBe("Get in touch");
    const consent = screen.getByText(band.consent);
    const link = screen.getByRole("link", { name: "Privacy policy" });
    expect(link.getAttribute("href")).toBe("/privacy");
    expect(consent.parentElement?.contains(link)).toBe(true);
  });

  it("posts the form natively, so a press before hydration never puts the email in the URL", () => {
    render(<CaptureBand kind={kind} />);
    expect(emailField().closest("form")?.getAttribute("method")).toBe("post");
  });

  it("keeps the email, trimmed, and goes to the Get in touch form without sending", () => {
    render(<CaptureBand kind={kind} />);
    type(`  ${EMAIL}  `);
    submit();

    expect(setItem).toHaveBeenCalledExactlyOnceWith(CAPTURE_EMAIL_KEY, EMAIL);
    expect(push).toHaveBeenCalledExactlyOnceWith(DESTINATION);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("still goes to the form, with no error or log, when session storage throws", () => {
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
    submit();

    expect(push).toHaveBeenCalledExactlyOnceWith(DESTINATION);
    expect(screen.queryByRole("alert")).toBeNull();
    for (const log of logs) expect(log).not.toHaveBeenCalled();
  });

  it.each([
    ["an address with no domain dot", "lan@school"],
    ["an empty field", ""],
    ["only spaces", "   "],
    ["an address over 254 characters", `${"a".repeat(250)}@school.edu.vn`],
  ])("stays on %s and explains it inline", (_label, value) => {
    render(<CaptureBand kind={kind} />);
    type(value);
    submit();

    expect(setItem).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    const error = screen.getByRole("alert");
    expect(error.textContent).toBe(INVALID_EMAIL);
    expect(emailField().getAttribute("aria-invalid")).toBe("true");
    expect(emailField().getAttribute("aria-describedby")).toBe(error.id);
    expect(document.activeElement).toBe(emailField());
  });

  it("clears the error and aria-invalid as the visitor types", () => {
    render(<CaptureBand kind={kind} />);
    type("lan@school");
    submit();
    expect(screen.getByRole("alert")).toBeTruthy();

    type("lan@school.");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(emailField().hasAttribute("aria-invalid")).toBe(false);
    expect(emailField().hasAttribute("aria-describedby")).toBe(false);
  });

  it("goes on with Enter in the field", () => {
    render(<CaptureBand kind={kind} />);
    type(EMAIL);
    const form = emailField().closest("form");
    if (!form) throw new Error("missing form");
    fireEvent.submit(form);

    expect(push).toHaveBeenCalledExactlyOnceWith(DESTINATION);
  });

  it("with custom copy, shows the custom heading and lede and keeps the rest", () => {
    render(<CaptureBand kind={kind} copy={CUSTOM_COPY} />);
    expect(
      screen.getByRole("heading", { level: 2, name: CUSTOM_COPY.heading }),
    ).toBeTruthy();
    expect(screen.getByText(CUSTOM_COPY.lede)).toBeTruthy();
    expect(screen.queryByText(band.heading)).toBeNull();
    expect(emailField().getAttribute("placeholder")).toBe(band.placeholder);
    expect(screen.getByText(band.consent)).toBeTruthy();
    type(EMAIL);
    submit();
    expect(push).toHaveBeenCalledExactlyOnceWith(DESTINATION);
  });
});
