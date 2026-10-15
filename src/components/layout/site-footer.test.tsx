import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

function renderFooter() {
  render(<SiteFooter locale="en" />);
  return screen.getByRole("contentinfo");
}

function linkHrefs(container: HTMLElement) {
  return within(container)
    .getAllByRole("link")
    .map((link) => link.getAttribute("href"));
}

function column(heading: string) {
  const footer = renderFooter();
  const title = within(footer).getByRole("heading", { name: heading });
  const section = title.parentElement;
  if (!section) throw new Error(`No column for ${heading}`);
  return section;
}

describe("SiteFooter", () => {
  it("shows the logo linking home and the blurb", () => {
    const footer = renderFooter();

    const logo = within(footer).getByRole("img", { name: "XionTech" });
    expect(logo.closest("a")?.getAttribute("href")).toBe("/en");
    expect(
      within(footer).getByText(
        "XionTech builds AI-powered products and custom solutions, combining real-world expertise with modern technology to solve business challenges.",
      ),
    ).toBeDefined();
  });

  it("lists the four products by name and hides Product updates on Demo day", () => {
    const products = column("Products");

    expect(
      within(products)
        .getAllByRole("link")
        .map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["Parent Hub", "/en/products#pxp"],
      ["Staff Hub", "/en/products#sxp"],
      ["AI Tutor", "/en/products#ai-tutor"],
    ]);
    expect(
      linkHrefs(screen.getByRole("contentinfo")).some((href) =>
        href?.includes("#updates"),
      ),
    ).toBe(false);
  });

  it("lists five services, How we work and All services", () => {
    const services = column("Services");

    expect(linkHrefs(services)).toEqual([
      "/en/services#product-engineering",
      "/en/services#ai-analytics",
      "/en/services#staffing",
      "/en/services#low-code",
      "/en/services#cloud",
      "/en/services#process",
      "/en/services",
    ]);
    expect(
      within(services).getByRole("link", { name: "All services" }),
    ).toBeDefined();
  });

  it("lists the company links", () => {
    const company = within(column("Company")).getAllByRole("link");

    expect(
      company.map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["News", "/en/news"],
      ["About us", "/en/about"],
      ["Careers", "/en/careers"],
    ]);
  });

  it("matches the About location cards, Plano first", () => {
    const offices = column("Offices");
    const [us, vietnam] = Array.from(offices.querySelectorAll("address"));

    expect(
      Array.from(offices.querySelectorAll("address small")).map(
        (tag) => tag.textContent,
      ),
    ).toEqual(["US Delivery Center", "Vietnam Delivery Center"]);
    expect(
      Array.from(offices.querySelectorAll("address b")).map(
        (heading) => heading.textContent,
      ),
    ).toEqual(["Plano, Texas", "Ho Chi Minh City"]);
    expect(us.textContent).toContain(
      "7950 Legacy Drive, Suite 400Plano, Texas 75024, USA",
    );
    expect(vietnam.textContent).toContain(
      "Floor 15, B1 Building, 279 Nguyen Tri Phuong StreetDien Hong Ward, Ho Chi Minh City, Vietnam",
    );
    expect(
      within(us)
        .getAllByRole("link")
        .map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["+1 (469) 322-9899", "tel:+14693229899"],
      ["vinni.tran@newxion.com", "mailto:vinni.tran@newxion.com"],
    ]);
    expect(
      within(vietnam)
        .getAllByRole("link")
        .map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["+84 908 107 552", "tel:+84908107552"],
      ["vinni.tran@xiontechs.com", "mailto:vinni.tran@xiontechs.com"],
    ]);
    expect(us.querySelectorAll("svg[aria-hidden='true']")).toHaveLength(3);
  });

  it("puts an aria-hidden ridge above the footer content", () => {
    const footer = renderFooter();
    const ridge = footer.querySelector("[data-ridge]");

    expect(ridge?.getAttribute("aria-hidden")).toBe("true");
    expect(ridge?.querySelector("svg")).not.toBeNull();
  });

  it("draws the sun behind the ridge, before the mountain in paint order", () => {
    const ridge = renderFooter().querySelector("[data-ridge]");

    expect(Array.from(ridge?.children ?? []).map((el) => el.tagName)).toEqual([
      "SPAN",
      "svg",
    ]);
    expect(ridge?.firstElementChild?.className).toBe("ridge-sun");
    expect(ridge?.firstElementChild?.textContent).toBe("");
  });

  it("has the two delivery-center cards, then the other offices in white", () => {
    const footer = renderFooter();

    expect(footer.querySelectorAll("address")).toHaveLength(2);
    expect(footer.textContent).not.toMatch(/head office|placeholder/i);
    const others = within(footer).getByText("Ha Noi, Da Nang");
    expect(others.className).toContain("text-white");
    expect(
      footer.querySelectorAll("address")[1].compareDocumentPosition(others) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("uses the header's SVG logo", () => {
    const logo = within(renderFooter()).getByRole("img", { name: "XionTech" });
    expect(logo.getAttribute("src")).toContain("/brand/xiontech-logo.svg");
  });

  it("shows the bottom bar with copyright, privacy link and the GET IT DONE tag", () => {
    const footer = renderFooter();

    expect(
      within(footer).getByText(
        /Copyright © 2026 XionTech Joint Stock Company\. All Rights Reserved\./,
      ),
    ).toBeDefined();
    expect(
      within(footer)
        .getByRole("link", { name: "Privacy policy" })
        .getAttribute("href"),
    ).toBe("/en/privacy");
    expect(within(footer).getByText("DONE").tagName).toBe("B");
  });

  it("uses the on-navy focus colour, as the footer is a navy surface", () => {
    const footer = renderFooter();

    expect(footer.className).toContain(
      "[--color-focus:var(--color-focus-on-navy)]",
    );
  });

  it("gives every text link a 24px minimum target, 44px on touch screens", () => {
    const footer = renderFooter();

    const textLinks = within(footer)
      .getAllByRole("link")
      .filter((link) => !link.querySelector("img"));
    expect(textLinks).toHaveLength(18);
    for (const link of textLinks) {
      expect(link.className).toContain("min-h-6");
      expect(link.className).toContain("pointer-coarse:min-h-11");
    }
    expect(
      footer
        .querySelector("ul.grid")
        ?.classList.contains("pointer-coarse:gap-0"),
    ).toBe(true);
  });

  it("reads its text from the vi dictionary and prefixes links with /vi", () => {
    render(<SiteFooter locale="vi" />);
    const footer = screen.getByRole("contentinfo");

    const privacy = within(footer).getByRole("link", {
      name: "Chính sách bảo mật",
    });
    expect(privacy.getAttribute("href")).toBe("/vi/privacy");
    expect(
      within(footer)
        .getByRole("link", { name: "Staff Hub" })
        .getAttribute("href"),
    ).toBe("/vi/products#sxp");
    expect(
      within(footer).getByRole("heading", { name: "Văn phòng" }),
    ).toBeDefined();
  });
});

describe("SiteFooter in Vietnamese", () => {
  it("shows the Vietnamese offices note", () => {
    render(<SiteFooter locale="vi" />);
    expect(screen.getByText("Hà Nội, Đà Nẵng")).toBeTruthy();
  });

  it("tags the two delivery centers in Vietnamese", () => {
    const { container } = render(<SiteFooter locale="vi" />);
    expect(
      Array.from(container.querySelectorAll("address small")).map(
        (tag) => tag.textContent,
      ),
    ).toEqual(["Trung tâm Phát triển Mỹ", "Trung tâm Phát triển Việt Nam"]);
  });
});
