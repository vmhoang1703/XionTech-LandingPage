/**
 * Every visible string of /privacy, in one place so it can be translated later.
 * Unverified policy text starts with "[Placeholder]" (AGENTS.md hard rule 1).
 * Only `retentionDecided` is a decided fact (decision A4).
 */
const RETENTION_DECIDED =
  "Contact and demo requests, email capture submissions, job applications and CVs are kept with no time limit.";

export const PRIVACY = {
  metaTitle: "Privacy Policy | XionTech",
  metaDescription:
    "[Placeholder] How XionTech uses the personal data you share through our forms.",
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Privacy policy",
  title: "Privacy policy.",
  lede: "[Placeholder] Policy text to be supplied by the legal owner, compliant with Vietnam's Decree 13/2023 (PDPD).",
  bodyLabel: "Policy",
  outlineNote:
    "[Placeholder] Content outline. The sections below are what the policy must cover, not the real policy.",
  retentionDecided: RETENTION_DECIDED,
  sections: [
    {
      id: "privacy-who",
      heading: "Who we are and how to reach us",
      paragraphs: [
        "[Placeholder] The data controller (XionTech legal entity), its address and a contact for privacy requests.",
      ],
    },
    {
      id: "privacy-collect",
      heading: "What we collect",
      paragraphs: [
        "[Placeholder] Email, name, organisation, role and anything you send through our forms, including a CV if you apply for a job.",
        "[Placeholder] The email you type in the email capture band is sent to our company inbox like a form message. Your browser also keeps it in session storage only until the demo request page reads it.",
      ],
    },
    {
      id: "privacy-use",
      heading: "How we use it",
      paragraphs: [
        "[Placeholder] Only to answer your request, arrange a demo, or consider your job application and CV.",
      ],
    },
    {
      id: "privacy-share",
      heading: "Who we share it with",
      paragraphs: [
        "[Placeholder] Service providers that process data for us: Gmail (sends form messages to our company inbox), Upstash (rate-limit counters made from hashed values), Vercel (website hosting and private CV storage).",
      ],
    },
    {
      id: "privacy-transfers",
      heading: "Transfers outside Vietnam",
      paragraphs: [
        "[Placeholder] When data is transferred abroad (for example to our Plano office) and the safeguards required by Decree 13/2023.",
      ],
    },
    {
      id: "privacy-retention",
      heading: "How long we keep it",
      paragraphs: [
        RETENTION_DECIDED,
        "[Placeholder] The final retention wording, and whether a time limit will be added later.",
      ],
    },
    {
      id: "privacy-cookies",
      heading: "Cookies and analytics",
      paragraphs: [
        "[Placeholder] Temporary text. The final text will list the essential first-party language cookie (what it stores and why) and state that no non-essential cookies or analytics are set without your consent.",
      ],
    },
    {
      id: "privacy-rights",
      heading: "Your rights",
      paragraphs: [
        "[Placeholder] Access, correct or delete your data, or withdraw consent; how to ask for deletion is not decided yet.",
      ],
    },
  ],
} as const;
