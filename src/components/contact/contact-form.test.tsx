import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CAPTURE_EMAIL_KEY } from "./capture-storage";
import { ContactForm } from "./contact-form";

const tab = (name: string) => screen.getByRole("tab", { name });
const selected = (name: string) => tab(name).getAttribute("aria-selected");
const field = (id: string) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`missing #${id}`);
  return el;
};
const submit = () =>
  fireEvent.click(screen.getByRole("button", { name: /Send request/ }));
const liveRegion = () => {
  const el = document.querySelector('[aria-live="polite"]');
  if (!el) throw new Error("missing live region");
  return el;
};
const errorText = (id: string) => {
  const describedBy = field(id).getAttribute("aria-describedby") ?? "";
  return describedBy
    .split(" ")
    .map((ref) => document.getElementById(ref)?.textContent)
    .join(" ");
};
const fill = (id: string, value: string) =>
  fireEvent.change(field(id), { target: { value } });
const fillRequired = () => {
  fill("f-name", "Ana Tran");
  fill("f-email", "ana@gmail.com");
  fill("f-org", "Saigon School");
};
const localToday = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const SEND_ERROR = "We could not send your request. Please try again.";
const RATE_ERROR =
  "You have sent several requests in a short time. Please try again in a few minutes.";

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
const submitButton = () => screen.getByRole("button", { name: /Send|Sending/ });
const failureAlert = () => screen.getByRole("alert");
/** Wait for the fetch promise and the state updates that follow it. */
const settle = () => act(async () => {});

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  history.replaceState(null, "", "/");
});

