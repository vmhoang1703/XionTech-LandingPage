import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONTACT_STRINGS } from "@/components/contact/contact-strings";
import { offices } from "@/content/offices";
import DemoPage, { metadata } from "./page";

// jsdom has no canvas: HeroArt skips the ribbon, the aurora is CSS.
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Demo page", () => {
  it("renders the H1 with the highlighted word", () => {
    render(<DemoPage />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe(
      "Let's talk about your school or your project.",
    );
    expect(h1.querySelector(".hl")?.textContent).toBe("school");
  });

  it("renders the breadcrumbs", () => {
    render(<DemoPage />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.textContent).toBe("Home/Contact");
    expect(
      screen.getByRole("link", { name: "Home" }).getAttribute("href"),
    ).toBe("/");
  });

  it("renders the three reassurance items", () => {
    render(<DemoPage />);
    for (const item of CONTACT_STRINGS.hero.items) {
      expect(screen.getByText(item)).toBeDefined();
    }
  });

  it("renders both offices with their contact links", () => {
    render(<DemoPage />);
    for (const office of offices) {
      expect(screen.getByText(office.name)).toBeDefined();
    }
    expect(screen.getByText("Vietnam Delivery Center")).toBeDefined();
    const whatsapp = screen.getByRole("link", {
      name: "WhatsApp +1 469 439 9345 (opens in a new tab)",
    });
    expect(whatsapp.getAttribute("href")).toBe("https://wa.me/14694399345");
    expect(whatsapp.getAttribute("target")).toBe("_blank");
    expect(whatsapp.getAttribute("rel")).toBe("noopener noreferrer");
    expect(
      screen
        .getByRole("link", { name: "+84 908 107 552" })
        .getAttribute("href"),
    ).toBe("tel:+84908107552");
    expect(
      screen
        .getByRole("link", { name: "vinni.tran@newxion.com" })
        .getAttribute("href"),
    ).toBe("mailto:vinni.tran@newxion.com");
  });

  it("renders every contact of every office, in order, with its href and name", () => {
    const { container } = render(<DemoPage />);
    const blocks = container.querySelectorAll("address.office");
    expect(blocks).toHaveLength(offices.length);
    offices.forEach((office, officeIndex) => {
      const links = blocks[officeIndex].querySelectorAll("a");
      expect(links).toHaveLength(office.contacts.length);
      office.contacts.forEach((contact, contactIndex) => {
        const link = links[contactIndex];
        expect(link.getAttribute("href")).toBe(contact.href);
        expect(link.textContent).toBe(contact.label);
        expect(link.getAttribute("aria-label")).toBe(contact.ariaLabel ?? null);
      });
    });
  });

  it("renders the form once inside the form card", () => {
    const { container } = render(<DemoPage />);
    const card = container.querySelector("#form.form-card");
    expect(card).not.toBeNull();
    expect(
      screen.getAllByRole("heading", { name: "What can we help with?" }),
    ).toHaveLength(1);
    expect(card?.querySelector("button[type=submit]")?.textContent).toContain(
      "Send request",
    );
  });

  it("does not render a main element", () => {
    const { container } = render(<DemoPage />);
    expect(container.querySelector("main")).toBeNull();
  });

  it("sets the metadata title and description", () => {
    expect(metadata.title).toBe(CONTACT_STRINGS.metaTitle);
    expect(metadata.description).toBe(CONTACT_STRINGS.metaDescription);
  });

  it("puts the shared aurora and strand ribbon behind the navy hero", () => {
    const { container } = render(<DemoPage />);

    const hero = container.querySelector("section.hero-navy.page-hero");
    expect(hero).not.toBeNull();
    const [aurora, canvas] = Array.from(hero?.children ?? []);
    expect(aurora.classList.contains("aurora")).toBe(true);
    expect(canvas.matches("canvas.strands")).toBe(true);
    expect(aurora.getAttribute("aria-hidden")).toBe("true");
    expect(canvas.getAttribute("aria-hidden")).toBe("true");
  });
});
