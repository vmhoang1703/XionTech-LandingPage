import { describe, expect, it } from "vitest";
import {
  aboutOfficeView,
  contactByPrefix,
  footerOffices,
  hcmc,
  offices,
  plano,
} from "./offices";

describe("offices", () => {
  it("has two offices", () => {
    expect(offices.map((office) => office.id)).toEqual(["plano", "hcmc"]);
  });

  it("has the Plano office with its contact data", () => {
    const plano = offices.find((office) => office.id === "plano");
    expect(plano?.name).toBe("Plano, Texas, USA");
    expect(plano?.tag).toBeUndefined();
    expect(plano?.addressLines).toEqual([
      "7950 Legacy Drive, Suite 400",
      "Plano, Texas 75024, USA",
    ]);
    expect(plano?.contacts).toEqual([
      { href: "tel:+14693229899", label: "+1 (469) 322-9899" },
      {
        href: "https://wa.me/14694399345",
        label: "WhatsApp +1 469 439 9345",
        ariaLabel: "WhatsApp +1 469 439 9345 (opens in a new tab)",
        external: true,
      },
      {
        href: "mailto:vinni.tran@newxion.com",
        label: "vinni.tran@newxion.com",
      },
    ]);
    expect(plano?.timeZone).toBe("America/Chicago");
    expect(plano?.zoneLabel).toBe("US Central");
  });

  it("has the Ho Chi Minh City office with its contact data", () => {
    const hcmc = offices.find((office) => office.id === "hcmc");
    expect(hcmc?.name).toBe("Ho Chi Minh City, Vietnam");
    expect(hcmc?.tag).toBe("Vietnam Delivery Center");
    expect(hcmc?.addressLines).toEqual([
      "Floor 15, B1 Building",
      "279 Nguyen Tri Phuong Street",
      "Dien Hong Ward, Ho Chi Minh City, Vietnam",
    ]);
    expect(hcmc?.contacts).toEqual([
      { href: "tel:+84908107552", label: "+84 908 107 552" },
      {
        href: "mailto:vinni.tran@xiontechs.com",
        label: "vinni.tran@xiontechs.com",
      },
    ]);
    expect(hcmc?.timeZone).toBe("Asia/Ho_Chi_Minh");
    expect(hcmc?.zoneLabel).toBe("GMT+7");
  });

  it("lists the footer offices as the About cards: Plano first, tags, phone and email", () => {
    expect(footerOffices.map((office) => office.id)).toEqual(["plano", "hcmc"]);
    expect(footerOffices.map((office) => office.name)).toEqual([
      "Plano, Texas",
      "Ho Chi Minh City",
    ]);
    expect(footerOffices.map((office) => office.tag)).toEqual([
      "US Delivery Center",
      "Vietnam Delivery Center",
    ]);
    expect(footerOffices[0].contacts.map(({ label }) => label)).toEqual([
      "+1 (469) 322-9899",
      "vinni.tran@newxion.com",
    ]);
    expect(footerOffices[1].contacts.map(({ label }) => label)).toEqual([
      "+84 908 107 552",
      "vinni.tran@xiontechs.com",
    ]);
    expect(footerOffices[0].addressLines).toEqual(plano.addressLines);
  });

  it("leaves the shared offices in Plano then HCMC order with the old labels", () => {
    expect(offices.map((office) => office.id)).toEqual(["plano", "hcmc"]);
    expect(offices.map((office) => office.name)).toEqual([
      "Plano, Texas, USA",
      "Ho Chi Minh City, Vietnam",
    ]);
    expect(offices[0].contacts[0].label).toBe("+1 (469) 322-9899");
    expect(offices[1].contacts[0].label).toBe("+84 908 107 552");
  });

  it("marks only the WhatsApp contact as external", () => {
    const external = offices.flatMap((office) =>
      office.contacts.filter((contact) => contact.external),
    );
    expect(external.map((contact) => contact.href)).toEqual([
      "https://wa.me/14694399345",
    ]);
  });

  it("finds a contact by href prefix and throws when there is none", () => {
    expect(contactByPrefix(plano, "mailto:").label).toBe(
      "vinni.tran@newxion.com",
    );
    expect(() => contactByPrefix(hcmc, "https://wa.me/")).toThrow(
      "Office hcmc has no https://wa.me/ contact",
    );
  });

  it("footer contact labels show the digits the link dials", () => {
    const digits = (text: string) => text.replace(/\D/g, "");
    const dialled = footerOffices
      .flatMap((office) => office.contacts)
      .filter(({ href }) => !href.startsWith("mailto:"));

    expect(dialled).toHaveLength(2);
    for (const { href, label } of dialled) {
      expect(digits(label)).toBe(digits(href.replace("https://wa.me/", "")));
    }
  });

  it("lists the About offices Plano first with delivery-center tags and bracketed phones", () => {
    expect(aboutOfficeView.map((office) => office.id)).toEqual([
      "plano",
      "hcmc",
    ]);
    expect(aboutOfficeView.map((office) => office.tag)).toEqual([
      "US Delivery Center",
      "Vietnam Delivery Center",
    ]);
    expect(aboutOfficeView.map((office) => office.name)).toEqual([
      "Plano, Texas, USA",
      "Ho Chi Minh City, Vietnam",
    ]);
    expect(aboutOfficeView[0].contacts.map(({ label }) => label)).toEqual([
      "(+1) 469 322 9899",
      "(+1) 469 439 9345",
      "vinni.tran@newxion.com",
    ]);
    expect(aboutOfficeView[0].contacts[1]).toMatchObject({
      href: "https://wa.me/14694399345",
      ariaLabel: "WhatsApp (+1) 469 439 9345 (opens in a new tab)",
      external: true,
    });
    expect(aboutOfficeView[1].contacts).toEqual([
      { href: "tel:+84908107552", label: "(+84) 908 107 552" },
    ]);
    expect(aboutOfficeView[0].timeZone).toBe(plano.timeZone);
    expect(aboutOfficeView[1].zoneLabel).toBe(hcmc.zoneLabel);
  });

  it("About contact labels show the digits the link dials", () => {
    const digits = (text: string) => text.replace(/\D/g, "");
    const dialled = aboutOfficeView
      .flatMap((office) => office.contacts)
      .filter(({ href }) => !href.startsWith("mailto:"));

    expect(dialled).toHaveLength(3);
    for (const { href, label } of dialled) {
      expect(digits(label)).toBe(digits(href.replace("https://wa.me/", "")));
    }
  });
});
