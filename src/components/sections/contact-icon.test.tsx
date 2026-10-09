import {
  EnvelopeSimpleIcon,
  PhoneIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/ssr";
import { describe, expect, it } from "vitest";
import { contactIcon } from "./contact-icon";

describe("contactIcon", () => {
  it("picks the icon from the link scheme", () => {
    expect(contactIcon("tel:+1555")).toBe(PhoneIcon);
    expect(contactIcon("https://wa.me/1555")).toBe(WhatsappLogoIcon);
    expect(contactIcon("mailto:a@b.c")).toBe(EnvelopeSimpleIcon);
  });

  it("throws for a contact link with no icon", () => {
    expect(() => contactIcon("sms:+1555")).toThrow(/No footer icon/);
  });
});
