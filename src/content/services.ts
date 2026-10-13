import type { Localized } from "@/i18n/content";
import {
  processFlow,
  processFlowVi,
  type ProcessFlowContent,
} from "@/content/process";

// Services page copy. Kept out of the components so it can be translated later.

export const servicesMeta = {
  title:
    "Software Outsourcing Vietnam | Product Engineering, AI, Low-code & Cloud | XionTech",
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

// Vietnamese. Service names and tags stay English (2026-10-13); ids and the
// process icons are shared with English.
export const servicesMetaVi: typeof servicesMeta = {
  title:
    "Outsourcing phần mềm tại Việt Nam | Product Engineering, AI, Low-code & Cloud | XionTech",
  description:
    "Đội ngũ chuyên trách và phát triển phần mềm trọn gói từ TP. Hồ Chí Minh: phát triển sản phẩm, AI, low-code và cloud, theo múi giờ Mỹ, Châu Âu và Úc.",
};

export const servicesPageVi: typeof servicesPage = {
  title: {
    lead: "Đội ngũ phần mềm ",
    highlight: "luôn hoàn thành cam kết",
    tail: ".",
  },
  lede: "Phát triển sản phẩm, AI, low-code và cloud từ TP. Hồ Chí Minh, làm việc theo múi giờ Mỹ, Châu Âu và Úc. Chúng tôi làm việc thông minh hơn với AI và không ngừng đổi mới cách triển khai.",
  primaryCta: { ...servicesPage.primaryCta, label: "Bắt đầu dự án" },
};

export const servicesSectionVi: Localized<typeof servicesSection> = {
  title: "Tám dịch vụ, một đội ngũ.",
  lede: "Chọn một dịch vụ hoặc kết hợp nhiều dịch vụ. Chúng tôi điều chỉnh theo sản phẩm của bạn.",
  services: [
    {
      ...servicesSection.services[0],
      description:
        "Biến ý tưởng sáng tạo thành sản phẩm số sẵn sàng ra thị trường với năng lực kỹ thuật toàn diện.",
    },
    {
      ...servicesSection.services[1],
      description:
        "Biến dữ liệu thô thành thông tin hữu ích bằng AI và trực quan hóa nâng cao.",
    },
    {
      ...servicesSection.services[2],
      description:
        "Tăng tốc đổi mới bằng cách kết hợp chuyên môn của bạn với năng lực kỹ thuật của chúng tôi.",
    },
    {
      ...servicesSection.services[3],
      description:
        "Tiếp cận nhân sự công nghệ chuyên sâu khi cần, với giải pháp linh hoạt.",
    },
    {
      ...servicesSection.services[4],
      description: "Phát triển giải pháp theo đúng yêu cầu riêng của bạn.",
    },
    {
      ...servicesSection.services[5],
      description:
        "Ra mắt công cụ và tự động hóa nhanh hơn trên các nền tảng low-code hàng đầu.",
    },
    {
      ...servicesSection.services[6],
      description: "Khai thác trí tuệ nhân tạo để chuyển đổi vận hành.",
    },
    {
      ...servicesSection.services[7],
      description: "Giải pháp chuyên sâu trên Azure, AWS và GCP.",
    },
  ],
};

export const servicesOutcomesVi: Localized<typeof servicesOutcomes> = {
  title: "Chúng tôi có thể giúp bạn đạt được điều gì?",
  items: [
    {
      id: servicesOutcomes.items[0].id,
      title: "Xây dựng sản phẩm số mới",
      description:
        "Đi từ khám phá và UX đến kỹ thuật, kiểm thử và ra mắt với một đội triển khai duy nhất.",
    },
    {
      id: servicesOutcomes.items[1].id,
      title: "Mở rộng đội ngũ",
      description:
        "Bổ sung nhân sự công nghệ chuyên sâu khi đội ngũ nội bộ cần thêm năng lực hoặc kỹ năng cụ thể.",
    },
    {
      id: servicesOutcomes.items[2].id,
      title: "Hiện đại hóa nền tảng hiện có",
      description:
        "Cải thiện ứng dụng, hạ tầng, triển khai cloud và quy trình kỹ thuật mà vẫn giữ vững những gì đang vận hành tốt.",
    },
    {
      id: servicesOutcomes.items[3].id,
      title: "Ứng dụng AI ở nơi tạo ra giá trị",
      description:
        "Dùng AI, phân tích dữ liệu và tự động hóa để cải thiện sản phẩm, quy trình và việc ra quyết định kinh doanh.",
    },
  ],
};

export const servicesProcessVi: typeof servicesProcess = {
  title: "Quy trình 4-D: từ yêu cầu của bạn đến ngày ra mắt.",
  lede: "Mỗi bước kết thúc bằng một kết quả bạn có thể xem, kiểm tra và phê duyệt. AI đồng hành trong mọi bước, và chúng tôi không ngừng cải thiện cách sử dụng AI.",
  flow: processFlowVi,
};
