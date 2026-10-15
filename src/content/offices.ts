// Office facts supplied by the business on 2026-09-29. Defined once so the
// footer, About (Story 6.4) and Book a demo (Story 2.2) show the same blocks.

export type OfficeContact = {
  href: string;
  label: string;
  // Accessible name, when it must say more than the visible label.
  ariaLabel?: string;
  external?: boolean;
};

export type Office = {
  id: string;
  name: string;
  tag?: string;
  addressLines: string[];
  contacts: OfficeContact[];
  timeZone: string;
  zoneLabel: string;
};

export const plano: Office = {
  id: "plano",
  name: "Plano, Texas, USA",
  addressLines: ["7950 Legacy Drive, Suite 400", "Plano, Texas 75024, USA"],
  contacts: [
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
  ],
  timeZone: "America/Chicago",
  zoneLabel: "US Central",
};

// One string for the Vietnam office tag (About, Demo) and its footer name.
const VIETNAM_DELIVERY_CENTER = "Vietnam Delivery Center";

export const hcmc: Office = {
  id: "hcmc",
  name: "Ho Chi Minh City, Vietnam",
  tag: VIETNAM_DELIVERY_CENTER,
  addressLines: [
    "Floor 15, B1 Building",
    "279 Nguyen Tri Phuong Street",
    "Dien Hong Ward, Ho Chi Minh City, Vietnam",
  ],
  contacts: [
    { href: "tel:+84908107552", label: "+84 908 107 552" },
    {
      href: "mailto:vinni.tran@xiontechs.com",
      label: "vinni.tran@xiontechs.com",
    },
  ],
  timeZone: "Asia/Ho_Chi_Minh",
  zoneLabel: "GMT+7",
};

export const offices: Office[] = [plano, hcmc];

// The two headquarters above have full cards; the other two locations are
// named only, as their addresses are not published (lead, 2026-10-12). The
// footer lists them under the cards (website copy v3).
export const otherLocations = "Ha Noi, Da Nang";

// Footer and About views (prototype order and wording): delivery-center names
// and bracketed phone numbers. `offices` above stays as Demo and Home read it.
export type FooterOffice = Pick<
  Office,
  "id" | "name" | "tag" | "addressLines"
> & {
  contacts: OfficeContact[];
};

export const contactByPrefix = (
  office: Office,
  prefix: string,
): OfficeContact => {
  const contact = office.contacts.find(({ href }) => href.startsWith(prefix));
  if (!contact) {
    throw new Error(`Office ${office.id} has no ${prefix} contact`);
  }
  return contact;
};

const US_DELIVERY_CENTER = "US Delivery Center";

const planoBracketed: OfficeContact[] = [
  {
    href: contactByPrefix(plano, "tel:").href,
    label: "(+1) 469 322 9899",
  },
  {
    ...contactByPrefix(plano, "https://wa.me/"),
    label: "(+1) 469 439 9345",
    ariaLabel: "WhatsApp (+1) 469 439 9345 (opens in a new tab)",
  },
  contactByPrefix(plano, "mailto:"),
];

const hcmcBracketed: OfficeContact[] = [
  {
    href: contactByPrefix(hcmc, "tel:").href,
    label: "(+84) 908 107 552",
  },
];

// Footer view (website copy v3): the same two cards as About’s
// locations, Plano first, each with its delivery-center tag, phone and email.
export const footerOffices: FooterOffice[] = [
  {
    id: plano.id,
    name: "Plano, Texas",
    tag: US_DELIVERY_CENTER,
    addressLines: plano.addressLines,
    contacts: [
      contactByPrefix(plano, "tel:"),
      contactByPrefix(plano, "mailto:"),
    ],
  },
  {
    id: hcmc.id,
    name: "Ho Chi Minh City",
    tag: VIETNAM_DELIVERY_CENTER,
    addressLines: [
      "Floor 15, B1 Building, 279 Nguyen Tri Phuong Street",
      "Dien Hong Ward, Ho Chi Minh City, Vietnam",
    ],
    contacts: [contactByPrefix(hcmc, "tel:"), contactByPrefix(hcmc, "mailto:")],
  },
];

// About view: Plano first, with delivery-center tags, bracketed phones and no
// Vietnam email (decision Q7).
export const aboutOfficeView: Office[] = [
  { ...plano, tag: US_DELIVERY_CENTER, contacts: planoBracketed },
  { ...hcmc, contacts: hcmcBracketed },
];

// Vietnamese. Addresses, numbers, emails, hrefs and time zones are shared with
// English; only names, tags, zone labels and accessible names change.
const NEW_TAB_VI = "(mở trong thẻ mới)";
const US_DELIVERY_CENTER_VI = "Trung tâm Phát triển Mỹ";
const VIETNAM_DELIVERY_CENTER_VI = "Trung tâm Phát triển Việt Nam";

export const planoVi: Office = {
  ...plano,
  name: "Plano, Texas, Mỹ",
  contacts: plano.contacts.map((contact) =>
    contact.external
      ? { ...contact, ariaLabel: `${contact.label} ${NEW_TAB_VI}` }
      : contact,
  ),
  zoneLabel: "Giờ miền Trung Mỹ",
};

export const hcmcVi: Office = {
  ...hcmc,
  name: "TP. Hồ Chí Minh, Việt Nam",
  tag: VIETNAM_DELIVERY_CENTER_VI,
};

export const officesVi: Office[] = [planoVi, hcmcVi];

export const otherLocationsVi = "Hà Nội, Đà Nẵng";

const planoBracketedVi: OfficeContact[] = planoBracketed.map((contact) =>
  contact.external
    ? { ...contact, ariaLabel: `WhatsApp ${contact.label} ${NEW_TAB_VI}` }
    : contact,
);

export const footerOfficesVi: FooterOffice[] = [
  { ...footerOffices[0], tag: US_DELIVERY_CENTER_VI },
  {
    ...footerOffices[1],
    name: "TP. Hồ Chí Minh",
    tag: VIETNAM_DELIVERY_CENTER_VI,
  },
];

export const aboutOfficeViewVi: Office[] = [
  { ...planoVi, tag: US_DELIVERY_CENTER_VI, contacts: planoBracketedVi },
  { ...hcmcVi, contacts: hcmcBracketed },
];
