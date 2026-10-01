import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

function renderFooter() {
  render(<SiteFooter />);
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

    const logo = within(footer).getByRole("img", { name: "XionTechs" });
    expect(logo.closest("a")?.getAttribute("href")).toBe("/");
    expect(
      within(footer).getByText(
        "Education technology products and software delivery services for schools and businesses.",
      ),
    ).toBeDefined();
  });

  it("lists the four products and hides Product updates on Demo day", () => {
    expect(linkHrefs(column("Products"))).toEqual([
      "/products#pxp",
      "/products#lxp",
      "/products#sxp",
      "/products#iot",
    ]);
    expect(
      linkHrefs(screen.getByRole("contentinfo")).some((href) =>
        href?.includes("#updates"),
      ),
    ).toBe(false);
  });

  it("lists five services and All services", () => {
    const services = column("Services");

    expect(linkHrefs(services)).toEqual([
      "/services#product-engineering",
      "/services#ai-analytics",
      "/services#staffing",
      "/services#low-code",
      "/services#cloud",
      "/services",
    ]);
    expect(
      within(services).getByRole("link", { name: "All services" }),
    ).toBeDefined();
  });

  it("lists the company links", () => {
    expect(linkHrefs(column("Company"))).toEqual([
      "/about",
      "/about#values",
      "/about#faq",
      "/news",
      "/careers",
      "/demo",
    ]);
  });

  it("lists Plano first with phone, WhatsApp and email, then the Vietnam Delivery Center", () => {
    const offices = column("Offices");
    const [plano, hcmc] = Array.from(offices.querySelectorAll("address"));

    expect(plano.textContent).toContain("Plano, Texas, USA");
    expect(plano.textContent).toContain(
      "7950 Legacy Drive, Suite 400Plano, Texas 75024, USA",
    );
    expect(linkHrefs(plano)).toEqual([
      "tel:+14693229899",
      "https://wa.me/14694399345",
      "mailto:vinni.tran@newxion.com",
    ]);

    const whatsapp = within(plano).getByRole("link", {
      name: "WhatsApp +1 469 439 9345 (opens in a new tab)",
    });
    expect(whatsapp.getAttribute("target")).toBe("_blank");
    expect(whatsapp.getAttribute("rel")).toBe("noopener noreferrer");

    expect(hcmc.textContent).toContain("Ho Chi Minh City, Vietnam");
    expect(hcmc.textContent).toContain("Vietnam Delivery Center");
    expect(hcmc.textContent).toContain(
      "Floor 15, B1 Building279 Nguyen Tri Phuong StreetDien Hong Ward, Ho Chi Minh City, Vietnam",
    );
    expect(linkHrefs(hcmc)).toEqual(["tel:+84908107552"]);
  });

  it("has no head office label, no Da Nang office and only two offices", () => {
    const footer = renderFooter();

    expect(footer.querySelectorAll("address")).toHaveLength(2);
    expect(footer.textContent).not.toMatch(/head office/i);
    expect(footer.textContent).not.toMatch(/da nang/i);
  });

  it("shows the bottom bar with copyright, privacy link and the GET IT DONE tag", () => {
    const footer = renderFooter();

    expect(within(footer).getByText(/© 2026 XionTechs/)).toBeDefined();
    expect(
      within(footer)
        .getByRole("link", { name: "Privacy policy" })
        .getAttribute("href"),
    ).toBe("/privacy");
    expect(within(footer).getByText("DONE").tagName).toBe("B");
  });
});
