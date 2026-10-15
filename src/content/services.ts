import type { Localized } from "@/i18n/content";
import {
  processFlow,
  processFlowVi,
  type ProcessFlowContent,
} from "@/content/process";

// Services page copy. Kept out of the components so it can be translated later.

export const servicesMeta = {
  title: "Software Outsourcing Vietnam | XionTech",
  description:
    "Software outsourcing from Ho Chi Minh City: product engineering, AI-driven analytics, co-creation, staffing, custom apps, low-code, AI solutions and cloud.",
};

export const servicesPage = {
  title: {
    lead: "You bring your ",
    words: ["vision", "challenges", "ideas", "ambition", "goals"],
    // After the rotating word.
    suffix: ".",
    tail: ["We get ", "IT", " done"],
    // Static word for assistive tech and crawlers; the rotator is aria-hidden.
    staticWord: "vision.",
    label: "You bring your vision. We get IT done",
  },
  lede: "From digital products to AI integration and technology modernization, we bring the expertise to solve your challenges, accelerate innovation, and drive your business forward.",
  primaryCta: {
    href: "/#contact",
    label: "Let's build together",
  },
  secondaryCta: {
    href: "#services-all",
    label: "Explore our services",
  },
  // The hero illustration: its accessible name and the three plate labels.
  stack: {
    label:
      "Illustration: requirements, wireframe and technical code layers of a software build",
    requirements: "REQUIREMENTS",
    wireframe: "WIREFRAME",
    code: "TECHNICAL CODE",
  },
};

export const servicesSection = {
  title: "Eight services, one team",
  lede: "Pick one service or combine several. We shape the team around your product.",
  services: [
    {
      id: "product-engineering" as const,
      name: "Product Engineering",
      description:
        "Turn ideas into market-ready digital products, from concept to launch.",
    },
    {
      id: "ai-analytics" as const,
      name: "AI-Driven Analytics",
      description:
        "Turn complex data into actionable insights with AI and intuitive dashboards.",
    },
    {
      id: "co-creation" as const,
      name: "Product Co-Creation",
      description:
        "Bring your industry knowledge and our product expertise together to create solutions that matter.",
    },
    {
      id: "staffing" as const,
      name: "Staffing Services",
      description:
        "Get the right technology talent to support your projects and scale your team.",
    },
    {
      id: "custom-apps" as const,
      name: "Custom App Development",
      description:
        "Build tailored applications that fit your business needs and workflows.",
    },
    {
      id: "low-code" as const,
      name: "Low-Code Solutions",
      description:
        "Build applications and automate workflows faster with flexible low-code platforms.",
    },
    {
      id: "ai-solutions" as const,
      name: "AI-Powered Solutions",
      description:
        "Put AI to work with intelligent solutions that streamline processes and improve productivity.",
    },
    {
      id: "cloud" as const,
      name: "Cloud Computing",
      description:
        "Build, scale, and manage cloud solutions that support your growing business.",
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
        "Turn your idea into a market-ready product with end-to-end design, custom software development, testing, and launch support.",
    },
    {
      id: "extend",
      title: "Extend your team",
      description:
        "Add specialized technology talent when your internal team needs more capacity or specific skills.",
    },
    {
      id: "modernise",
      title: "Modernize an existing platform",
      description:
        "Improve applications, infrastructure, cloud delivery and engineering practices while protecting what already works.",
    },
    {
      id: "apply-ai",
      title: "Leverage AI to drive business value",
      description:
        "Build AI-powered solutions, automate workflows, and turn business data into actionable insights that support smarter decisions.",
    },
  ],
} as const;

export const servicesProcess: {
  title: string;
  lede: string;
  flow: ProcessFlowContent;
} = {
  title: "Our 4-D process: from your request to launch",
  lede: "Every step ends with something you can see, test and approve. AI runs through every step, and we keep improving how we use it.",
  flow: processFlow,
};

// Vietnamese. Service names stay English (2026-10-13); ids and the process
// icons are shared with English.
export const servicesMetaVi: typeof servicesMeta = {
  title: "Outsourcing phần mềm tại Việt Nam | XionTech",
  description:
    "Outsourcing phần mềm từ TP. Hồ Chí Minh: phát triển sản phẩm, phân tích dữ liệu bằng AI, đồng sáng tạo, cung cấp nhân sự, ứng dụng theo yêu cầu, low-code, giải pháp AI và cloud.",
};

