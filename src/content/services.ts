import { hcmc, plano } from "@/content/offices";
import {
  processFlow,
  type ProcessFlowContent,
  type ProcessStep,
} from "@/content/process";
import { homeProcess, homeStats } from "@/content/home";

// Services page copy. Kept out of the components so it can be translated later.

export const servicesMeta = {
  title: "Services | XionTech",
  description:
    "Dedicated teams and end-to-end software delivery from Ho Chi Minh City: product engineering, AI, low-code and cloud, across USA, Europe and Australia time zones.",
};

export const servicesPage = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Services",
  title: {
    lead: "Software teams that ",
    highlight: "get IT done",
    tail: ".",
  },
  lede: "Product engineering, AI, low-code and cloud delivery from Ho Chi Minh City, working across USA, Europe and Australia time zones.",
  primaryCta: {
    href: "/demo#project",
    label: "Start a project",
  },
  secondaryCta: {
    href: "#process",
    label: "See our 4-D process",
  },
  clockStripLabel: "Office local times",
  // Strip order: Ho Chi Minh City first.
  clockCities: [
    { office: hcmc, city: "Ho Chi Minh City" },
    { office: plano, city: "Plano" },
  ],
};

export const servicesStats = {
  ariaLabel: "Key facts",
  stats: homeStats.stats,
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

// Services #process: the shared 4-D flow with the prototype's Services step
// lines, keyed by step number so a reordered or added step cannot pick up
// another step's copy. Only Discovery's "You receive" differs from Home; the
// icons, the other "You receive" lines and the start and end nodes stay shared.
export const servicesStepCopy: Record<
  string,
  Partial<Pick<ProcessStep, "line" | "receive">>
> = {
  "01": {
    line: "Workshops to understand your goals, users, risks and scope.",
    receive: "A clear scope, estimate and delivery plan.",
  },
  "02": {
    line: "User flows, interfaces and architecture agreed before code is written.",
  },
  "03": {
    line: "Agile sprints with regular demos, testing and open progress updates.",
  },
  "04": {
    line: "A safe release, monitoring and improvement after launch.",
  },
};

export const servicesProcess: {
  label: string;
  title: string;
  lede: string;
  flow: ProcessFlowContent;
} = {
  label: "Our 4-D process",
  title: homeProcess.title,
  lede: "Every step ends with something you can see, test and approve.",
  flow: {
    ...processFlow,
    steps: processFlow.steps.map((step) => ({
      ...step,
      ...servicesStepCopy[step.num],
    })),
  },
};
