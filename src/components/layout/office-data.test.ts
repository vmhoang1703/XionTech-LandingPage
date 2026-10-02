import { describe, it, expect } from "vitest";
import { OFFICES } from "./office-data";

describe("OFFICES", () => {
  it("should have two offices", () => {
    expect(OFFICES).toHaveLength(2);
  });

  it("should have Plano, Texas office with correct contact data", () => {
    const plano = OFFICES.find((office) => office.city.includes("Plano"));
    expect(plano).toBeDefined();
    expect(plano?.city).toBe("Plano, Texas, USA");
    expect(plano?.addressLines).toEqual([
      "7950 Legacy Drive, Suite 400",
      "Plano, Texas 75024, USA",
    ]);
    expect(plano?.phone).toBe("+1 469 322 9899");
    expect(plano?.phoneHref).toBe("tel:+14693229899");
    expect(plano?.whatsapp).toBe("https://wa.me/14694399345");
    expect(plano?.email).toBe("vinni.tran@newxion.com");
    expect(plano?.emailHref).toBe("mailto:vinni.tran@newxion.com");
  });

  it("should have Ho Chi Minh City office with correct contact data", () => {
    const hcmc = OFFICES.find((office) => office.city.includes("Ho Chi Minh"));
    expect(hcmc).toBeDefined();
    expect(hcmc?.city).toBe("Ho Chi Minh City, Vietnam");
    expect(hcmc?.tag).toBe("Vietnam Delivery Center");
    expect(hcmc?.addressLines).toEqual([
      "Floor 15, B1 Building",
      "279 Nguyen Tri Phuong Street",
      "Dien Hong Ward, Ho Chi Minh City, Vietnam",
    ]);
    expect(hcmc?.phone).toBe("+84 908 107 552");
    expect(hcmc?.phoneHref).toBe("tel:+84908107552");
    expect(hcmc?.whatsapp).toBeUndefined();
    expect(hcmc?.email).toBeUndefined();
    expect(hcmc?.emailHref).toBeUndefined();
  });

  it("Plano office should not have a tag", () => {
    const plano = OFFICES.find((office) => office.city.includes("Plano"));
    expect(plano?.tag).toBeUndefined();
  });
});
