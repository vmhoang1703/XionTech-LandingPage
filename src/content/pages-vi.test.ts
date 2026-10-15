import { describe, expect, it } from "vitest";
import { contentMismatches } from "@/i18n/content";
import * as about from "./about";
import * as offices from "./offices";
import * as products from "./products";
import * as services from "./services";

// Every Vietnamese dictionary has exactly the shape of its English one.
describe("Products, services, about and offices in Vietnamese", () => {
  it.each([
    ["servicesMeta", services.servicesMeta, services.servicesMetaVi],
    ["servicesPage", services.servicesPage, services.servicesPageVi],
    ["servicesSection", services.servicesSection, services.servicesSectionVi],
    [
      "servicesOutcomes",
      services.servicesOutcomes,
      services.servicesOutcomesVi,
    ],
    ["servicesProcess", services.servicesProcess, services.servicesProcessVi],
    ["aboutMeta", about.aboutMeta, about.aboutMetaVi],
    ["aboutHero", about.aboutHero, about.aboutHeroVi],
    ["aboutStory", about.aboutStory, about.aboutStoryVi],
    ["aboutFaq", about.aboutFaq, about.aboutFaqVi],
    ["aboutOffices", about.aboutOffices, about.aboutOfficesVi],
    ["aboutCta", about.aboutCta, about.aboutCtaVi],
    [
      "aboutValuesHeading",
      about.aboutValuesHeading,
      about.aboutValuesHeadingVi,
    ],
    ["plano", offices.plano, offices.planoVi],
    ["hcmc", offices.hcmc, offices.hcmcVi],
    ["offices", offices.offices, offices.officesVi],
    ["otherLocations", offices.otherLocations, offices.otherLocationsVi],
    ["footerOffices", offices.footerOffices, offices.footerOfficesVi],
    ["aboutOfficeView", offices.aboutOfficeView, offices.aboutOfficeViewVi],
    ["productsMeta", products.productsMeta, products.productsMetaVi],
    [
      "productsShowcase",
      products.productsShowcase,
      products.productsShowcaseVi,
    ],
    ["productDetails", products.productDetails, products.productDetailsVi],
    ["journeyMap", products.journeyMap, products.journeyMapVi],
    ["productRoad", products.productRoad, products.productRoadVi],
    ["journeyBoard", products.journeyBoard, products.journeyBoardVi],
    ["roadDialog", products.roadDialog, products.roadDialogVi],
  ])("%s has the English shape", (_name, en, vi) => {
    expect(contentMismatches(en, vi)).toEqual([]);
  });

  it("keeps service names, ids, hrefs and contact data shared with English", () => {
    // The Services page finds each card's icon by the English id at its index.
    expect(services.servicesSectionVi.services.map((s) => s.id)).toEqual(
      services.servicesSection.services.map((s) => s.id),
    );
    expect(services.servicesSectionVi.services.map((s) => s.name)).toEqual(
      services.servicesSection.services.map((s) => s.name),
    );
    expect(about.aboutFaqVi.items.map((item) => item.id)).toEqual(
      about.aboutFaq.items.map((item) => item.id),
    );
    expect(offices.aboutOfficeViewVi.map((office) => office.contacts)).toEqual(
      offices.aboutOfficeView.map((office) =>
        office.contacts.map((contact) =>
          contact.external
            ? { ...contact, ariaLabel: expect.stringContaining("thẻ mới") }
            : contact,
        ),
      ),
    );
    expect(offices.footerOfficesVi.map((o) => o.addressLines)).toEqual(
      offices.footerOffices.map((o) => o.addressLines),
    );
    expect(products.productRoadVi.stops).toEqual(products.productRoad.stops);
    expect(products.journeyBoardVi.lanes.map((lane) => lane.app)).toEqual(
      products.journeyBoard.lanes.map((lane) => lane.app),
    );
    expect(products.productDetailsVi["ai-tutor"].features.map((f) => f.id)).toEqual(
      products.productDetails["ai-tutor"].features.map((f) => f.id),
    );
  });
});
