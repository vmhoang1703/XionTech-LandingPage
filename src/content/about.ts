import {
  HandshakeIcon,
  LightbulbFilamentIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  TargetIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { homeStats } from "@/content/home";
import { offices } from "@/content/offices";
import type { Stat } from "@/components/sections/stats-band";

// About page copy. Kept out of the components so it can be translated later.

export const aboutMeta = {
  title: "About | XionTech",
  description:
    "XionTech is an education technology company and software partner, with offices in Ho Chi Minh City and Plano serving clients in the USA, Europe and Australia.",
};

export const aboutHero = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "About",
  title: {
    lead: "Tech made simple. ",
    highlight: "Solutions made powerful",
    tail: ".",
  },
  lede: "We are an education technology company and software partner. We build our own school platforms and deliver digital products for clients around the world.",
};

// Figures 1, 2, 3 and 5 are the confirmed Home figures (FR-12). The fourth,
// "4 school products ready to demo", is not confirmed (decision A2).
const [years, coverage, stacks, , officeCount] = homeStats.stats;

export const aboutStats: { label: string; stats: Stat[] } = {
  label: "Key facts",
  stats: [
    years,
    coverage,
    stacks,
    {
      value: "4",
      caption: "School products ready to demo",
      placeholder: true,
    },
    officeCount,
  ],
};

export const aboutStory = {
  photoLabel: "[Placeholder] Photo",
  photoHint: "Real team photo at the Ho Chi Minh City office (no AI imagery).",
  title: "Two strengths, one team.",
  lede: "We build PXP, LXP, SXP and IoT Device Management for schools. The same team delivers software for companies in education, healthcare, logistics and private equity.",
  checks: [
    "We understand education from the inside, because we run products for schools.",
    "Led by more than 25 years of leadership experience in software.",
    "Offices in Ho Chi Minh City and Plano, serving clients in the USA, Europe and Australia.",
  ],
};

type AboutValue = {
  icon: Icon;
  title: string;
  text: string;
  featured?: boolean;
};

export const aboutValues: {
  label: string;
  title: string;
  items: AboutValue[];
} = {
  label: "Our core values",
  title: "What guides how we work.",
  items: [
    {
      icon: RocketLaunchIcon,
      title: "Startup Spirit",
      text: "Embody an entrepreneurial mindset, embracing agility, flexibility, and a passion for innovation. Our commitment to excellence is driven by resilience and a culture of continuous improvement.",
    },
    {
      icon: HandshakeIcon,
      title: "Client Centricity",
      text: "Clients are at the heart of everything we do. We strive to deliver exceptional experiences and impactful outcomes through deep understanding, proactive engagement, and tailored solutions.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Integrity First",
      text: "Operate with honesty, transparency, and accountability. Ethical standards guide every decision and interaction, fostering trust and long-term relationships.",
    },
    {
      icon: LightbulbFilamentIcon,
      title: "Innovation Driven",
      text: "Passionate about exploring emerging technologies and creative approaches. Innovation is embedded in our DNA, enabling us to evolve our solutions and stay ahead of industry trends.",
    },
    {
      icon: TargetIcon,
      title: '"Get IT Done" Attitude',
      text: "Take ownership of our commitments and deliver high-quality, reliable, and efficient solutions. Our team is driven by accountability and a results-oriented mindset that meets or exceeds industry standards.",
      featured: true,
    },
    {
      icon: UsersThreeIcon,
      title: "People-Centered Culture",
      text: "Cultivate a workplace where every team member feels valued, supported, and empowered. Our culture goes beyond employment: it's about belonging, collaboration, and shared success.",
    },
  ],
};

export const aboutFaq = {
  title: "Frequently asked questions.",
  lede: "Straight answers about our products, our services and how we work.",
  items: [
    {
      question: "What does XionTech do?",
      answer:
        "We build our own school platforms (PXP, LXP, SXP and IoT Device Management) and deliver software for other companies: product engineering, AI-driven analytics, product co-creation and staffing.",
    },
    {
      question: "Which industries do you work with?",
      answer:
        "EdTech is our core. We also serve Healthcare, Logistics and Private Equity.",
    },
    {
      question: "How can our school try PXP, LXP or SXP?",
      answer:
        "Book a demo. We walk you through the apps using scenarios from your own school.",
    },
    {
      question: "How do you work across time zones?",
      answer:
        "Our teams in Ho Chi Minh City and Plano cover USA, Europe and Australia time zones, with shared tools for real-time updates.",
    },
    {
      question: "When do you shape the solution to our needs?",
      answer:
        "From the start. Discovery, the first step of our 4-D process, sets your goals, users and scope before design begins.",
    },
    {
      question: "What results can we expect?",
      answer:
        "Cost-efficient delivery by skilled Vietnamese engineers, on-time releases and measurable results that support your growth.",
    },
    {
      question: "How do you keep our data secure?",
      answer:
        "[Placeholder] We work with honesty, transparency and clear ethical standards, backed by security automation and continuous scanning.",
    },
    {
      question: "How do we give feedback during a project?",
      answer:
        "Through dedicated channels, frequent check-ins and agile sprints, so your input shapes the product all the way through.",
    },
    {
      question: "How do you measure and show value?",
      answer:
        "We track speed, quality, product impact and team autonomy, and share them openly with you.",
    },
  ],
};

export const aboutOffices = {
  title: "Two offices, serving the world.",
  // Plano first, then Ho Chi Minh City (the shared `offices` order).
  offices,
};

export const aboutCapture = {
  heading: "See our apps in action.",
  lede: "Leave your work email and we'll arrange a walkthrough of PXP, LXP and SXP.",
};
