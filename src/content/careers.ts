// Careers page copy. Kept out of the components so it can be translated later.

import type { Localized } from "@/i18n/content";

export const careersMeta = {
  title: "Careers at XionTech | Software and AI jobs",
  description:
    "Join XionTech to solve real problems, explore AI and new technologies, and grow with a team that builds things that make a difference.",
};

export const careersHero = {
  title: { first: "Careers at", second: "XionTech" },
  lede: "We’re bringing together curious minds who love solving problems, exploring new technologies, and building things that make a difference.",
  prompt: "Ready to build with us?",
  artAlt:
    "Three stacked cards illustrating AI-powered engineering, a code chip and connected technology",
};

export const careersRoles = {
  heading: "Find your next challenge",
  emptyText: "No open roles right now.",
  applyLabel: "View and apply",
};

// "Meet the team at XionTech" (Amber's culture strip mock, 2026-10-15; renamed
// from "Life at XionTech"): heading, lede, interest tags and one looping photo
// strip. The photos are whatever images sit in public/careers/life/ (any
// filename, read by src/lib/careers/life-photo-folder.ts); every one shares
// the generic `photoAlt`, with no visible caption.
// Q15: the `frames` placeholders belong to the Sanity life-photo frames,
// which are off the page and stay for later (deferred-work.md).
export const careersLife = {
  heading: "Meet the team at XionTech",
  lede: "At XionTech, we take engineering seriously, but not ourselves. We ask questions, take ownership, and keep learning together. Off the clock, we bring the same team spirit to the court, the pitch, the karaoke mic, and the game lobby.",
  tagsLabel: "Our team interests",
  tags: [
    "Badminton regulars",
    "Football fans",
    "League of Legends squad",
    "Karaoke night crew",
    "After-work catch-ups",
    "Coffee lovers",
    "Otaku",
    "Guitarists",
    "AI explorers",
    "Movie buffs",
    "...and you?",
  ],
  stripLabel: "Photos of the XionTech team",
  photoAlt: "XionTech team moment",
  frames: [
    { slot: "team", placeholder: "[Placeholder] Team photo" },
    { slot: "office", placeholder: "[Placeholder] Office photo" },
    { slot: "event", placeholder: "[Placeholder] Event photo" },
  ] satisfies { slot: "team" | "office" | "event"; placeholder: string }[],
};

// "Principles we value" (retitled from "What you’ll gain along the way",
// 2026-10-15), from Amber's careers-with-icons mock (XionTech spelling).
export const careersGain = {
  heading: "Principles we value",
  intro:
    "Grow your skills, explore new technologies, and work with people who support each other. Here’s what you can look forward to at XionTech.",
  cards: [
    {
      number: "01",
      title: "Hands-on Learning",
      text: "Learn by doing through workshops, shared knowledge, and real engineering challenges.",
    },
    {
      number: "02",
      title: "AI & New Technologies",
      text: "Explore AI tools, automation, and modern technologies that help you work smarter.",
    },
    {
      number: "03",
      title: "Real-World Projects",
      text: "Solve real customer problems and see how your work makes a difference.",
    },
    {
      number: "04",
      title: "Team Experiences",
      text: "Build connections through team activities, shared learning, and celebrating wins together.",
    },
  ],
} as const;

// Vietnamese. Prototype `data-vi` text where the English still matches, the
// rest AI-translated for native review (docs/translations/vi-review.md).
export const careersMetaVi: typeof careersMeta = {
  title: "Tuyển dụng tại XionTech | Việc làm phần mềm và AI",
  description:
    "Gia nhập XionTech để giải quyết bài toán thực tế, khám phá AI và công nghệ mới, và phát triển cùng đội ngũ tạo ra những sản phẩm mang lại khác biệt.",
};

export const careersHeroVi: typeof careersHero = {
  title: { first: "Tuyển dụng tại", second: "XionTech" },
  lede: "Chúng tôi quy tụ những người tò mò, yêu thích giải quyết vấn đề, khám phá công nghệ mới và tạo ra những điều mang lại khác biệt.",
  prompt: "Sẵn sàng cùng chúng tôi xây dựng?",
  artAlt:
    "Ba tấm thẻ xếp chồng minh họa kỹ thuật ứng dụng AI, một chip mã nguồn và công nghệ kết nối",
};

export const careersRolesVi: typeof careersRoles = {
  heading: "Tìm thử thách tiếp theo của bạn",
  emptyText: "Hiện chưa có vị trí nào đang tuyển.",
  applyLabel: "Xem và ứng tuyển",
};

const [teamFrame, officeFrame, eventFrame] = careersLife.frames;

export const careersLifeVi: typeof careersLife = {
  heading: "Gặp gỡ đội ngũ XionTech",
  lede: "Tại XionTech, chúng tôi nghiêm túc với kỹ thuật, nhưng không quá nghiêm túc với chính mình. Chúng tôi đặt câu hỏi, làm chủ công việc và cùng nhau không ngừng học hỏi. Ngoài giờ làm, chúng tôi mang cùng tinh thần đồng đội ấy ra sân cầu lông, sân bóng, micro karaoke và phòng chờ game.",
  tagsLabel: "Sở thích của đội ngũ",
  tags: [
    "Hội cầu lông",
    "Fan bóng đá",
    "Biệt đội Liên Minh Huyền Thoại",
    "Hội karaoke",
    "Tụ tập sau giờ làm",
    "Hội mê cà phê",
    "Otaku",
    "Hội guitar",
    "Người khám phá AI",
    "Mọt phim",
    "...còn bạn?",
  ],
  stripLabel: "Ảnh đội ngũ XionTech",
  photoAlt: "Khoảnh khắc của đội ngũ XionTech",
  frames: [
    { ...teamFrame, placeholder: "[Placeholder] Ảnh đội ngũ" },
    { ...officeFrame, placeholder: "[Placeholder] Ảnh văn phòng" },
    { ...eventFrame, placeholder: "[Placeholder] Ảnh sự kiện" },
  ],
};

export const careersGainVi: Localized<typeof careersGain> = {
  heading: "Những nguyên tắc chúng tôi coi trọng",
  intro:
    "Nâng cao kỹ năng, khám phá công nghệ mới và làm việc cùng những người luôn hỗ trợ lẫn nhau. Đây là những gì bạn có thể mong đợi tại XionTech.",
  cards: [
    {
      number: "01",
      title: "Học qua thực hành",
      text: "Học bằng cách làm qua các buổi workshop, chia sẻ kiến thức và những thử thách kỹ thuật thực tế.",
    },
    {
      number: "02",
      title: "AI và công nghệ mới",
      text: "Khám phá công cụ AI, tự động hóa và các công nghệ hiện đại giúp bạn làm việc thông minh hơn.",
    },
    {
      number: "03",
      title: "Dự án thực tế",
      text: "Giải quyết những bài toán thực của khách hàng và thấy công việc của bạn tạo nên khác biệt.",
    },
    {
      number: "04",
      title: "Trải nghiệm cùng đội ngũ",
      text: "Gắn kết qua các hoạt động đội nhóm, cùng nhau học hỏi và ăn mừng thành công.",
    },
  ],
};
