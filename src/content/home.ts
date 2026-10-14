// Home page copy. Kept out of the components so it can be translated later.

import type { Stat } from "@/components/sections/stats-band";
import type { Localized } from "@/i18n/content";
import { aboutFaq, aboutFaqVi } from "@/content/about";
import { appById } from "@/content/apps";
import {
  journeyMap,
  journeyMapVi,
  productDetails,
  productDetailsVi,
} from "@/content/products";
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
const iot = appById("iot");
const aiTutor = appById("ai-tutor");

export const homeMeta = {
  title: "XionTech | School Platforms & Software Outsourcing in Vietnam",
};

export const homeHero = {
  // Three short beats, one a line, ending on the slogan (lead, 2026-10-12).
  title: {
    lines: ["Build smarter.", "Ship faster."],
    highlight: "Get IT done",
    tail: ".",
  },
  sub: "Connected school and campus solutions, software products and dedicated teams, from people who lead the way in AI-assisted development.",
  motion: { pause: "Pause motion", play: "Play motion" },
  // The contact section on this page (E-A4).
  cta: { href: "#contact", label: "Get in touch" },
};

export const homeMetaVi: typeof homeMeta = {
  title: "XionTech | Nền tảng trường học và gia công phần mềm tại Việt Nam",
};

export const homeHeroVi: Localized<typeof homeHero> = {
  title: {
    lines: ["Xây dựng thông minh hơn.", "Phát hành nhanh hơn."],
    highlight: "Get IT done",
    tail: ".",
  },
  sub: "Giải pháp kết nối cho trường học và khuôn viên, sản phẩm phần mềm và đội ngũ chuyên trách, từ những người đi đầu trong phát triển phần mềm có AI hỗ trợ.",
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
    badges: [parentHub, staffHub, iot],
    title: "Products for schools",
    line: "Connected apps for parents, students, teachers, leaders and school staff.",
    chips: [
      parentHub.shortName,
      staffHub.shortName,
      iot.shortName,
      aiTutor.shortName,
    ],
  },
  services: {
    href: "/services",
    label: "Outsourcing services",
    title: "Your software delivery team",
    line: "Dedicated teams and end-to-end delivery for companies building digital products.",
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
    title: "Sản phẩm cho trường học",
    line: "Ứng dụng kết nối cho phụ huynh, học sinh, giáo viên, lãnh đạo và nhân viên nhà trường.",
  },
  services: {
    ...homeDoors.services,
    label: "Dịch vụ outsourcing",
    title: "Đội ngũ phát triển phần mềm của bạn",
    line: "Đội ngũ chuyên trách và phát triển trọn gói cho doanh nghiệp xây dựng sản phẩm số.",
    // Service names stay English (2026-10-13); only "+3 more" is translated.
    chips: [...homeDoors.services.chips.slice(0, -1), "+3 dịch vụ"],
  },
};

// "Why XionTech." (was Capabilities): the products and services cards left,
// because the two doors above already say the same (lead, 2026-10-11).
export const homeCapabilities = {
  title: "Why XionTech.",
  lede: "The capabilities behind every school app and every product we deliver, and a team that keeps finding smarter ways to build with AI.",
  delivery: {
    label: "Global delivery",
    title: "Two headquarters, one working day.",
    line: "Teams across time zones keep delivery moving with practical overlap.",
  },
  industries: {
    label: "Domain expertise",
    title: "Deep in education. Built to adapt.",
    line: "Education is where we go deepest, while the same engineering capability supports other industries too.",
    main: "Education",
    // Confirmed on the About page (src/content/about.ts), not placeholders.
    more: ["Healthcare", "Logistics", "Private Equity"] as const,
    moreLabel: "+3 more industries: Healthcare, Logistics and Private Equity",
  },
  motto: {
    lead: "Get IT Done",
    title: "Built with ownership.",
    line: "Ownership of our commitments and pride in quality.",
  },
};

