// Job page copy. Kept out of the components so it can be translated later.

export const jobMeta = {
  title: "Open role | Careers at XionTech",
  description:
    "Read the role and apply with your CV. XionTech, Ho Chi Minh City.",
};

export const jobHero = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCareers: "Careers",
  chipsLabel: "Role details",
} as const;

export const jobDetails = {
  sectionLabel: "Role details and application",
  aboutHeading: "About the role",
  doHeading: "What you'll do",
  bringHeading: "What you bring",
  backLabel: "All open roles",
  backHref: "/careers#roles",
} as const;

export const jobForm = {
  heading: "Apply for this role",
  name: "Full name",
  email: "Email",
  phone: "Phone (optional)",
  cv: "CV",
  cvHelp: "PDF or Word, up to 5 MB.",
  note: "Cover note (optional)",
  submit: "Send application",
  sending: "Sending...",
  successHeading: "Thank you!",
  successText:
    "We've received your application and will be in touch if it's a match.",
  sendError: "We could not send your application. Please try again.",
  rateError:
    "You have sent several requests in a short time. Please try again in a few minutes.",
  consent: "We only use your details and CV to consider your application.",
  privacyLink: "Privacy policy",
  privacyHref: "/privacy",
  errorsHeading: "Please fix the following:",
} as const;
