import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/layout/locale-link";
import {
  careersGeneralApplication,
  careersGeneralApplicationVi,
} from "@/content/careers";
import { GeneralApplication } from "./general-application";

const fetchMock = vi.fn();
const reply = (status: number, body: unknown) =>
  Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
const settle = () => act(async () => {});

function renderForm(locale: "en" | "vi" = "en") {
  render(
    <LocaleProvider locale={locale}>
      <GeneralApplication
        copy={
          locale === "en"
            ? careersGeneralApplication
            : careersGeneralApplicationVi
        }
      />
    </LocaleProvider>,
  );
}
const email = () => screen.getByLabelText("Email address");
const send = () =>
  fireEvent.click(screen.getByRole("button", { name: "Send" }));

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("GeneralApplication", () => {
  it("shows the heading, the line and an email-only form", () => {
    renderForm();
    expect(
      screen.getByRole("heading", { name: "Don’t see a role that fits?" }),
    ).toBeDefined();
    expect(
      screen.getByText(
        "Leave your email and we’ll be in touch when something opens up.",
      ),
    ).toBeDefined();
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });

  it("shows the email error inline, focuses the field and sends nothing", () => {
    renderForm();
    fireEvent.change(email(), { target: { value: "nope" } });
    send();

    expect(email().getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById("ga-email-err")?.textContent).toBe(
      "Please enter a valid email address.",
    );
    expect(document.activeElement).toBe(email());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts one general-application with the honeypot and shows the thanks", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    renderForm();
    fireEvent.change(email(), { target: { value: " ana@gmail.com " } });
    send();
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/contact");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      type: "general-application",
      email: "ana@gmail.com",
      website: "",
    });
    const ok = screen.getByText("Thanks, we’ll be in touch.");
    expect(document.activeElement).toBe(ok);
  });

  it("shows the rate message and keeps the email", async () => {
    fetchMock.mockReturnValue(reply(429, { error: "rate" }));
    renderForm();
    fireEvent.change(email(), { target: { value: "ana@gmail.com" } });
    send();
    await settle();

    expect(screen.getByRole("alert").textContent).toMatch(/several requests/i);
    expect((email() as HTMLInputElement).value).toBe("ana@gmail.com");
  });

  it("uses Vietnamese strings and errors on vi", () => {
    renderForm("vi");
    fireEvent.change(screen.getByLabelText("Địa chỉ email"), {
      target: { value: "x" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Gửi" }));
    expect(document.getElementById("ga-email-err")?.textContent).toBe(
      "Vui lòng nhập email hợp lệ.",
    );
  });
});
