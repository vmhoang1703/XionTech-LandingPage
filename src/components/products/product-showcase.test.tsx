import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FEATURE_PLACEHOLDER } from "@/content/products";
import { ProductLink } from "./product-detail";
import { ProductShowcase } from "./product-showcase";

// jsdom has no showModal or close: stand-ins that set `open` and fire
// "close" like the browser does.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function card(id: string) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`No card ${id}`);
  return el;
}

function dialogOf(id: string) {
  const dialog = card(id).querySelector("dialog");
  if (!dialog) throw new Error(`No dialog in ${id}`);
  return dialog;
}

function openCard(id: string, name: string) {
  const button = within(card(id)).getByRole("button", {
    name: `Open ${name} details`,
  });
  fireEvent.click(button);
  return { button, dialog: dialogOf(id) };
}

function stubRect(dialog: HTMLDialogElement) {
  vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({
    left: 100,
    top: 100,
    right: 500,
    bottom: 400,
    width: 400,
    height: 300,
    x: 100,
    y: 100,
    toJSON: () => ({}),
  });
}

describe("ProductShowcase", () => {
  it("renders What we build. and four cards in apps.ts order with their ids", () => {
    const { container } = render(<ProductShowcase />);
    expect(
      screen.getByRole("heading", { level: 2, name: "What we build." }),
    ).toBeDefined();
    const ids = [...container.querySelectorAll("article.pshow")].map(
      (a) => a.id,
    );
    expect(ids).toEqual(["pxp", "sxp", "iot", "ai-tutor"]);
  });

  it("gives each card its badge, full name, tagline H3 and a 44px expand button for a dialog", () => {
    render(<ProductShowcase />);
    const iot = card("iot");
    expect(iot.querySelector(".ps-name")?.textContent).toBe(
      "IoT Device Management",
    );
    expect(within(iot).getByRole("heading", { level: 3 }).textContent).toBe(
      "Run classroom devices, lighting, climate and access from one screen.",
    );
    expect(card("pxp").querySelector(".badge")?.textContent).toBe("P-Hub");
    expect(iot.querySelector(".badge svg")).not.toBeNull();
    const expand = within(iot).getByRole("button", {
      name: "Open IoT Device Management details",
    });
    expect(expand.getAttribute("aria-haspopup")).toBe("dialog");
    expect(expand.classList.contains("pc-expand")).toBe(true);
  });

  it("shows a phone for Parent Hub and a browser frame for the others", () => {
    render(<ProductShowcase />);
    expect(card("pxp").querySelector(".ps-visual .pm-phone")).not.toBeNull();
    for (const id of ["sxp", "iot", "ai-tutor"]) {
      expect(card(id).querySelector(".ps-visual .browser")).not.toBeNull();
    }
    expect(
      within(card("ai-tutor")).getAllByText(
        "[Placeholder] AI Tutor prototype address",
      ).length,
    ).toBeGreaterThan(0);
    expect(document.body.innerHTML).not.toContain("xt-ai-tutor-demo");
  });

  it("opens the detail dialog with the name, tagline, Made for, and placeholder features", () => {
    render(<ProductShowcase />);
    const { dialog } = openCard("sxp", "Staff Hub");
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    expect(dialog.hasAttribute("open")).toBe(true);
    const named = within(dialog).getByRole("heading", { level: 2 });
    expect(named.textContent).toBe("Staff Hub");
    expect(dialog.getAttribute("aria-labelledby")).toBe(named.id);
    expect(dialog.textContent).toContain("Made for");
    expect(dialog.textContent).toContain("Staff, teachers and school leaders");
    const items = dialog.querySelectorAll(".pd-feats li");
    expect(items).toHaveLength(4);
    expect(items[0].querySelector("h4")?.textContent).toBe(
      "Attendance and records in real time",
    );
    for (const li of items) {
      expect(li.querySelector("p")?.textContent).toBe(FEATURE_PLACEHOLDER);
    }
  });

  it("closes with the X button and puts focus back on the expand button", () => {
    render(<ProductShowcase />);
    const { button, dialog } = openCard("iot", "IoT Device Management");
    fireEvent.click(
      within(dialog).getByRole("button", {
        name: "Close IoT Device Management details",
      }),
    );
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(document.activeElement).toBe(button);
  });

  it("puts focus back after Esc (the browser fires close)", () => {
    render(<ProductShowcase />);
    const { button, dialog } = openCard("pxp", "Parent Hub");
    dialog.removeAttribute("open");
    dialog.dispatchEvent(new Event("close"));
    expect(document.activeElement).toBe(button);
  });

  it("closes on a click on the backdrop, not on a click inside the box", () => {
    render(<ProductShowcase />);
    const { dialog } = openCard("ai-tutor", "AI Tutor");
    stubRect(dialog);

    fireEvent.click(dialog, { clientX: 300, clientY: 200 });
    expect(dialog.hasAttribute("open")).toBe(true);
    fireEvent.click(within(dialog).getByRole("heading", { level: 2 }), {
      clientX: 600,
      clientY: 50,
    });
    expect(dialog.hasAttribute("open")).toBe(true);

    fireEvent.click(dialog, { clientX: 20, clientY: 20 });
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("shows stand-in addresses as disabled labels, never links", () => {
    render(<ProductShowcase />);
    const pxp = dialogOf("pxp");
    const stores = pxp.querySelectorAll(".store-btn");
    expect(stores).toHaveLength(2);
    for (const store of stores) {
      expect(store.tagName).toBe("SPAN");
      expect(store.getAttribute("aria-disabled")).toBe("true");
      expect(store.textContent).toMatch(/^\[Placeholder\]/);
    }
    for (const id of ["sxp", "iot", "ai-tutor"]) {
      const view = dialogOf(id).querySelector(".btn");
      expect(view?.tagName).toBe("SPAN");
      expect(view?.getAttribute("aria-disabled")).toBe("true");
      expect(view?.textContent).toBe("[Placeholder] View prototype");
    }
    expect(document.querySelectorAll(".pdetail a[href]")).toHaveLength(0);
  });

  it("keeps the features on the page without JavaScript, in a details fallback", () => {
    render(<ProductShowcase />);
    const fallback = card("ai-tutor").querySelector("details.pd-nojs");
    expect(fallback?.querySelector("summary")?.textContent).toBe("Features");
    expect(fallback?.querySelectorAll("li")).toHaveLength(3);
  });
});

describe("ProductLink", () => {
  it("renders a real address as a new-tab link that says so", () => {
    render(
      <ProductLink href="https://example.com/app" className="btn btn-navy">
        View prototype
      </ProductLink>,
    );
    const link = screen.getByRole("link", {
      name: "View prototype (opens in a new tab)",
    });
    expect(link.getAttribute("href")).toBe("https://example.com/app");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
