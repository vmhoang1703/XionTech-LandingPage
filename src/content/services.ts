import { processFlow, type ProcessFlowContent } from "@/content/process";

// Services page copy. Kept out of the components so it can be translated later.

export const servicesMeta = {
  title:
    "Software Outsourcing Vietnam | Product Engineering, AI, Low-code & Cloud | XionTechs",
  description:
    "Dedicated teams and end-to-end software delivery from Ho Chi Minh City: product engineering, AI, low-code and cloud, across USA, Europe and Australia time zones.",
};

export const servicesPage = {
  title: {
    lead: "Software teams that ",
    highlight: "get IT done",
    tail: ".",
  },
  lede: "Product engineering, AI, low-code and cloud delivery from Ho Chi Minh City, working across USA, Europe and Australia time zones. We work smarter with AI and keep innovating how we deliver.",
  primaryCta: {
    href: "/demo#project",
    label: "Start a project",
  },
};

export const servicesSection = {
  title: "Eight services, one team.",
  lede: "Pick one service or combine several. We shape the team around your product.",
  services: [
    {
      id: "product-engineering" as const,
      name: "Product Engineering",
      description:
        "Transform innovative ideas into market-ready digital products with end-to-end engineering expertise.",
      tags: ["Web", "Mobile"],
    },
    {
      id: "ai-analytics" as const,
      name: "AI-Driven Analytics",
      description:
        "Transform raw data into actionable intelligence using AI and advanced visualisation.",
      tags: ["AI/ML", "Dashboards"],
    },
    {
      id: "co-creation" as const,
      name: "Product Co-Creation",
      description:
        "Accelerate innovation by combining your domain knowledge with our technical expertise.",
    },
    {
      id: "staffing" as const,
      name: "Staffing Service",
      description:
        "Access specialised technology talent when you need it, with flexible options.",
    },
    {
      id: "custom-apps" as const,
      name: "Custom App Development",
      description:
        "Develop custom solutions aligned with your unique requirements.",
    },
    {
      id: "low-code" as const,
      name: "Low-code Solutions",
      description:
        "Ship tools and automations faster on leading low-code platforms.",
      tags: ["Power Platform", "Make", "n8n", "Retool", "Bubble"],
    },
    {
      id: "ai-solutions" as const,
      name: "AI-Powered Solutions",
      description:
        "Harness artificial intelligence to transform your operations.",
      tags: ["Generative AI", "AI/ML"],
    },
    {
      id: "cloud" as const,
      name: "Cloud Computing",
      description: "Expert solutions on Azure, AWS and GCP.",
      tags: ["Azure", "AWS", "GCP"],
    },
  ],
} as const;

export const servicesOutcomes = {
  title: "What can we help you achieve?",
  items: [
    {
      id: "build",
      title: "Build a new digital product",
      description:
        "Move from discovery and UX into engineering, testing and launch with one delivery team.",
    },
    {
      id: "extend",
      title: "Extend your team",
      description:
        "Add specialised technology talent when your internal team needs more capacity or specific skills.",
    },
    {
      id: "modernise",
      title: "Modernise an existing platform",
      description:
        "Improve applications, infrastructure, cloud delivery and engineering practices while protecting what already works.",
    },
    {
      id: "apply-ai",
      title: "Apply AI where it creates value",
      description:
        "Use AI, analytics and automation to improve products, workflows and business decision-making.",
    },
  ],
} as const;

export const servicesProcess: {
  title: string;
  lede: string;
  flow: ProcessFlowContent;
} = {
  title: "Our 4-D process: from your request to launch.",
  lede: "Every step ends with something you can see, test and approve. AI runs through every step, and we keep improving how we use it.",
  flow: processFlow,
};