export const homeCapabilitiesVi: Localized<typeof homeCapabilities> = {
  title: "Vì sao chọn XionTech.",
  lede: "Năng lực đứng sau mỗi ứng dụng trường học và mỗi sản phẩm chúng tôi bàn giao, cùng một đội ngũ không ngừng tìm cách thông minh hơn để xây dựng với AI.",
  delivery: {
    label: "Triển khai toàn cầu",
    title: "Hai trụ sở chính, một ngày làm việc.",
    line: "Các đội ngũ ở nhiều múi giờ giữ tiến độ liên tục với thời gian làm việc chung hợp lý.",
  },
  industries: {
    label: "Chuyên môn lĩnh vực",
    title: "Chuyên sâu về giáo dục. Sẵn sàng thích ứng.",
    line: "Giáo dục là lĩnh vực chúng tôi chuyên sâu nhất, trong khi cùng năng lực kỹ thuật đó hỗ trợ cả các ngành khác.",
    main: "Giáo dục",
    more: ["Y tế", "Logistics", "Quỹ đầu tư tư nhân"],
    moreLabel: "Thêm 3 lĩnh vực: Y tế, Logistics và Quỹ đầu tư tư nhân",
  },
  motto: {
    lead: "Get IT Done",
    title: "Làm với tinh thần làm chủ.",
    line: "Làm chủ cam kết và tự hào về chất lượng.",
  },
};

export const homeProcess = {
  title: "How we work.",
  lede: "Our 4-D process (Discovery, Design, Development, Deployment) takes your idea to launch, and every step ends with something you can see and approve. AI runs through every step, and we keep improving how we use it.",
  link: { href: "/services#process", label: "See the full process" },
};

export const homeProcessVi: Localized<typeof homeProcess> = {
  title: "Cách chúng tôi làm việc.",
  lede: "Quy trình 4-D của chúng tôi (Khám phá, Thiết kế, Phát triển, Triển khai) đưa ý tưởng của bạn đến ngày ra mắt, và mỗi bước kết thúc bằng kết quả bạn có thể xem và phê duyệt. AI có mặt trong mọi bước, và chúng tôi không ngừng cải thiện cách sử dụng nó.",
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

// "One connected school.": each app with who it is for and its first two
// features, from the Products page. AI Tutor's tagline is still a
// placeholder, so the cards do not use taglines.
export const homeApps = {
  title: "One connected school.",
  lede: journeyMap.intro.lede,
  apps: [parentHub, staffHub, iot, aiTutor].map((app) => ({
    app,
    href: `/products#${app.anchor}`,
    madeFor: productDetails[app.id].madeFor,
    features: productDetails[app.id].features
      .slice(0, 2)
      .map((feature) => feature.title),
  })),
  link: { href: "/products", label: "Explore products" },
};

// The lede, "made for" lines and features come from products.ts in Vietnamese.
export const homeAppsVi: typeof homeApps = {
  title: "Một ngôi trường kết nối.",
  lede: journeyMapVi.intro.lede,
  apps: homeApps.apps.map((card) => ({
    ...card,
    madeFor: productDetailsVi[card.app.id].madeFor,
    features: productDetailsVi[card.app.id].features
      .slice(0, 2)
      .map((feature) => feature.title),
  })),
  link: { href: homeApps.link.href, label: "Khám phá sản phẩm" },
};

// "Your questions, answered.": four About answers, one for schools, two for
// companies and one on working together; the rest are on About.
const HOME_FAQ_IDS = new Set(["try-apps", "time-zones", "results", "feedback"]);

export const homeFaq = {
  title: "Your questions, answered.",
  lede: aboutFaq.lede,
  items: aboutFaq.items.filter((item) => HOME_FAQ_IDS.has(item.id)),
  link: { href: "/about#faq", label: "See all questions" },
};

// The lede and answers come from about.ts in Vietnamese.
export const homeFaqVi: typeof homeFaq = {
  title: "Giải đáp thắc mắc của bạn.",
  lede: aboutFaqVi.lede,
  items: aboutFaqVi.items.filter((item) => HOME_FAQ_IDS.has(item.id)),
  link: { href: homeFaq.link.href, label: "Xem tất cả câu hỏi" },
};
