// Home page copy. Kept out of the components so it can be translated later.

import type { Stat } from "@/components/sections/stats-band";
import type { Localized } from "@/i18n/content";
import { appById } from "@/content/apps";
import { productDetails, productDetailsVi } from "@/content/products";
import {
  servicesOutcomes,
  servicesOutcomesVi,
  servicesPage,
  servicesPageVi,
  servicesSection,
  servicesSectionVi,
} from "@/content/services";

// App names and badges come from apps.ts (E-A2), the one source for them.
const parentHub = appById("parent-hub");
const staffHub = appById("staff-hub");
const aiTutor = appById("ai-tutor");

export const homeMeta = {
  title: "XionTech | School Platforms & Software Outsourcing in Vietnam",
  description:
    "XionTech builds AI-powered products and custom solutions: school platforms (Parent Hub, Staff Hub, AI Tutor) and software outsourcing from Vietnam.",
};

export const homeHero = {
  // Three short beats, one a line, ending on the slogan (lead, 2026-10-12).
  title: {
    lines: ["Build smarter.", "Ship faster."],
    highlight: "Get IT done",
    tail: "",
  },
  sub: "XionTech builds AI-powered products and custom solutions, combining real-world expertise with modern technology to solve business challenges.",
  motion: { pause: "Pause motion", play: "Play motion" },
  // The contact section on this page (E-A4).
  cta: { href: "#contact", label: "Get in touch" },
};

export const homeMetaVi: typeof homeMeta = {
  title: "XionTech | Nền tảng trường học và gia công phần mềm tại Việt Nam",
  description:
    "XionTech xây dựng các sản phẩm ứng dụng AI và giải pháp theo yêu cầu: nền tảng trường học (Parent Hub, Staff Hub, AI Tutor) và gia công phần mềm từ Việt Nam.",
};

export const homeHeroVi: Localized<typeof homeHero> = {
  title: {
    lines: ["Xây dựng thông minh hơn.", "Phát hành nhanh hơn."],
    highlight: "Get IT done",
    tail: "",
  },
  sub: "XionTech xây dựng các sản phẩm ứng dụng AI và giải pháp theo yêu cầu, kết hợp kinh nghiệm thực tiễn với công nghệ hiện đại để giải quyết các bài toán kinh doanh.",
  motion: { pause: "Tạm dừng chuyển động", play: "Phát chuyển động" },
  cta: { href: homeHero.cta.href, label: "Liên hệ với chúng tôi" },
};

// Figures confirmed by the business on 2026-09-28 (FR-12). Only the two key
// figures count up (lead, 2026-10-11).
export const homeStats: { label: string; stats: Stat[] } = {
  label: "Experience you can count on",
  stats: [
    {
      value: "25",
      suffix: "+",
      caption: "Years of leadership experience in software",
      count: true,
    },
    { value: "24", suffix: "/7", caption: "Global coverage across time zones" },
    {
      value: "20",
      suffix: "+",
      caption: "Technology stacks we work in",
      count: true,
    },
    { value: "8", caption: "Service offerings, from idea to operation" },
    // Four locations, two of them headquarters (lead, 2026-10-12).
    { value: "4", caption: "Locations: HQs in Plano and Ho Chi Minh City" },
  ],
};

export const statCaptionsViList = [
  "Năm kinh nghiệm lãnh đạo trong ngành phần mềm",
  "Hỗ trợ toàn cầu qua các múi giờ",
  "Nền tảng công nghệ chúng tôi làm việc",
  "Dịch vụ, từ ý tưởng đến vận hành",
  "Địa điểm: trụ sở chính tại Plano và TP. Hồ Chí Minh",
];

export const homeStatsVi: { label: string; stats: Stat[] } = {
  label: "Kinh nghiệm bạn có thể tin cậy",
  stats: homeStats.stats.map((stat, index) => ({
    ...stat,
    caption: statCaptionsViList[index],
  })),
};

export const homeDoors = {
  label: "What we do",
  products: {
    href: "/products",
    badges: [parentHub, staffHub, aiTutor],
    label: "Products for schools",
    title: "Platforms in one ecosystem",
    line: "An integrated, AI-powered ecosystem that enhances learning, simplifies school administration and keeps students engaged",
    chips: [parentHub.shortName, staffHub.shortName, aiTutor.shortName],
  },
  services: {
    href: "/services",
    label: "Outsourcing services",
    title: "Custom software for your business",
    line: "Work with our dedicated teams on custom software. We shape each team around your product and work with you from discovery through launch and support.",
    chips: [
      "Product Engineering",
      "AI-Driven Analytics",
      "Staffing",
      "Low-code",
      "Cloud",
      "+3 more",
    ],
  },
};

