import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { webAppLinks } from "@/content/product-links";
import { productsIot, productsLxp, productsSxp } from "@/content/products";
import { undefinedClasses } from "@/test-utils/css-classes";
import { IotSection, LxpSection, SxpSection } from "./products-web-apps";

const SECTIONS = [
  {
    id: "lxp",
    Section: LxpSection,
    copy: productsLxp,
    surface: "surface-mist",
  },
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

  it("has a browser frame whose URL pill opens a new tab", () => {
    render(<Section />);
    const link = webAppLinks[id];
    expect(link.label).toBe(`[Placeholder] ${id}.xiontechs.com`);
    const pill = screen.getByRole("link", {
      name: `${link.label} (opens in a new tab)`,
    });
    expect(pill.textContent).toBe(link.label);
    expect(pill.getAttribute("href")).toBe(link.href);
    expect(pill.getAttribute("target")).toBe("_blank");
    expect(pill.getAttribute("rel")).toBe("noopener noreferrer");
    expect(pill.classList.contains("bar-url")).toBe(true);
    expect(pill.closest(".browser")).not.toBeNull();
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
  it("adds the linen texture to LXP and the grid to SXP", () => {
    const lxp = render(<LxpSection />).container.querySelector("#lxp");
    const sxp = render(<SxpSection />).container.querySelector("#sxp");
    expect(lxp?.classList.contains("linen")).toBe(true);
    expect(sxp?.classList.contains("gridbg")).toBe(true);
  });

  it("puts the SXP text before its frame and uses the amber badge", () => {
    const { container } = render(<SxpSection />);
    const split = container.querySelector(".split-media-first");
    expect(split?.firstElementChild?.classList.contains("web-app-text")).toBe(
      true,
    );
    expect(split?.lastElementChild?.classList.contains("browser")).toBe(true);
    expect(container.querySelector(".badge.b-pxp")?.textContent).toBe("SXP");
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
    const copy = JSON.stringify([productsLxp, productsSxp, productsIot]);
    expect(copy).not.toMatch(/XionTechs/);
  });
});
