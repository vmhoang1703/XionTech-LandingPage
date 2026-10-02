/**
 * Office data: contact details for all XionTech offices.
 * Shared with the footer (Story 1.5) and contact form (Story 2.2).
 */

export interface Office {
  city: string;
  tag?: string;
  addressLines: string[];
  phone: string;
  phoneHref: string;
  email?: string;
  emailHref?: string;
  whatsapp?: string;
  whatsappLabel?: string;
}

export const OFFICES: Office[] = [
  {
    city: "Plano, Texas, USA",
    addressLines: ["7950 Legacy Drive, Suite 400", "Plano, Texas 75024, USA"],
    phone: "+1 469 322 9899",
    phoneHref: "tel:+14693229899",
    email: "vinni.tran@newxion.com",
    emailHref: "mailto:vinni.tran@newxion.com",
    whatsapp: "https://wa.me/14694399345",
    whatsappLabel: "+1 469 439 9345",
  },
  {
    city: "Ho Chi Minh City, Vietnam",
    tag: "Vietnam Delivery Center",
    addressLines: [
      "Floor 15, B1 Building",
      "279 Nguyen Tri Phuong Street",
      "Dien Hong Ward, Ho Chi Minh City, Vietnam",
    ],
    phone: "+84 908 107 552",
    phoneHref: "tel:+84908107552",
  },
];