export const servicesPageVi: Localized<typeof servicesPage> = {
  title: {
    lead: "Bạn mang đến ",
    words: ["tầm nhìn", "thử thách", "ý tưởng", "khát vọng", "mục tiêu"],
    suffix: ".",
    tail: ['Còn chúng tôi: "', "Get IT done", '"'],
    staticWord: "tầm nhìn.",
    label: 'Bạn mang đến tầm nhìn. Còn chúng tôi: "Get IT done"',
  },
  lede: "Từ sản phẩm số đến tích hợp AI và hiện đại hóa công nghệ, chúng tôi mang đến chuyên môn để giải quyết thử thách của bạn, thúc đẩy đổi mới và đưa doanh nghiệp của bạn tiến lên.",
  primaryCta: { ...servicesPage.primaryCta, label: "Cùng nhau xây dựng" },
  secondaryCta: {
    ...servicesPage.secondaryCta,
    label: "Khám phá dịch vụ của chúng tôi",
  },
  stack: {
    label:
      "Hình minh họa: các lớp yêu cầu, wireframe và mã kỹ thuật của một sản phẩm phần mềm",
    requirements: "YÊU CẦU",
    wireframe: "WIREFRAME",
    code: "MÃ KỸ THUẬT",
  },
};

export const servicesSectionVi: Localized<typeof servicesSection> = {
  title: "Tám dịch vụ, một đội ngũ",
  lede: "Chọn một dịch vụ hoặc kết hợp nhiều dịch vụ. Chúng tôi xây dựng đội ngũ xoay quanh sản phẩm của bạn.",
  services: [
    {
      ...servicesSection.services[0],
      description:
        "Biến ý tưởng thành sản phẩm số sẵn sàng ra thị trường, từ ý tưởng ban đầu đến ngày ra mắt.",
    },
    {
      ...servicesSection.services[1],
      description:
        "Biến dữ liệu phức tạp thành thông tin hữu ích với AI và các dashboard trực quan.",
    },
    {
      ...servicesSection.services[2],
      description:
        "Kết hợp hiểu biết ngành của bạn với chuyên môn sản phẩm của chúng tôi để tạo nên những giải pháp thực sự có giá trị.",
    },
    {
      ...servicesSection.services[3],
      description:
        "Có đúng nhân sự công nghệ để hỗ trợ dự án và mở rộng đội ngũ của bạn.",
    },
    {
      ...servicesSection.services[4],
      description:
        "Xây dựng ứng dụng riêng phù hợp với nhu cầu và quy trình làm việc của doanh nghiệp bạn.",
    },
    {
      ...servicesSection.services[5],
      description:
        "Xây dựng ứng dụng và tự động hóa quy trình nhanh hơn với các nền tảng low-code linh hoạt.",
    },
    {
      ...servicesSection.services[6],
      description:
        "Đưa AI vào công việc với các giải pháp thông minh giúp tinh gọn quy trình và nâng cao năng suất.",
    },
    {
      ...servicesSection.services[7],
      description:
        "Xây dựng, mở rộng và quản lý các giải pháp cloud hỗ trợ doanh nghiệp đang phát triển của bạn.",
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
        "Biến ý tưởng của bạn thành sản phẩm sẵn sàng ra thị trường với thiết kế trọn gói, phát triển phần mềm theo yêu cầu, kiểm thử và hỗ trợ ra mắt.",
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
      title: "Tận dụng AI để tạo giá trị kinh doanh",
      description:
        "Xây dựng giải pháp ứng dụng AI, tự động hóa quy trình và biến dữ liệu kinh doanh thành thông tin hữu ích, hỗ trợ ra quyết định thông minh hơn.",
    },
  ],
};

export const servicesProcessVi: typeof servicesProcess = {
  title: "Quy trình 4-D: từ yêu cầu của bạn đến ngày ra mắt",
  lede: "Mỗi bước kết thúc bằng một kết quả bạn có thể xem, kiểm tra và phê duyệt. AI đồng hành trong mọi bước, và chúng tôi không ngừng cải thiện cách sử dụng AI.",
  flow: processFlowVi,
};
