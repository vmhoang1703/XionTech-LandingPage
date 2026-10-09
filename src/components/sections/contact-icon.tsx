import {
  EnvelopeSimpleIcon,
  PhoneIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/ssr";

// Icon for a contact row, chosen from the link scheme.
export function contactIcon(href: string): typeof PhoneIcon {
  if (href.startsWith("tel:")) return PhoneIcon;
  if (href.startsWith("https://wa.me/")) return WhatsappLogoIcon;
  if (href.startsWith("mailto:")) return EnvelopeSimpleIcon;
  throw new Error(`No contact icon for link ${href}`);
}
