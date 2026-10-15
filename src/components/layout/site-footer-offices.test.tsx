import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// The real footer offices all carry a tag and open no contact in a new tab;
// this covers an untagged office and an external contact link.
vi.mock("@/content/offices", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/content/offices")>();
  const office = {
    ...real.footerOffices[0],
    id: "test-office",
    tag: undefined,
    contacts: [
      {
        ...real.footerOffices[0].contacts[0],
        href: "https://wa.me/84908107552",
        external: true,
      },
    ],
  };
  return { ...real, footerOffices: [office] };
});

const { SiteFooter } = await import("./site-footer");

describe("SiteFooter offices", () => {
  it("shows an office with no tag, and opens an external contact in a new tab", () => {
    render(<SiteFooter locale="en" />);
    const footer = screen.getByRole("contentinfo");
    const address = footer.querySelector("address");
    expect(address?.querySelector("small")).toBeNull();
    const link = address?.querySelector('a[href="https://wa.me/84908107552"]');
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
