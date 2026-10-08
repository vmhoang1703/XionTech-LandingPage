import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PLACEHOLDER_HREF, webAppLinks } from "@/content/product-links";
import { productsIot, productsSxp } from "@/content/products";
import { undefinedClasses } from "@/test-utils/css-classes";
import { IotSection, SxpSection, UrlPill } from "./products-web-apps";

const SECTIONS = [
  {
    id: "sxp",
    Section: SxpSection,
    copy: productsSxp,
    surface: "surface-navy",
  },
  {
    id: "iot",
    Section: IotSection,
    copy: productsIot,
    surface: "surface-paper",
  },
] as const;

describe.each(SECTIONS)("#$id section", ({ id, Section, copy, surface }) => {
  it("keeps the anchor id and class on its surface", () => {
    const { container } = render(<Section />);
    const section = container.querySelector(`section#${id}`);
    expect(section).not.toBeNull();
    expect(section?.classList.contains("products-anchor")).toBe(true);
    expect(section?.classList.contains("sec")).toBe(true);
    expect(section?.classList.contains(surface)).toBe(true);
    expect(section?.getAttribute("aria-labelledby")).toBe(`${id}-h`);
  });

  it("shows the heading, lede and audience", () => {
    render(<Section />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.textContent).toBe(copy.title);
    expect(h2.id).toBe(`${id}-h`);
    expect(screen.getByText(copy.lede)).toBeDefined();
    for (const label of copy.audience) {
      expect(screen.getByText(label)).toBeDefined();
    }
  });

  it("shows four features, each with a name and a line", () => {
    render(<Section />);
    expect(copy.features).toHaveLength(4);
    for (const feature of copy.features) {
      expect(screen.getByText(feature.name)).toBeDefined();
      expect(screen.getByText(feature.line)).toBeDefined();
    }
  });

  it("shows the stand-in web address as a disabled label in the browser frame, not a link", () => {
    const { container } = render(<Section />);
    const link = webAppLinks[id];
    expect(link.label).toBe(`[Placeholder] ${id}.xiontechs.com`);
    expect(link.href).toBe(PLACEHOLDER_HREF);
    const pill = container.querySelector(".bar-url") as HTMLElement;
    expect(pill.tagName).toBe("SPAN");
    expect(pill.textContent).toBe(link.label);
    expect(pill.getAttribute("aria-disabled")).toBe("true");
    expect(pill.closest(".browser")).not.toBeNull();
    expect(screen.queryAllByRole("link")).toEqual([]);
  });

  it("shows the empty media frame with a placeholder caption and no image", () => {
    const { container } = render(<Section />);
    const media = container.querySelector(".browser .home-media");
    expect(media?.textContent).toBe(copy.media);
    expect(copy.media).toMatch(/^\[Placeholder\] /);
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });

  it("uses only classes that globals.css defines", () => {
    const { container } = render(<Section />);
    expect(undefinedClasses(container)).toEqual([]);
  });
});

describe("Section details", () => {
  it("adds the grid to Staff Hub", () => {
    const sxp = render(<SxpSection />).container.querySelector("#sxp");
    expect(sxp?.classList.contains("gridbg")).toBe(true);
  });

  it("puts the Staff Hub frame before its text in the markup, as PXP does, and uses the amber badge", () => {
    const { container } = render(<SxpSection />);
    const split = container.querySelector(".split-media-first");
    expect(split?.firstElementChild?.classList.contains("browser")).toBe(true);
    expect(split?.lastElementChild?.classList.contains("web-app-text")).toBe(
      true,
    );
    expect(container.querySelector(".badge.b-pxp")?.textContent).toBe("S-Hub");
  });

  it("names the IoT icon badge", () => {
    render(<IotSection />);
    expect(
      screen.getByRole("img", { name: productsIot.badgeLabel }),
    ).toBeDefined();
  });
});

describe("IoT section", () => {
  it("shows the four features as service cards with one amber and one navy", () => {
    const { container } = render(<IotSection />);
    const cards = container.querySelectorAll(".svc-grid > .svc");
    expect(cards).toHaveLength(4);
    expect(cards[1].classList.contains("feature")).toBe(true);
    expect(cards[3].classList.contains("navy")).toBe(true);
    expect(
      within(cards[0] as HTMLElement).getByRole("heading", { level: 3 })
        .textContent,
    ).toBe(productsIot.features[0].name);
  });
});

describe("Product copy", () => {
  it("uses the brand name XionTech, not XionTechs, in visible copy", () => {
    const copy = JSON.stringify([productsSxp, productsIot]);
    expect(copy).not.toMatch(/XionTechs/);
  });
});

describe("UrlPill", () => {
  it("turns a real web address into a link that opens a new tab", () => {
    render(<UrlPill href="https://lxp.example.com" label="lxp.example.com" />);
    const pill = screen.getByRole("link", {
      name: "lxp.example.com (opens in a new tab)",
    });
    expect(pill.getAttribute("href")).toBe("https://lxp.example.com");
    expect(pill.getAttribute("target")).toBe("_blank");
    expect(pill.getAttribute("rel")).toBe("noopener noreferrer");
    expect(pill.classList.contains("bar-url")).toBe(true);
  });
});