export const homeDoorsVi: typeof homeDoors = {
  label: "Chúng tôi làm gì",
  products: {
    ...homeDoors.products,
    label: "Sản phẩm cho trường học",
    title: "Các nền tảng trong một hệ sinh thái",
    line: "Một hệ sinh thái tích hợp, ứng dụng AI, giúp nâng cao việc học, đơn giản hóa công tác quản lý nhà trường và giữ học sinh luôn hứng thú",
  },
  services: {
    ...homeDoors.services,
    label: "Dịch vụ outsourcing",
    title: "Phần mềm theo yêu cầu cho doanh nghiệp của bạn",
    line: "Làm việc cùng đội ngũ chuyên trách của chúng tôi để xây dựng phần mềm theo yêu cầu. Chúng tôi xây dựng từng đội ngũ xoay quanh sản phẩm của bạn và đồng hành từ khâu khám phá đến khi ra mắt và hỗ trợ sau đó.",
    // Service names stay English (2026-10-13); only "+3 more" is translated.
    chips: [...homeDoors.services.chips.slice(0, -1), "+3 dịch vụ"],
  },
};

// "Why XionTech" (was Capabilities): the products and services cards left,
// because the two doors above already say the same (lead, 2026-10-11).
export const homeCapabilities = {
  title: "Why XionTech",
  lede: "We build products ourselves and bring that hands-on experience to our clients, combining industry discovery, engineering ownership, and AI-assisted development.",
  delivery: {
    label: "Global delivery",
    title: "Two headquarters, one working day",
    line: "Teams across time zones keep delivery moving with practical overlap.",
  },
  industries: {
    label: "Domain expertise",
    title: "Start with education. Built to adapt",
    line: "Our experience building education technology provides a strong foundation for developing tailored solutions across industries.",
    main: "Education",
    // Confirmed on the About page (src/content/about.ts), not placeholders.
    more: ["Healthcare", "Logistics", "Private Equity"] as const,
    moreLabel: "+3 more industries: Healthcare, Logistics and Private Equity",
  },
  motto: {
    lead: "Get IT Done",
    title: "Built with ownership, from the first idea to delivery.",
    line: "",
  },
};

export const homeCapabilitiesVi: Localized<typeof homeCapabilities> = {
  title: "Vì sao chọn XionTech",
  lede: "Chúng tôi tự xây dựng sản phẩm và mang chính kinh nghiệm thực tế đó đến với khách hàng, kết hợp khám phá nghiệp vụ, làm chủ kỹ thuật và phát triển có AI hỗ trợ.",
  delivery: {
    label: "Triển khai toàn cầu",
    title: "Hai trụ sở chính, một ngày làm việc",
    line: "Các đội ngũ ở nhiều múi giờ giữ tiến độ liên tục với thời gian làm việc chung hợp lý.",
  },
  industries: {
    label: "Chuyên môn lĩnh vực",
    title: "Khởi đầu từ giáo dục. Sẵn sàng thích ứng",
    line: "Kinh nghiệm xây dựng công nghệ giáo dục là nền tảng vững chắc để chúng tôi phát triển các giải pháp phù hợp cho nhiều ngành khác nhau.",
    main: "Giáo dục",
    more: ["Y tế", "Logistics", "Quỹ đầu tư tư nhân"],
    moreLabel: "Thêm 3 lĩnh vực: Y tế, Logistics và Quỹ đầu tư tư nhân",
  },
  motto: {
    lead: "Get IT Done",
    title: "Làm với tinh thần làm chủ, từ ý tưởng đầu tiên đến khi bàn giao.",
    line: "",
  },
};

export const homeProcess = {
  title: "How we work",
  lede: "From idea to launch, our 4-D process brings clarity, collaboration, and measurable progress to every stage. With AI-assisted workflows and clear deliverables, you stay involved from start to finish.",
  link: { href: "/services#process", label: "See the full process" },
};

export const homeProcessVi: Localized<typeof homeProcess> = {
  title: "Cách chúng tôi làm việc",
  lede: "Từ ý tưởng đến ngày ra mắt, quy trình 4-D của chúng tôi mang lại sự rõ ràng, phối hợp chặt chẽ và tiến độ đo lường được ở mọi giai đoạn. Với quy trình làm việc có AI hỗ trợ và kết quả bàn giao rõ ràng, bạn luôn được tham gia từ đầu đến cuối.",
  link: { href: homeProcess.link.href, label: "Xem toàn bộ quy trình" },
};

// "What can we help you achieve?": the four outcomes and the lede from the
// Services page; "Start a project" (the Services call to action) goes to the
// contact section on this page.
export const homeOutcomes = {
  title: servicesOutcomes.title,
  lede: servicesSection.lede,
  items: servicesOutcomes.items,
  cta: { href: "#contact", label: servicesPage.primaryCta.label },
  link: { href: "/services", label: "Explore services" },
};

