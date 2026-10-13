import {
  HandshakeIcon,
  LightbulbFilamentIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  TargetIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { Localized } from "@/i18n/content";

// Core values, shown on Home (the About page dropped them in E-S3). Each
// card shows the short line, written from the full text, and flips over to
// the full text (lead, 2026-10-11).

type AboutValue = {
  icon: Icon;
  title: string;
  short: string;
  text: string;
  featured?: boolean;
};

export const aboutValues: {
  items: AboutValue[];
} = {
  items: [
    {
      icon: RocketLaunchIcon,
      title: "Startup Spirit",
      short: "Agile, resilient and always improving.",
      text: "Embody an entrepreneurial mindset, embracing agility, flexibility, and a passion for innovation. Our commitment to excellence is driven by resilience and a culture of continuous improvement.",
    },
    {
      icon: HandshakeIcon,
      title: "Client Centricity",
      short: "Clients at the heart of everything we do.",
      text: "Clients are at the heart of everything we do. We strive to deliver exceptional experiences and impactful outcomes through deep understanding, proactive engagement, and tailored solutions.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Integrity First",
      short: "Honest, transparent and accountable.",
      text: "Operate with honesty, transparency, and accountability. Ethical standards guide every decision and interaction, fostering trust and long-term relationships.",
    },
    {
      icon: LightbulbFilamentIcon,
      title: "Innovation Driven",
      short: "Exploring new technology to stay ahead.",
      text: "Passionate about exploring emerging technologies and creative approaches. Innovation is embedded in our DNA, enabling us to evolve our solutions and stay ahead of industry trends.",
    },
    {
      icon: TargetIcon,
      title: '"Get IT Done" Attitude',
      short: "We own our commitments and deliver.",
      text: "Take ownership of our commitments and deliver high-quality, reliable, and efficient solutions. Our team is driven by accountability and a results-oriented mindset that meets or exceeds industry standards.",
      featured: true,
    },
    {
      icon: UsersThreeIcon,
      title: "People-Centered Culture",
      short: "Every team member valued, supported and empowered.",
      text: "Cultivate a workplace where every team member feels valued, supported, and empowered. Our culture goes beyond employment: it's about belonging, collaboration, and shared success.",
    },
  ],
};

export const homeValuesHeading = {
  title: "Our core values.",
  lede: "What guides how we work. Flip a card to read each value in full.",
  // Same words as the Careers flip cards.
  frontHint: "Flip for details",
  backHint: "Flip back",
};

const VALUES_VI: Pick<AboutValue, "title" | "short" | "text">[] = [
  {
    title: "Tinh thần khởi nghiệp",
    short: "Nhanh nhạy, bền bỉ và không ngừng cải tiến.",
    text: "Mang tư duy khởi nghiệp, đề cao sự nhanh nhạy, linh hoạt và niềm đam mê đổi mới. Cam kết hướng tới sự xuất sắc được thúc đẩy bởi sự bền bỉ và văn hóa cải tiến liên tục.",
  },
  {
    title: "Khách hàng là trọng tâm",
    short: "Khách hàng là trọng tâm của mọi việc chúng tôi làm.",
    text: "Khách hàng là trọng tâm của mọi việc chúng tôi làm. Chúng tôi mang đến trải nghiệm vượt trội và kết quả thiết thực nhờ thấu hiểu sâu sắc, chủ động gắn kết và giải pháp phù hợp.",
  },
  {
    title: "Chính trực là trên hết",
    short: "Trung thực, minh bạch và có trách nhiệm.",
    text: "Làm việc trung thực, minh bạch và có trách nhiệm. Chuẩn mực đạo đức dẫn dắt mọi quyết định và tương tác, xây dựng niềm tin và quan hệ lâu dài.",
  },
  {
    title: "Tiên phong đổi mới",
    short: "Khám phá công nghệ mới để luôn đi trước.",
    text: "Đam mê khám phá công nghệ mới và những cách tiếp cận sáng tạo. Đổi mới nằm trong DNA của chúng tôi, giúp giải pháp luôn phát triển và đi trước xu hướng.",
  },
  {
    title: 'Tinh thần "Get IT Done"',
    short: "Chúng tôi làm chủ cam kết và hoàn thành.",
    text: "Làm chủ cam kết và mang đến giải pháp chất lượng cao, tin cậy và hiệu quả. Đội ngũ được thúc đẩy bởi tinh thần trách nhiệm và tư duy hướng kết quả, đáp ứng hoặc vượt chuẩn ngành.",
  },
  {
    title: "Văn hoá lấy con người làm trọng tâm",
    short: "Mỗi thành viên đều được trân trọng, hỗ trợ và trao quyền.",
    text: "Xây dựng môi trường nơi mỗi thành viên đều được trân trọng, hỗ trợ và trao quyền. Văn hoá của chúng tôi vượt ra ngoài công việc: đó là sự gắn bó, hợp tác và thành công chung.",
  },
];

export const aboutValuesVi: typeof aboutValues = {
  items: aboutValues.items.map((item, index) => ({
    ...item,
    ...VALUES_VI[index],
  })),
};

export const homeValuesHeadingVi: Localized<typeof homeValuesHeading> = {
  title: "Giá trị cốt lõi.",
  lede: "Những điều dẫn dắt cách chúng tôi làm việc. Lật một thẻ để đọc đầy đủ từng giá trị.",
  frontHint: "Lật để xem chi tiết",
  backHint: "Lật lại",
};
