// Temporary product addresses (decision A1). Each value is a stand-in until
// the real address exists; the visible labels that use them start with
// "[Placeholder]". Keep every product address here so they are easy to find
// and replace: the Parent Hub store links and the web app prototypes (E-A5).

// The stand-in value. A control whose address is still this renders as a
// disabled label, not a link (decision A6).
export const PLACEHOLDER_HREF = "#";

export const productLinks = {
  pxpAppStore: PLACEHOLDER_HREF,
  pxpGooglePlay: PLACEHOLDER_HREF,
};

// Web apps on /products, keyed by app id: the address shown in the
// browser frame bar and the "View prototype" target. The AI Tutor address is
// not published yet (Q11).
export const webAppLinks = {
  "staff-hub": {
    label: "[Placeholder] staffhub.xiontechs.com",
    href: PLACEHOLDER_HREF,
  },
  iot: { label: "[Placeholder] iot.xiontechs.com", href: PLACEHOLDER_HREF },
  "ai-tutor": {
    label: "[Placeholder] AI Tutor prototype address",
    href: PLACEHOLDER_HREF,
  },
} as const;
