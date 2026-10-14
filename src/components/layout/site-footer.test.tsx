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
        "Education technology products and software delivery services for schools and businesses.",
      ),
    ).toBeDefined();
  });

  it("groups products by audience and hides Product updates on Demo day", () => {
    const products = column("Products");

    expect(
      within(products)
        .getAllByRole("link")
        .map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["For schools", "/en/products#sxp"],
      ["For students", "/en/products#ai-tutor"],
      ["For parents", "/en/products#pxp"],
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

  it("lists the Vietnam Delivery Center before the US Delivery Center with icon rows", () => {
    const offices = column("Offices");
    const [vietnam, us] = Array.from(offices.querySelectorAll("address"));

    expect(vietnam.querySelector("b")?.textContent).toBe(
      "Vietnam Delivery Center",
    );
    expect(us.querySelector("b")?.textContent).toBe("US Delivery Center");
    expect(
      Array.from(offices.querySelectorAll("address b")).map(
        (heading) => heading.textContent,
      ),
    ).toEqual(["Vietnam Delivery Center", "US Delivery Center"]);
    expect(vietnam.textContent).toContain(
      "Floor 15, B1 Building279 Nguyen Tri Phuong StreetDien Hong Ward, Ho Chi Minh City, Vietnam",
    );
    expect(us.textContent).toContain(
      "7950 Legacy Drive, Suite 400Plano, Texas 75024, USA",
    );

    expect(linkHrefs(vietnam)).toEqual(["tel:+84908107552"]);
    expect(
      within(vietnam).getByRole("link", { name: "(+84) 908 107 552" }),
    ).toBeDefined();
    expect(vietnam.querySelectorAll("svg[aria-hidden='true']")).toHaveLength(2);
    expect(vietnam.querySelector("a[href^='mailto:']")).toBeNull();

    expect(linkHrefs(us)).toEqual([
      "tel:+14693229899",
      "https://wa.me/14694399345",
      "mailto:vinni.tran@newxion.com",
    ]);
    expect(us.querySelectorAll("svg[aria-hidden='true']")).toHaveLength(4);

    const whatsapp = within(us).getByRole("link", {
      name: "WhatsApp (+1) 469 439 9345 (opens in a new tab)",
    });
    expect(whatsapp.getAttribute("target")).toBe("_blank");
    expect(whatsapp.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("puts an aria-hidden ridge above the footer content", () => {
    const footer = renderFooter();
    const ridge = footer.querySelector("[data-ridge]");

    expect(ridge?.getAttribute("aria-hidden")).toBe("true");
    expect(ridge?.querySelector("svg")).not.toBeNull();
    expect(footer.textContent).not.toContain("vinni.tran@xiontechs.com");
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

  it("has two headquarters cards, then names the other two locations", () => {
    const footer = renderFooter();

    expect(footer.querySelectorAll("address")).toHaveLength(2);
    expect(footer.textContent).not.toMatch(/head office/i);
    const more = within(footer).getByText("Also in Ha Noi and Da Nang.");
    expect(more.previousElementSibling?.tagName).toBe("ADDRESS");
  });

  it("shows the bottom bar with copyright, privacy link and the GET IT DONE tag", () => {
    const footer = renderFooter();

    expect(within(footer).getByText(/© 2026 XionTech\b/)).toBeDefined();
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

  it("gives every text link a 24px minimum target", () => {
    const footer = renderFooter();

    const textLinks = within(footer)
      .getAllByRole("link")
      .filter((link) => !link.querySelector("img"));
    expect(textLinks).toHaveLength(18);
    for (const link of textLinks) {
      expect(link.className).toContain("min-h-6");
    }
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
        .getByRole("link", { name: "Cho nhà trường" })
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
    expect(
      screen.getByText("Ngoài ra còn có mặt tại Hà Nội và Đà Nẵng."),
    ).toBeTruthy();
  });

  it("names the WhatsApp link in Vietnamese", () => {
    render(<SiteFooter locale="vi" />);
    expect(
      screen
        .getByRole("link", {
          name: "WhatsApp (+1) 469 439 9345 (mở trong thẻ mới)",
        })
        .getAttribute("href"),
    ).toBe("https://wa.me/14694399345");
  });
});
