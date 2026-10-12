import { SERVICES } from "@/components/layout/nav-data";
import { APPS, appById } from "@/content/apps";
import { CONTACT_ERRORS } from "@/lib/contact/contact-rules";

const DETAILS_CONSENT = "We only use your details to respond to this request.";

/**
 * Every visible string of the /demo hero and contact form, in one place so it
 * can be translated later. Service and product names stay in English.
 */
export const CONTACT_STRINGS = {
  metaTitle: "Book a Demo or Start a Project | XionTech",
  metaDescription:
    "Book a demo of Parent Hub and Staff Hub for your school, or tell us about your software project. XionTech, Ho Chi Minh City and Plano.",
  hero: {
    breadcrumbLabel: "Breadcrumb",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Contact",
    titleBefore: "Let's talk about your ",
    titleHighlight: "school",
    titleAfter: " or your project.",
    items: [
      "A walkthrough of Parent Hub and Staff Hub using your school's scenarios.",
      "Answers on setup, data and support.",
      "For projects: a first Discovery conversation, the first of our four steps.",
    ],
    officesLabel: "Our offices",
  },
  form: {
    heading: "What can we help with?",
    tabsLabel: "Request type",
    tabDemo: "Product demo",
    tabProject: "Outsourcing project",
    name: "Full name",
    email: "Work email",
    org: "School or company",
    role: "Your role",
    roleHelp: "For example: Principal, Head of IT",
    products: "Products of interest",
    schoolSize: "School size",
    date: "Preferred date",
    service: "Service",
    startTiming: "When do you want to start?",
    message: "Message (optional)",
    submit: "Send request",
    sending: "Sending...",
    successHeading: "Summit reached. Thank you!",
    successText: "We will be in touch soon.",
    sendError: "We could not send your request. Please try again.",
    rateError:
      "You have sent several requests in a short time. Please try again in a few minutes.",
    consent: DETAILS_CONSENT,
    privacyLink: "Privacy policy",
    errorsHeading: "Please fix the following:",
  },
  // Home #contact section (prototype index.html:241-268).
  home: {
    heading: "Have something you want to build?",
    lede: "Tell us a little about yourself and what you're working on. Our team will get in touch to learn more.",
    name: "Your name",
    email: "Work email",
    phone: "Phone number",
    optional: "(optional)",
    phonePlaceholder: "(+1) 469 322 9899",
    message: "Tell us about your project",
    messagePlaceholder:
      "What are you looking to build? Tell us about your idea, existing product, team or challenge.",
    submit: "Start the conversation",
    consent: "We only use your details to reply to your message.",
    successHeading: "Summit reached. Thanks — we've received your message.",
    successText:
      "Our team will review what you shared and get in touch with you.",
  },
  capture: {
    emailLabel: "Work email",
    demo: {
      heading: "See it working at your school.",
      lede: "Leave your work email and we'll arrange a walkthrough built around your school.",
      placeholder: "name@school.edu.vn",
      button: "Book a demo",
      consent: "We only use your email to arrange your demo.",
    },
    project: {
      heading: "Tell us what you're building.",
      lede: "Leave your work email and we'll reach out to start Discovery.",
      placeholder: "name@company.com",
      button: "Start a project",
      consent: DETAILS_CONSENT,
    },
  },
  errors: CONTACT_ERRORS,
  // The Demo form offers every app except AI Tutor (prototype demo.html).
  productPills: APPS.filter((app) => app.id !== "ai-tutor").map(
    (app) => app.shortName,
  ),
  defaultProduct: appById("parent-hub").shortName,
  schoolSizes: [
    "Under 500 students",
    "500 to 1,500 students",
    "Over 1,500 students",
    "Multiple campuses",
  ],
  startTimings: ["As soon as possible", "In 1 to 3 months", "Just exploring"],
  services: [...SERVICES.map((service) => service.name), "Not sure yet"],
} as const;