describe("ContactForm", () => {
  it("posts the form natively, so a press before hydration never puts details in the URL", () => {
    render(<ContactForm />);
    expect(document.getElementById("demoForm")?.getAttribute("method")).toBe(
      "post",
    );
  });

  it("selects Product demo by default and links each tab to its panel", () => {
    render(<ContactForm />);
    expect(screen.getByRole("tablist").getAttribute("aria-label")).toBe(
      "Request type",
    );
    expect(selected("Product demo")).toBe("true");
    expect(selected("Outsourcing project")).toBe("false");
    for (const name of ["Product demo", "Outsourcing project"]) {
      const panel = document.getElementById(
        tab(name).getAttribute("aria-controls") ?? "",
      );
      expect(panel?.getAttribute("role")).toBe("tabpanel");
      expect(panel?.getAttribute("aria-labelledby")).toBe(tab(name).id);
    }
  });

  it("selects Outsourcing project when the page loads with #project", () => {
    history.replaceState(null, "", "/demo#project");
    render(<ContactForm />);
    expect(selected("Outsourcing project")).toBe("true");
    expect(selected("Product demo")).toBe("false");
  });

  it("follows the hash when it changes after load", () => {
    render(<ContactForm />);
    act(() => {
      history.replaceState(null, "", "/demo#project");
      globalThis.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(selected("Outsourcing project")).toBe("true");
    act(() => {
      history.replaceState(null, "", "/demo#form");
      globalThis.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(selected("Product demo")).toBe("true");
  });

  it("selects a tab on click", () => {
    render(<ContactForm />);
    fireEvent.click(tab("Outsourcing project"));
    expect(selected("Outsourcing project")).toBe("true");
  });

  it("lets a later hash change override a clicked tab", () => {
    render(<ContactForm />);
    fireEvent.click(tab("Outsourcing project"));
    act(() => {
      history.replaceState(null, "", "/demo#form");
      globalThis.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(selected("Product demo")).toBe("true");
  });

  it("leaves arrow keys with a modifier to the browser", () => {
    render(<ContactForm />);
    for (const modifier of ["altKey", "ctrlKey", "metaKey", "shiftKey"]) {
      const notPrevented = fireEvent.keyDown(tab("Product demo"), {
        key: "ArrowLeft",
        [modifier]: true,
      });
      expect(notPrevented).toBe(true);
      expect(selected("Product demo")).toBe("true");
    }
  });

  it("moves focus and selection with arrow keys, Home and End, and wraps", () => {
    render(<ContactForm />);
    expect(tab("Product demo").tabIndex).toBe(0);
    expect(tab("Outsourcing project").tabIndex).toBe(-1);

    fireEvent.keyDown(tab("Product demo"), { key: "ArrowRight" });
    expect(selected("Outsourcing project")).toBe("true");
    expect(document.activeElement).toBe(tab("Outsourcing project"));
    expect(tab("Outsourcing project").tabIndex).toBe(0);
    expect(tab("Product demo").tabIndex).toBe(-1);

    fireEvent.keyDown(tab("Outsourcing project"), { key: "ArrowRight" });
    expect(selected("Product demo")).toBe("true");
    expect(document.activeElement).toBe(tab("Product demo"));

    fireEvent.keyDown(tab("Product demo"), { key: "ArrowLeft" });
    expect(selected("Outsourcing project")).toBe("true");

    fireEvent.keyDown(tab("Outsourcing project"), { key: "Home" });
    expect(selected("Product demo")).toBe("true");

    fireEvent.keyDown(tab("Product demo"), { key: "End" });
    expect(selected("Outsourcing project")).toBe("true");

    fireEvent.keyDown(tab("Outsourcing project"), { key: "Enter" });
    expect(selected("Outsourcing project")).toBe("true");
  });

  it("shows the Product demo fields and hides the Outsourcing ones", () => {
    render(<ContactForm />);
    for (const id of ["f-name", "f-email", "f-org", "f-role", "f-msg"]) {
      expect(field(id).closest("[hidden]")).toBeNull();
    }
    expect(
      screen.getAllByRole("checkbox").map((box) => box.getAttribute("value")),
    ).toEqual(["Parent Hub", "Staff Hub", "IoT"]);
    expect(screen.getByRole("checkbox", { name: "Parent Hub" })).toHaveProperty(
      "checked",
      true,
    );
    expect(screen.getByRole("checkbox", { name: "Staff Hub" })).toHaveProperty(
      "checked",
      false,
    );
    expect(screen.getByRole("checkbox", { name: "IoT" })).toHaveProperty(
      "checked",
      false,
    );
    expect(screen.getByLabelText("Your role")).toBe(field("f-role"));
    expect(screen.getByRole("combobox", { name: "School size" })).toBeTruthy();
    expect(screen.queryByRole("combobox", { name: "Service" })).toBeNull();
    expect(
      screen.queryByRole("combobox", { name: "When do you want to start?" }),
    ).toBeNull();
    expect(field("f-svc").closest("[hidden]")).not.toBeNull();
    expect(field("f-when").closest("[hidden]")).not.toBeNull();
  });

  it("hides the Product demo fields on the Outsourcing tab", () => {
    history.replaceState(null, "", "/demo#project");
    render(<ContactForm />);
    for (const id of ["f-size", "f-date"]) {
      expect(field(id).closest("[hidden]")).not.toBeNull();
    }
    expect(screen.queryByRole("checkbox", { name: "Parent Hub" })).toBeNull();
    const service = screen.getByRole("combobox", { name: "Service" });
    expect(service.querySelectorAll("option")).toHaveLength(9);
    expect(
      screen.getByRole("combobox", { name: "When do you want to start?" }),
    ).toBeTruthy();
  });

  it("sets today as the earliest preferred date after mount", () => {
    render(<ContactForm />);
    expect(field("f-date").getAttribute("min")).toBe(localToday());
  });

  it("marks the three required fields on an empty submit, announces them and focuses Full name", () => {
    render(<ContactForm />);
    submit();

    expect(field("f-name").getAttribute("aria-invalid")).toBe("true");
    expect(field("f-email").getAttribute("aria-invalid")).toBe("true");
    expect(field("f-org").getAttribute("aria-invalid")).toBe("true");
    expect(field("f-msg").hasAttribute("aria-invalid")).toBe(false);
    expect(errorText("f-name")).toBe("Please enter your name.");
    expect(errorText("f-email")).toBe("Please enter a valid email address.");
    expect(errorText("f-org")).toBe("Please enter your organisation.");

    const announced = liveRegion().textContent ?? "";
    expect(announced).toContain("Please fix the following:");
    expect(announced).toContain("Please enter your name.");
    expect(announced).toContain("Please enter a valid email address.");
    expect(announced).toContain("Please enter your organisation.");

    expect(document.activeElement).toBe(field("f-name"));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the role help linked to the role field", () => {
    render(<ContactForm />);
    expect(errorText("f-role")).toBe("For example: Principal, Head of IT");
  });

  it("rejects an email without a full domain", () => {
    render(<ContactForm />);
    fillRequired();
    fill("f-email", "ana@school");
    submit();
    expect(errorText("f-email")).toBe("Please enter a valid email address.");
    expect(document.activeElement).toBe(field("f-email"));
  });

  it("rejects a preferred date in the past", () => {
    render(<ContactForm />);
    fillRequired();
    fill("f-date", "2000-01-01");
    submit();
    expect(field("f-date").getAttribute("aria-invalid")).toBe("true");
    expect(errorText("f-date")).toBe("Please choose today or a later date.");
    expect(document.activeElement).toBe(field("f-date"));
  });

  it("rejects a message over 2,000 characters", () => {
    render(<ContactForm />);
    fillRequired();
    fill("f-msg", "a".repeat(2001));
    submit();
    expect(field("f-msg").getAttribute("aria-invalid")).toBe("true");
    expect(errorText("f-msg")).toBe(
      "Please keep your message under 2,000 characters.",
    );
    expect(liveRegion().textContent).toContain(
      "Please keep your message under 2,000 characters.",
    );
  });

  it("clears a field's error when the visitor types in it", () => {
    render(<ContactForm />);
    submit();
    fill("f-name", "A");
    expect(field("f-name").hasAttribute("aria-invalid")).toBe(false);
    expect(field("f-name").hasAttribute("aria-describedby")).toBe(false);
    expect(field("f-email").getAttribute("aria-invalid")).toBe("true");
  });

  it("drops the hidden tab's errors and the announcement on a tab switch", () => {
    render(<ContactForm />);
    fillRequired();
    fill("f-date", "2000-01-01");
    submit();
    expect(field("f-date").getAttribute("aria-invalid")).toBe("true");
    fireEvent.click(tab("Outsourcing project"));
    expect(liveRegion().textContent).toBe("");
    fireEvent.click(tab("Product demo"));
    expect(field("f-date").hasAttribute("aria-invalid")).toBe(false);
    expect(field("f-date").hasAttribute("aria-describedby")).toBe(false);
    expect(document.getElementById("f-date-err")).toBeNull();
  });

  it("does not validate a past date on the hidden Product demo tab", async () => {
    fetchMock.mockReturnValue(pendingFetch());
    render(<ContactForm />);
    fill("f-date", "2000-01-01");
    fireEvent.click(tab("Outsourcing project"));
    fillRequired();
    submit();
    await settle();
    expect(field("f-date").hasAttribute("aria-invalid")).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentBody()).toEqual({
      type: "project",
      name: "Ana Tran",
      email: "ana@gmail.com",
      org: "Saigon School",
      role: "",
      message: "",
      service: "Product Engineering",
      startTiming: "As soon as possible",
      website: "",
    });
  });

  it("posts the trimmed Product demo values as JSON on a valid submit", async () => {
    fetchMock.mockReturnValue(pendingFetch());
    render(<ContactForm />);
    fill("f-name", "  Ana Tran ");
    fill("f-email", " ana@gmail.com ");
    fill("f-org", "Saigon School  ");
    fill("f-role", "Principal");
    fireEvent.click(screen.getByRole("checkbox", { name: "Staff Hub" }));
    fill("f-date", localToday());
    fill("f-msg", "Hello");
    submit();
    await settle();
    expect(liveRegion().textContent).toBe("");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(sentBody()).toEqual({
      type: "demo",
      name: "Ana Tran",
      email: "ana@gmail.com",
      org: "Saigon School",
      role: "Principal",
      message: "Hello",
      products: ["Parent Hub", "Staff Hub"],
      schoolSize: "Under 500 students",
      date: localToday(),
      website: "",
    });
  });

  it("renders the submit button and the consent line with the privacy link", () => {
    render(<ContactForm />);
    expect(
      screen.getByRole("button", { name: /Send request/ }).getAttribute("type"),
    ).toBe("submit");
    expect(
      screen.getByText("We only use your details to respond to this request."),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Privacy policy" }).getAttribute("href"),
    ).toBe("/privacy");
  });

  it("limits name, work email, school and role to the server lengths", () => {
    render(<ContactForm />);
    expect(field("f-name").getAttribute("maxlength")).toBe("200");
    expect(field("f-email").getAttribute("maxlength")).toBe("254");
    expect(field("f-org").getAttribute("maxlength")).toBe("200");
    expect(field("f-role").getAttribute("maxlength")).toBe("200");
  });
});

describe("ContactForm honeypot", () => {
  const honeypot = () => {
    const el = document.querySelector<HTMLInputElement>('[name="website"]');
    if (!el) throw new Error("missing honeypot");
    return el;
  };

  it("hides the website input from keyboard, screen readers and sight", () => {
    render(<ContactForm />);
    const input = honeypot();
    expect(input.getAttribute("tabindex")).toBe("-1");
    expect(input.getAttribute("aria-hidden")).toBe("true");
    expect(input.getAttribute("autocomplete")).toBe("off");
    expect(input.classList.contains("sr-only")).toBe(true);
    expect(input.closest("[hidden]")).toBeNull();
  });

  it("sends what a bot typed into it", async () => {
    fetchMock.mockReturnValue(pendingFetch());
    render(<ContactForm />);
    fillRequired();
    fireEvent.change(honeypot(), { target: { value: "https://spam.example" } });
    submit();
    await settle();
    expect(sentBody().website).toBe("https://spam.example");
  });
});

describe("ContactForm sending", () => {
  it("disables the button and reads Sending... while the request is open", async () => {
    fetchMock.mockReturnValue(pendingFetch());
    render(<ContactForm />);
    fillRequired();
    submit();
    await settle();
    const button = submitButton();
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.textContent).toBe("Sending...");
    expect(button.querySelector("svg")).not.toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("replaces the form with the thank-you panel on 200", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    render(<ContactForm />);
    fillRequired();
    submit();
    await settle();
    const panel = screen.getByRole("status");
    expect(panel.textContent).toContain("Thank you!");
    expect(panel.textContent).toContain("We will be in touch soon.");
    expect(panel.textContent).not.toContain("Prototype");
    expect(panel.querySelector("svg")).not.toBeNull();
    expect(document.getElementById("demoForm")).toBeNull();
    expect(screen.queryByRole("button", { name: /Send/ })).toBeNull();
    expect(screen.queryByRole("tablist")).toBeNull();
  });

  it("shows server field errors inline, announces them and focuses the first", async () => {
    fetchMock.mockReturnValue(
      reply(400, {
        errors: {
          email: "Please enter a valid email address.",
          message: "Please keep your message under 2,000 characters.",
        },
      }),
    );
    render(<ContactForm />);
    fillRequired();
    submit();
    await settle();

    expect(field("f-email").getAttribute("aria-invalid")).toBe("true");
    expect(errorText("f-email")).toBe("Please enter a valid email address.");
    expect(field("f-email").closest(".field")?.classList.contains("bad")).toBe(
      true,
    );
    expect(field("f-msg").getAttribute("aria-invalid")).toBe("true");
    expect(errorText("f-msg")).toBe(
      "Please keep your message under 2,000 characters.",
    );
    expect(field("f-name").hasAttribute("aria-invalid")).toBe(false);
    expect(liveRegion().textContent).toContain("Please fix the following:");
    expect(liveRegion().textContent).toContain(
      "Please enter a valid email address.",
    );
    expect(document.activeElement).toBe(field("f-email"));
    expect(field("f-name")).toHaveProperty("value", "Ana Tran");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(submitButton().hasAttribute("disabled")).toBe(false);
    expect(submitButton().textContent).toBe("Send request");
  });

  it.each([
    ["429 rate limit", () => reply(429, { error: "rate" }), RATE_ERROR],
    ["500 not configured", () => reply(500, { error: "send" }), SEND_ERROR],
    ["502 mail failed", () => reply(502, { error: "send" }), SEND_ERROR],
    ["400 bad body", () => reply(400, { error: "send" }), SEND_ERROR],
    [
      "400 with no known field",
      () => reply(400, { errors: { colour: "red", name: "" } }),
      SEND_ERROR,
    ],
    ["400 with a null body", () => reply(400, null), SEND_ERROR],
    [
      "400 that is not JSON",
      () => Promise.resolve(new Response("oops", { status: 400 })),
      SEND_ERROR,
    ],
    [
      "a network error",
      () => Promise.reject(new TypeError("offline")),
      SEND_ERROR,
    ],
  ])(
    "keeps every value and shows the message above the button on %s",
    async (_name, answer, message) => {
      fetchMock.mockImplementation(answer);
      render(<ContactForm />);
      fillRequired();
      fill("f-role", "Principal");
      fill("f-msg", "Hello");
      submit();
      await settle();

      expect(failureAlert().textContent).toBe(message);
      expect(
        failureAlert().compareDocumentPosition(submitButton()) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(field("f-name")).toHaveProperty("value", "Ana Tran");
      expect(field("f-email")).toHaveProperty("value", "ana@gmail.com");
      expect(field("f-org")).toHaveProperty("value", "Saigon School");
      expect(field("f-role")).toHaveProperty("value", "Principal");
      expect(field("f-msg")).toHaveProperty("value", "Hello");
      expect(submitButton().hasAttribute("disabled")).toBe(false);
      expect(submitButton().textContent).toBe("Send request");
      expect(screen.queryByRole("status")).toBeNull();
      expect(liveRegion().textContent).toBe("");
    },
  );

  it("gives up after 15 seconds, keeps the values and shows the send error", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    render(<ContactForm />);
    fillRequired();
    submit();
    await settle();
    await act(async () => {
      vi.advanceTimersByTime(14_999);
    });
    expect(submitButton().textContent).toBe("Sending...");
    expect(screen.queryByRole("alert")).toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(failureAlert().textContent).toBe(SEND_ERROR);
    expect(field("f-name")).toHaveProperty("value", "Ana Tran");
    expect(submitButton().textContent).toBe("Send request");
    expect(submitButton().hasAttribute("disabled")).toBe(false);
  });

  it("does not abort a request that was answered in time", async () => {
    vi.useFakeTimers();
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    render(<ContactForm />);
    fillRequired();
    submit();
    await settle();
    expect(screen.getByRole("status")).toBeTruthy();
    const { signal } = fetchMock.mock.calls[0][1];
    await act(async () => {
      vi.advanceTimersByTime(20_000);
    });
    expect(signal.aborted).toBe(false);
  });

  it("moves focus to the thank-you panel after a 200", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    render(<ContactForm />);
    fillRequired();
    submitButton().focus();
    submit();
    await settle();
    const panel = screen.getByRole("status");
    expect(panel.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(panel);
  });

  it("returns focus to the submit button after a failed send", async () => {
    fetchMock.mockReturnValue(reply(502, { error: "send" }));
    render(<ContactForm />);
    fillRequired();
    field("f-org").focus();
    submit();
    await settle();
    expect(failureAlert().textContent).toBe(SEND_ERROR);
    expect(document.activeElement).toBe(submitButton());
  });

  it("clears the failure message and sends again on retry", async () => {
    fetchMock.mockReturnValueOnce(reply(502, { error: "send" }));
    render(<ContactForm />);
    fillRequired();
    submit();
    await settle();
    expect(failureAlert().textContent).toBe(SEND_ERROR);

    fetchMock.mockReturnValueOnce(pendingFetch());
    submit();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(submitButton().textContent).toBe("Sending...");
    await settle();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("clears the failure message when a retry has client errors", async () => {
    fetchMock.mockReturnValueOnce(reply(429, { error: "rate" }));
    render(<ContactForm />);
    fillRequired();
    submit();
    await settle();
    expect(failureAlert().textContent).toBe(RATE_ERROR);

    fill("f-email", "ana@school");
    submit();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(document.activeElement).toBe(field("f-email"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("ContactForm capture prefill", () => {
  const scrollIntoView = vi.fn();
  beforeEach(() => {
    scrollIntoView.mockReset();
    Element.prototype.scrollIntoView = scrollIntoView;
    sessionStorage.clear();
  });
  afterEach(() => {
    sessionStorage.clear();
  });

  it("fills an empty Work email from the stored capture and removes the key", () => {
    sessionStorage.setItem(CAPTURE_EMAIL_KEY, "lan@school.edu.vn");
    render(<ContactForm />);
    expect((field("f-email") as HTMLInputElement).value).toBe(
      "lan@school.edu.vn",
    );
    expect(sessionStorage.getItem(CAPTURE_EMAIL_KEY)).toBeNull();
  });

  it("keeps a value the visitor typed before the prefill and still removes the key", () => {
    sessionStorage.setItem(CAPTURE_EMAIL_KEY, "lan@school.edu.vn");
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    getItem.mockImplementation(() => {
      // The visitor typed in the moment before the effect read the key.
      (document.getElementById("f-email") as HTMLInputElement).value =
        "typed@x.com";
      return "lan@school.edu.vn";
    });
    render(<ContactForm />);
    getItem.mockRestore();
    expect((field("f-email") as HTMLInputElement).value).toBe("typed@x.com");
    expect(sessionStorage.getItem(CAPTURE_EMAIL_KEY)).toBeNull();
  });

  it("leaves the field empty when nothing is stored", () => {
    render(<ContactForm />);
    expect((field("f-email") as HTMLInputElement).value).toBe("");
  });

  it("stays silent when storage throws", () => {
    const blocked = () => {
      throw new DOMException("blocked", "SecurityError");
    };
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(blocked);
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(blocked);
    expect(() => render(<ContactForm />)).not.toThrow();
    expect((field("f-email") as HTMLInputElement).value).toBe("");
    vi.restoreAllMocks();
  });

  it("scrolls the form into view for #project only", () => {
    const { unmount } = render(
      <div id="form">
        <ContactForm />
      </div>,
    );
    expect(scrollIntoView).not.toHaveBeenCalled();
    unmount();
    history.replaceState(null, "", "/demo#project");
    render(
      <div id="form">
        <ContactForm />
      </div>,
    );
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.contexts[0]).toBe(field("form"));
  });
});
