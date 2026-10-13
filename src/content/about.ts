import { aboutOfficeView, otherLocations } from "@/content/offices";

// About page copy (prototype about.html). Kept out of the components so it can
// be translated later.

export const aboutMeta = {
  title: "About XionTech | Get IT Done",
  description:
    "XionTech is an education technology company and software partner, with headquarters in Plano (USA) and Ho Chi Minh City (Vietnam) and teams in Ha Noi and Da Nang, serving clients in the USA, Europe and Australia.",
};

export const aboutHero = {
  title: {
    lead: "We’re XionTech,",
    middle: "technology built with ",
    accent: "ownership",
    tail: ".",
  },
  text: "We bring people, ideas and technology together to build exceptional IT systems and shape a brighter future for all. From Ho Chi Minh City and Plano, we build our own platforms for schools and deliver digital products for clients around the world.",
  links: [
    { href: "/products", label: "Explore our products" },
    { href: "/services", label: "Explore our services" },
  ],
};

export const aboutStory = {
  title: {
    lead: "Inspired by a mountain.",
    middle: "United by ",
    highlight: "purpose",
    tail: ".",
  },
  chapters: [
    {
      number: "01",
      title: "The inspiration",
      text: "Our name is inspired by a mountain: a place people look up to, gather around and climb together towards a brighter future.",
    },
    {
      number: "02",
      title: "The purpose",
      // The founding sentence is a placeholder until the business confirms it (Q12).
      text: "[Placeholder] Inspired by this vision, a group of pioneers established newXion in America. Guided by enduring core values, they set out to build a community true to the spirit of the mountain: where people unite, harness cutting-edge technology, and build exceptional IT systems to advance humanity and shape a brighter future for all.",
    },
  ],
  closing: {
    line: "Our inspiration is a mountain. Our purpose is people.",
    tags: "Vision · Community · Technology",
  },
  // Under chapter 01 while the story is held; on the summit of the picture.
  // Amber's tag also read "Founded in America": left out while the founding
  // sentence is a placeholder (Q12).
  cue: "Scroll",
  tagName: "newXion",
};

// Each answer has an id, so Home can pick some (homeFaq in home.ts).
export const aboutFaq = {
  title: "Your question, we answer",
  lede: "Straight answers about our products, our services and how we work.",
  items: [
    {
      id: "what",
      question: "What does XionTech do?",
      answer:
        "We build our own school platforms (Parent Hub, Staff Hub and IoT Device Management) and deliver software for other companies: product engineering, AI-driven analytics, product co-creation and staffing.",
    },
    {
      id: "industries",
      question: "Which industries do you work with?",
      answer:
        "EdTech is our core. We also serve Healthcare, Logistics and Private Equity.",
    },
    {
      id: "try-apps",
      question: "How can our school try Parent Hub or Staff Hub?",
      answer:
        "Get in touch. We walk you through the apps using scenarios from your own school.",
    },
    {
      id: "time-zones",
      question: "How do you work across time zones?",
      answer:
        "Our teams in Plano, Ho Chi Minh City, Ha Noi and Da Nang cover USA, Europe and Australia time zones, with shared tools for real-time updates.",
    },
    {
      id: "shape",
      question: "When do you shape the solution to our needs?",
      answer:
        "From the start. Discovery, the first of our four steps, sets your goals, users and scope before design begins.",
    },
    {
      id: "results",
      question: "What results can we expect?",
      answer:
        "Cost-efficient delivery by skilled Vietnamese engineers, on-time releases and measurable results that support your growth.",
    },
    {
      id: "security",
      question: "How do you keep our data secure?",
      answer:
        "[Placeholder] We work with honesty, transparency and clear ethical standards, backed by security automation and continuous scanning.",
    },
    {
      id: "feedback",
      question: "How do we give feedback during a project?",
      answer:
        "Through dedicated channels, frequent check-ins and agile sprints, so your input shapes the product all the way through.",
    },
    {
      id: "value",
      question: "How do you measure and show value?",
      answer:
        "We track speed, quality, product impact and team autonomy, and share them openly with you.",
    },
  ],
  ask: {
    label: "Still have a question? Ask us directly",
    href: "/#contact",
  },
};

export const aboutOffices = {
  title: "Two headquarters, four locations.",
  more: otherLocations,
  // Plano first, then Ho Chi Minh City.
  offices: aboutOfficeView,
};

export const aboutCapture = {
  heading: "See our apps in action.",
  lede: "Leave your work email and we'll arrange a walkthrough of Parent Hub and Staff Hub.",
};
