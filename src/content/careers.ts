import type { Icon } from "@phosphor-icons/react";
import {
  CpuIcon,
  GraduationCapIcon,
  HeartIcon,
  RocketLaunchIcon,
  SparkleIcon,
  TargetIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";

// Careers page copy. Kept out of the components so it can be translated later.

export const careersMeta = {
  title: "Careers at XionTech | Software Jobs in Ho Chi Minh City",
  description:
    "Join XionTech in Ho Chi Minh City. Work on school platforms and client products with AI/ML, generative AI, cloud and agile delivery in a people-centered culture.",
};

export const careersHero = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Careers",
  title: {
    lead: "Build what schools use ",
    highlight: "every day",
    tail: ".",
  },
  lede: "Join a people-centered team working with AI/ML, generative AI, cloud and agile delivery.",
  primaryCta: { href: "#roles", label: "See open roles" },
  secondaryCta: { href: "#life", label: "Life at XionTech" },
};

export const careersCulture = {
  heading: "A culture that goes beyond employment.",
  lede: "We cultivate a workplace where every team member feels valued, supported, and empowered. It's about belonging, collaboration, and shared success.",
  bullets: [
    {
      icon: RocketLaunchIcon,
      title: "Startup Spirit.",
      text: "Agility, flexibility and a passion for innovation.",
    },
    {
      icon: TargetIcon,
      title: '"Get IT Done" Attitude.',
      text: "Ownership of our commitments and pride in quality.",
    },
    {
      icon: UsersThreeIcon,
      title: "People-Centered Culture.",
      text: "A place where everyone belongs.",
    },
  ] satisfies { icon: Icon; title: string; text: string }[],
  photo: {
    label: "[Placeholder] Photo",
    hint: "A real photo of the team at work or at a company event.",
  },
};

export const careersBenefits = {
  heading: "Why you'll grow here.",
  items: [
    {
      icon: CpuIcon,
      title: "Innovative workspace",
      text: "Cutting-edge technologies to create transformative IT systems.",
    },
    {
      icon: GraduationCapIcon,
      title: "Growth opportunities",
      text: "Structured training, knowledge resources and role-specific onboarding.",
    },
    {
      icon: SparkleIcon,
      title: "Engaging work",
      text: "Projects with AI/ML, generative AI, cloud computing and agile methods.",
    },
    {
      icon: HeartIcon,
      title: "Meaningful impact",
      text: "Solutions that drive digital transformation, used by schools every day.",
    },
  ] satisfies { icon: Icon; title: string; text: string }[],
};

export const careersRoles = {
  heading: "Open roles.",
  emptyText: "No open roles right now.",
  applyLabel: "View and apply",
};

export const careersLife = {
  heading: "Life at XionTech.",
  frames: [
    "[Placeholder] Team photo",
    "[Placeholder] Office photo",
    "[Placeholder] Event photo",
  ],
};
