import { SERVICES } from "@/components/layout/nav-data";
import { APPS } from "@/content/apps";
import { servicesSection } from "@/content/services";
import { siteFooter } from "@/content/site-footer";
import { describe, expect, it } from "vitest";

describe("service ids across pages", () => {
  it("match nav anchors in order, and every footer service link except #process", () => {
    const ids = servicesSection.services.map((service) => service.id);

    expect(ids).toEqual(SERVICES.map((service) => service.anchor));
    const footerIds = siteFooter.columns
      .flatMap((column) => column.links)
      .filter((link) => link.href.startsWith("/services#"))
      .map((link) => link.href.replace("/services#", ""))
      .filter((id) => id !== "process");
    expect(footerIds.length).toBeGreaterThan(0);
    for (const id of footerIds) expect(ids).toContain(id);
  });
});

describe("footer product links", () => {
  it("point at real Products card anchors", () => {
    const anchors = APPS.map((app) => app.anchor);
    const footerIds = siteFooter.columns
      .flatMap((column) => column.links)
      .filter((link) => link.href.startsWith("/products#"))
      .map((link) => link.href.replace("/products#", ""));

    expect(footerIds).toEqual(["pxp", "sxp", "ai-tutor"]);
    for (const id of footerIds) expect(anchors).toContain(id);
  });
});
