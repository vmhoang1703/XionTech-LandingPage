// Careers page copy. Kept out of the components so it can be translated later.

export const careersMeta = {
  title: "Careers at XionTech | Software Jobs in Ho Chi Minh City",
  description:
    "Join XionTech in Ho Chi Minh City. Work on school platforms and client products with AI/ML, generative AI, cloud and agile delivery in a people-centered culture.",
};

export const careersHero = {
  title: { first: "Stay curious.", second: "Build what’s next." },
  lede: "We’re building a team for people who learn fast, ask better questions, adapt when things change, and care about the outcome, not just the task.",
  cta: { href: "#roles", label: "Explore open roles" },
};

// Q6: the model has no verified source yet, so its caption and name are
// marked [Placeholder] until Amber confirms it.
export const careersGrowth = {
  caption: "[Placeholder] Growth Learning Model",
  center: "Growth",
  steps: ["Curious", "Learn", "Ask", "Grow", "Improve"],
};

export type InsideTone = "navy" | "yellow" | "cream";

export const careersInside = {
  heading: "Inside XionTech.",
  lede: "A look at the moments that shape life here: workshops, project starts, team days, celebrations, shared learning and the small moments in between.",
  tiles: [
    {
      tag: "Learn together",
      title: "Workshops & experiments",
      text: "Hands-on sessions where the team tries new tools, agentic workflows and better ways to work.",
      tone: "navy",
      big: true,
    },
    {
      tag: "Build relationships",
      title: "Client visits",
      text: "Understand context directly and build stronger working relationships.",
      tone: "yellow",
    },
    {
      tag: "Shared direction",
      title: "Town halls",
      text: "What changed, what matters now, and where we’re going next.",
      tone: "cream",
    },
    {
      tag: "Start together",
      title: "Project kickoffs",
      text: "New work starts with shared context, not a mysterious task list.",
      tone: "cream",
    },
    // Q6: no verified source for this tile yet.
    {
      tag: "Celebrate progress",
      title: "[Placeholder] Celebration",
      text: "Because shipped work deserves more than a green status label.",
      tone: "navy",
    },
  ] satisfies {
    tag: string;
    title: string;
    text: string;
    tone: InsideTone;
    big?: boolean;
  }[],
};

export type ValueIcon = "agile" | "outcome" | "innovate" | "together" | "done";

// Q6: these five values differ from the six core values and are not yet
// confirmed, so the section carries a [Placeholder] note.
export const careersValues = {
  heading: "Five things that shape the way we work.",
  lede: "These are the behaviours we want people to experience from us every day. Flip a card to see what each one means in practice.",
  note: "[Placeholder] These five values are waiting for confirmation.",
  frontHint: "Flip for details",
  backHint: "Flip back",
  cards: [
    {
      icon: "agile",
      title: "Stay agile",
      label: "STAY AGILE",
      backTitle: "Move without losing direction.",
      text: "Stay flexible and adapt when new information or a better answer changes the path.",
    },
    {
      icon: "outcome",
      title: "Own the outcome",
      label: "OWNERSHIP",
      backTitle: "Care beyond your task.",
      text: "Raise issues early, protect quality and take responsibility for whether the work actually succeeds.",
    },
    {
      icon: "innovate",
      title: "Innovate with purpose",
      label: "INNOVATE",
      backTitle: "New is useful only when it helps.",
      text: "Explore emerging technology when it improves the product, the user experience or the way we work.",
    },
    {
      icon: "together",
      title: "Grow together",
      label: "GROW TOGETHER",
      backTitle: "Make each other better.",
      text: "Share what you know, give useful feedback and create space for teammates to stretch, contribute and grow.",
    },
    {
      icon: "done",
      title: "Get IT Done",
      label: "GET IT DONE",
      backTitle: "Turn possibility into something real.",
      text: "Good ideas matter. Delivering useful, working outcomes is what gives them value.",
      accent: true,
    },
  ] satisfies {
    icon: ValueIcon;
    title: string;
    label: string;
    backTitle: string;
    text: string;
    accent?: boolean;
  }[],
};

export const careersRoles = {
  heading: "Find your next challenge.",
  emptyText: "No open roles right now.",
  applyLabel: "View and apply",
};

// Q15: Life photo frames are off the page; the Sanity life-photo code and
// this copy stay for later (deferred-work.md).
export const careersLife = {
  heading: "Life at XionTech.",
  frames: [
    { slot: "team", placeholder: "[Placeholder] Team photo" },
    { slot: "office", placeholder: "[Placeholder] Office photo" },
    { slot: "event", placeholder: "[Placeholder] Event photo" },
  ] satisfies { slot: "team" | "office" | "event"; placeholder: string }[],
};
