import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/layout/locale-link";
import { CAPTURE_EMAIL_KEY } from "./capture-storage";
import { HomeContactForm } from "./home-contact-form";

// The success panel is a polite live region that takes focus (Sonar S6819:
// no role="status" on a block of headings and text).
function successPanel(): HTMLElement {
  const panel = document.querySelector<HTMLElement>(".form-ok");
  if (!panel) throw new Error("no success panel");
  expect(panel.getAttribute("aria-live")).toBe("polite");
  return panel;
}

const field = (id: string) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`missing #${id}`);
  return el;
};
const fill = (id: string, value: string) =>
  fireEvent.change(field(id), { target: { value } });
const fillRequired = () => {
  fill("c-name", "Ana Tran");
  fill("c-email", "ana@gmail.com");
  fill("c-msg", "We want a parent app.");
};
const errorText = (id: string) =>
  document.getElementById(field(id).getAttribute("aria-describedby") ?? "")
    ?.textContent;
const submit = () =>
  fireEvent.click(
    screen.getByRole("button", { name: /Start the conversation|Sending/ }),
  );
const liveRegion = () => {
  const el = document.querySelector('[aria-live="polite"]');
  if (!el) throw new Error("missing live region");
  return el;
};

const PHONE_ERROR =
  "Please enter a valid phone number, for example (+1) 469 322 9899.";

const fetchMock = vi.fn();
const reply = (status: number, body: unknown) =>
  Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
const sentBody = () => JSON.parse(fetchMock.mock.calls[0][1].body);
const settle = () => act(async () => {});

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("HomeContactForm", () => {
  it("fills in the email a capture band on another page kept", () => {
    sessionStorage.setItem(CAPTURE_EMAIL_KEY, "lan@school.edu.vn");
    render(<HomeContactForm />);
    expect(screen.getByLabelText("Email address")).toHaveProperty(
      "value",
      "lan@school.edu.vn",
    );
    expect(sessionStorage.getItem(CAPTURE_EMAIL_KEY)).toBeNull();
  });

  it("posts a general request without a phone and shows the summit in place", async () => {
    fetchMock.mockReturnValueOnce(reply(200, { ok: true }));
    render(<HomeContactForm />);
    fillRequired();
    submit();
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/contact");
    expect(sentBody()).toEqual({
      type: "general",
      name: "Ana Tran",
      email: "ana@gmail.com",
      phone: "",
      message: "We want a parent app.",
      website: "",
    });
    const panel = successPanel();
    expect(panel.textContent).toContain(
      "Summit reached. Thanks — we've received your message.",
    );
    expect(panel.textContent).toContain(
      "Our team will review what you shared and get in touch with you.",
    );
    expect(panel.querySelector(".summit")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(document.activeElement).toBe(panel);
    expect(document.getElementById("c-name")).toBeNull();
  });

  it("blocks the POST when the phone is 12 and focuses the phone field", () => {
    render(<HomeContactForm />);
    fillRequired();
    fill("c-phone", "12");
    submit();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(field("c-phone").getAttribute("aria-invalid")).toBe("true");
    expect(errorText("c-phone")).toBe(PHONE_ERROR);
    expect(document.activeElement).toBe(field("c-phone"));
  });

  it("sends a valid phone", async () => {
    fetchMock.mockReturnValueOnce(reply(200, { ok: true }));
    render(<HomeContactForm />);
    fillRequired();
    fill("c-phone", "(+1) 469 322 9899");
    submit();
    await settle();

    expect(sentBody().phone).toBe("(+1) 469 322 9899");
  });

  it("shows, announces and focuses the errors of an empty form", () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    render(<HomeContactForm />);
    submit();
    // The first gap comes to the middle of the screen (focusField).
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "center" });
    expect(scrollIntoView.mock.contexts[0]).toBe(field("c-name"));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(errorText("c-name")).toBe("Please enter your name.");
    expect(errorText("c-email")).toBe("Please enter a valid email address.");
    expect(errorText("c-msg")).toBe(
      "Please tell us a little about your project.",
    );
    expect(field("c-phone").hasAttribute("aria-invalid")).toBe(false);
    expect(document.activeElement).toBe(field("c-name"));
    expect(liveRegion().textContent).toContain("Please enter your name.");
  });

  it("clears a field's error when the visitor types in it", () => {
    render(<HomeContactForm />);
    submit();
    fill("c-name", "Ana");

    expect(field("c-name").hasAttribute("aria-invalid")).toBe(false);
    expect(field("c-email").getAttribute("aria-invalid")).toBe("true");
  });

  it("disables the button while sending", () => {
    fetchMock.mockReturnValueOnce(new Promise<Response>(() => {}));
    render(<HomeContactForm />);
    fillRequired();
    submit();

    const button = screen.getByRole("button", { name: /Sending\.\.\./ });
    expect(button.hasAttribute("disabled")).toBe(true);
  });

  it("shows the server's field errors", async () => {
    fetchMock.mockReturnValueOnce(
      reply(400, { errors: { phone: PHONE_ERROR } }),
    );
    render(<HomeContactForm />);
    fillRequired();
    submit();
    await settle();

    expect(errorText("c-phone")).toBe(PHONE_ERROR);
    expect(document.activeElement).toBe(field("c-phone"));
  });

  it.each([
    [
      "429",
      429,
      "You have sent several requests in a short time. Please try again in a few minutes.",
    ],
    ["500", 500, "We could not send your request. Please try again."],
  ])(
    "shows an alert on %s and puts focus on the button",
    async (_, status, text) => {
      fetchMock.mockReturnValueOnce(reply(status, { error: "x" }));
      render(<HomeContactForm />);
      fillRequired();
      submit();
      await settle();

      expect(screen.getByRole("alert").textContent).toBe(text);
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: /Start the conversation/ }),
      );
    },
  );
});

describe("HomeContactForm honeypot", () => {
  const honeypot = () => {
    const el = document.querySelector<HTMLInputElement>('[name="website"]');
    if (!el) throw new Error("missing honeypot");
    return el;
  };

  it("hides the website input from keyboard, screen readers and sight", () => {
    render(<HomeContactForm />);
    const input = honeypot();
    expect(input.getAttribute("tabindex")).toBe("-1");
    expect(input.getAttribute("aria-hidden")).toBe("true");
    expect(input.getAttribute("autocomplete")).toBe("off");
    expect(input.classList.contains("sr-only")).toBe(true);
  });

  it("sends what a bot typed into it", async () => {
    fetchMock.mockReturnValueOnce(reply(200, { ok: true }));
    render(<HomeContactForm />);
    fillRequired();
    fireEvent.change(honeypot(), { target: { value: "https://spam.example" } });
    submit();
    await settle();
    expect(sentBody().website).toBe("https://spam.example");
  });
});

describe("HomeContactForm in Vietnamese", () => {
  it("shows the required-message and phone errors in Vietnamese", () => {
    render(
      <LocaleProvider locale="vi">
        <HomeContactForm />
      </LocaleProvider>,
    );
    fill("c-phone", "12");
    fireEvent.click(screen.getByRole("button", { name: /Bắt đầu trao đổi/ }));
    expect(errorText("c-name")).toBe("Vui lòng nhập họ tên.");
    expect(errorText("c-phone")).toBe(
      "Vui lòng nhập số điện thoại hợp lệ, ví dụ (+1) 469 322 9899.",
    );
    expect(errorText("c-msg")).toBe("Vui lòng kể đôi chút về dự án của bạn.");
  });
});
