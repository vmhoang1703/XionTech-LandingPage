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
  ],
  timeZone: "America/Chicago",
  zoneLabel: "US Central",
};

export const hcmc: Office = {
  id: "hcmc",
  name: "Ho Chi Minh City, Vietnam",
  tag: "Vietnam Delivery Center",
  addressLines: [
    "Floor 15, B1 Building",
    "279 Nguyen Tri Phuong Street",
    "Dien Hong Ward, Ho Chi Minh City, Vietnam",
  ],
  contacts: [{ href: "tel:+84908107552", label: "+84 908 107 552" }],
  timeZone: "Asia/Ho_Chi_Minh",
  zoneLabel: "GMT+7",
};

export const offices: Office[] = [plano, hcmc];

// Footer-only view (prototype order and wording): delivery-center names and
// bracketed phone numbers. `offices` above stays as About, Demo and Home read it.
export type FooterOffice = Pick<Office, "id" | "name" | "addressLines"> & {
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

export const footerOffices: FooterOffice[] = [
  {
    id: hcmc.id,
    name: hcmc.tag ?? hcmc.name,
    addressLines: hcmc.addressLines,
    contacts: [
      {
        href: contactByPrefix(hcmc, "tel:").href,
        label: "(+84) 908 107 552",
      },
    ],
  },
  {
    id: plano.id,
    name: "US Delivery Center",
    addressLines: plano.addressLines,
    contacts: [
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
    ],
  },
];