// The outcomes, lede and "Start a project" come from services.ts in Vietnamese.
export const homeOutcomesVi: Localized<typeof homeOutcomes> = {
  title: servicesOutcomesVi.title,
  lede: servicesSectionVi.lede,
  items: servicesOutcomesVi.items,
  cta: { href: homeOutcomes.cta.href, label: servicesPageVi.primaryCta.label },
  link: { href: homeOutcomes.link.href, label: "Khám phá dịch vụ" },
};

// "One connected school": each app with who it is for and its first two
// features, from the Products page. AI Tutor's tagline is still a
// placeholder, so the cards do not use taglines.
export const homeApps = {
  title: "One connected school",
  lede: "Bring your entire school community together with connected solutions for parents, staff and students; all designed to simplify everyday school management.",
  apps: [parentHub, staffHub, aiTutor].map((app) => ({
    app,
    href: `/products#${app.anchor}`,
    madeFor: productDetails[app.id].madeFor,
    features: productDetails[app.id].features
      .slice(0, 2)
      .map((feature) => feature.title),
  })),
  link: { href: "/products", label: "Explore products" },
};

// The "made for" lines and features come from products.ts in Vietnamese.
export const homeAppsVi: typeof homeApps = {
  title: "Một ngôi trường kết nối",
  lede: "Gắn kết toàn bộ cộng đồng nhà trường với các giải pháp kết nối dành cho phụ huynh, nhân viên và học sinh; tất cả được thiết kế để đơn giản hóa công tác quản lý trường học hằng ngày.",
  apps: homeApps.apps.map((card) => ({
    ...card,
    madeFor: productDetailsVi[card.app.id].madeFor,
    features: productDetailsVi[card.app.id].features
      .slice(0, 2)
      .map((feature) => feature.title),
  })),
  link: { href: homeApps.link.href, label: "Khám phá sản phẩm" },
};

// "Before you reach out": four answers, one for schools, two for
// companies and one on working together. Kept here since About has its own
// six-question set (website copy v3).
export const homeFaq = {
  title: "Before you reach out",
  lede: "Straight answers about our products, our services and how we work.",
  items: [
    {
      id: "try-apps",
      question: "How can our school try Parent Hub or Staff Hub?",
      answer:
        "Leave your work email on the Products page and we walk you through the apps using scenarios from your own school.",
    },
    {
      id: "time-zones",
      question: "How do you work across time zones?",
      answer:
        "Our teams in Plano, Ho Chi Minh City, Ha Noi and Da Nang cover USA, Europe and Australia time zones, with shared tools for real-time updates.",
    },
    {
      id: "results",
      question: "What results can we expect?",
      answer:
        "Cost-efficient delivery by skilled Vietnamese engineers, on-time releases and measurable results that support your growth.",
    },
    {
      id: "feedback",
      question: "How do we give feedback during a project?",
      answer:
        "Through dedicated channels, frequent check-ins and agile sprints, so your input shapes the product all the way through.",
    },
  ],
  link: { href: "/about#faq", label: "See all questions" },
};

export const homeFaqVi: typeof homeFaq = {
  title: "Trước khi bạn liên hệ",
  lede: "Câu trả lời thẳng thắn về sản phẩm, dịch vụ và cách chúng tôi làm việc.",
  items: [
    {
      id: "try-apps",
      question:
        "Trường chúng tôi có thể dùng thử Parent Hub hoặc Staff Hub bằng cách nào?",
      answer:
        "Hãy để lại email công việc trên trang Sản phẩm, chúng tôi sẽ giới thiệu các ứng dụng qua những tình huống từ chính trường của bạn.",
    },
    {
      id: "time-zones",
      question: "Các bạn làm việc qua nhiều múi giờ như thế nào?",
      answer:
        "Các đội ngũ của chúng tôi tại Plano, TP. Hồ Chí Minh, Hà Nội và Đà Nẵng hỗ trợ các múi giờ Mỹ, châu Âu và Úc, với công cụ chung để cập nhật theo thời gian thực.",
    },
    {
      id: "results",
      question: "Chúng tôi có thể kỳ vọng kết quả gì?",
      answer:
        "Triển khai tiết kiệm chi phí bởi đội ngũ kỹ sư Việt Nam giàu kinh nghiệm, phát hành đúng hạn và kết quả đo lường được, hỗ trợ sự phát triển của bạn.",
    },
    {
      id: "feedback",
      question: "Chúng tôi góp ý trong suốt dự án bằng cách nào?",
      answer:
        "Qua các kênh trao đổi riêng, các buổi cập nhật thường xuyên và sprint linh hoạt, để ý kiến của bạn định hình sản phẩm xuyên suốt quá trình.",
    },
  ],
  link: { href: homeFaq.link.href, label: "Xem tất cả câu hỏi" },
};
