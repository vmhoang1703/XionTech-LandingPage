import { describe, expect, it } from "vitest";
import { offices } from "./offices";

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
      { href: "tel:+14693229899", label: "+1 469 322 9899" },
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
    ]);
    expect(hcmc?.timeZone).toBe("Asia/Ho_Chi_Minh");
    expect(hcmc?.zoneLabel).toBe("GMT+7");
  });

  it("marks only the WhatsApp contact as external", () => {
    const external = offices.flatMap((office) =>
      office.contacts.filter((contact) => contact.external),
    );
    expect(external.map((contact) => contact.href)).toEqual([
      "https://wa.me/14694399345",
    ]);
  });
});
