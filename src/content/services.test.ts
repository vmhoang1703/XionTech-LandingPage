import { SERVICES } from "@/components/layout/nav-data";
import { homeServices } from "@/content/home";
import { processFlow } from "@/content/process";
import { servicesSection, servicesStepCopy } from "@/content/services";
import { siteFooter } from "@/content/site-footer";
import { describe, expect, it } from "vitest";

describe("service ids across pages", () => {
  it("match Home cards and nav anchors in order, and every footer service link", () => {
    const ids = servicesSection.services.map((service) => service.id);

    expect(ids).toEqual(homeServices.cards.map((card) => card.id));
    expect(ids).toEqual(SERVICES.map((service) => service.anchor));
    const footerIds = siteFooter.columns
      .flatMap((column) => column.links)
      .filter((link) => link.href.startsWith("/services#"))
      .map((link) => link.href.replace("/services#", ""));
    expect(footerIds.length).toBeGreaterThan(0);
    for (const id of footerIds) expect(ids).toContain(id);
  });
});

describe("Services 4-D step copy", () => {
  it("has one entry per shared 4-D step, keyed by step number", () => {
    expect(Object.keys(servicesStepCopy)).toEqual(
      processFlow.steps.map((step) => step.num),
    );
  });
});
