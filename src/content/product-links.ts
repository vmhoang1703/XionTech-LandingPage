// Temporary product addresses (decision A1). Each value is a stand-in until
// the real address exists; the visible labels that use them start with
// "[Placeholder]". Keep every product address here so they are easy to find
// and replace: the Parent Hub store links (Story 4.2) and the Staff Hub and IoT web
// addresses (Story 4.3).

// The stand-in value. A control whose address is still this renders as a
// disabled label, not a link (lead, 2026-10-03).
export const PLACEHOLDER_HREF = "#";

export const productLinks = {
  pxpAppStore: PLACEHOLDER_HREF,
  pxpGooglePlay: PLACEHOLDER_HREF,
};

// Web addresses shown in the browser frame URL pills on /products.
export const webAppLinks = {
  sxp: { label: "[Placeholder] sxp.xiontechs.com", href: PLACEHOLDER_HREF },
  iot: { label: "[Placeholder] iot.xiontechs.com", href: PLACEHOLDER_HREF },
};
