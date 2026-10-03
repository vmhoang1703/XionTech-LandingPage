import { SERVICES } from "@/components/layout/nav-data";
import { CONTACT_ERRORS } from "@/lib/contact/contact-rules";

/**
 * Every visible string of the /demo hero and contact form, in one place so it
 * can be translated later. Service and product names stay in English.
 */
export const CONTACT_STRINGS = {
  metaTitle: "Book a Demo or Start a Project | XionTech",
  metaDescription:
    "Book a demo of PXP, LXP and SXP for your school, or tell us about your software project. XionTech, Ho Chi Minh City and Plano.",
  hero: {
    breadcrumbLabel: "Breadcrumb",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Contact",
    titleBefore: "Let's talk about your ",
    titleHighlight: "school",
    titleAfter: " or your project.",
    items: [
      "A walkthrough of PXP, LXP and SXP using your school's scenarios.",
      "Answers on setup, data and support.",
      "For projects: a first Discovery conversation in our 4-D process.",
    ],
    officesLabel: "Our offices",
    whatsappPrefix: "WhatsApp",
    whatsappNewTab: "(opens in a new tab)",
  },
  form: {
    heading: "What can we help with?",
    tabsLabel: "Request type",
    tabDemo: "Product demo",
    tabProject: "Outsourcing project",
    name: "Full name",
    email: "Work email",
    org: "School or company",
    role: "Role",
    roleHelp: "For example: Principal, Head of IT",
    products: "Products of interest",
    schoolSize: "School size",
    date: "Preferred date",
    service: "Service",
    startTiming: "Start timing",
    message: "Message (optional)",
    submit: "Send request",
    sending: "Sending...",
    successHeading: "Thank you!",
    successText: "We will be in touch soon.",
    sendError: "We could not send your request. Please try again.",
    rateError:
      "You have sent several requests in a short time. Please try again in a few minutes.",
    consent: "We only use your details to respond to this request.",
    privacyLink: "Privacy policy",
    errorsHeading: "Please fix the following:",
  },
  errors: CONTACT_ERRORS,
  productPills: ["PXP", "LXP", "SXP", "IoT"],
  defaultProduct: "PXP",
  schoolSizes: [
    "Under 500 students",
    "500 to 1,500 students",
    "Over 1,500 students",
    "Multiple campuses",
  ],
  startTimings: ["As soon as possible", "In 1 to 3 months", "Just exploring"],
  services: [...SERVICES.map((service) => service.name), "Not sure yet"],
} as const;
