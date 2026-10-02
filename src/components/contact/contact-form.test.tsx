import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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

afterEach(() => {
  history.replaceState(null, "", "/");
});

describe("ContactForm", () => {
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
    expect(screen.getByRole("checkbox", { name: "PXP" })).toHaveProperty(
      "checked",
      true,
    );
    expect(screen.getByRole("checkbox", { name: "IoT" })).toHaveProperty(
      "checked",
      false,
    );
    expect(screen.getByRole("combobox", { name: "School size" })).toBeTruthy();
    expect(screen.queryByRole("combobox", { name: "Service" })).toBeNull();
    expect(screen.queryByRole("combobox", { name: "Start timing" })).toBeNull();
    expect(field("f-svc").closest("[hidden]")).not.toBeNull();
    expect(field("f-when").closest("[hidden]")).not.toBeNull();
  });

  it("hides the Product demo fields on the Outsourcing tab", () => {
    history.replaceState(null, "", "/demo#project");
    render(<ContactForm />);
    for (const id of ["f-size", "f-date"]) {
      expect(field(id).closest("[hidden]")).not.toBeNull();
    }
    expect(screen.queryByRole("checkbox", { name: "PXP" })).toBeNull();
    const service = screen.getByRole("combobox", { name: "Service" });
    expect(service.querySelectorAll("option")).toHaveLength(9);
    expect(screen.getByRole("combobox", { name: "Start timing" })).toBeTruthy();
  });

  it("sets today as the earliest preferred date after mount", () => {
    render(<ContactForm />);
    expect(field("f-date").getAttribute("min")).toBe(localToday());
  });

  it("marks the three required fields on an empty submit, announces them and focuses Full name", () => {
    const onValidSubmit = vi.fn();
    render(<ContactForm onValidSubmit={onValidSubmit} />);
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
    expect(onValidSubmit).not.toHaveBeenCalled();
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

  it("does not validate a past date on the hidden Product demo tab", () => {
    const onValidSubmit = vi.fn();
    render(<ContactForm onValidSubmit={onValidSubmit} />);
    fill("f-date", "2000-01-01");
    fireEvent.click(tab("Outsourcing project"));
    fillRequired();
    submit();
    expect(field("f-date").hasAttribute("aria-invalid")).toBe(false);
    expect(onValidSubmit).toHaveBeenCalledTimes(1);
    expect(onValidSubmit.mock.calls[0][0]).toEqual({
      type: "project",
      name: "Ana Tran",
      email: "ana@gmail.com",
      org: "Saigon School",
      role: "",
      message: "",
      service: "Product Engineering",
      startTiming: "As soon as possible",
    });
  });

  it("hands the Product demo values to onValidSubmit on a valid submit", () => {
    const onValidSubmit = vi.fn();
    render(<ContactForm onValidSubmit={onValidSubmit} />);
    fillRequired();
    fill("f-role", "Principal");
    fireEvent.click(screen.getByRole("checkbox", { name: "LXP" }));
    fill("f-date", localToday());
    fill("f-msg", "Hello");
    submit();
    expect(liveRegion().textContent).toBe("");
    expect(onValidSubmit).toHaveBeenCalledWith({
      type: "demo",
      name: "Ana Tran",
      email: "ana@gmail.com",
      org: "Saigon School",
      role: "Principal",
      message: "Hello",
      products: ["PXP", "LXP"],
      schoolSize: "Under 500 students",
      date: localToday(),
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
});
