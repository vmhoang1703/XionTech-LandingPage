// Careers page copy. Kept out of the components so it can be translated later.

import type { Localized } from "@/i18n/content";

export const careersMeta = {
  title: "Careers at XionTech | Software Jobs in Ho Chi Minh City",
  description:
    "Join XionTech in Ho Chi Minh City. Work on school platforms and client products with AI/ML, generative AI, cloud and agile delivery in a people-centered culture.",
};

export const careersHero = {
  title: { first: "Stay curious.", second: "Build what’s next" },
  lede: "We’re building a team for people who learn fast, ask better questions, adapt when things change, and care about the outcome, not just the task. Here you’ll help pioneer new ways to build software with AI.",
};

export const careersRoles = {
  heading: "Find your next challenge",
  emptyText: "No open roles right now.",
  applyLabel: "View and apply",
};

// Q15: Life photo frames are off the page; the Sanity life-photo code and
// this copy stay for later (deferred-work.md).
export const careersLife = {
  heading: "Life at XionTech",
  prevLabel: "Previous photo",
  nextLabel: "Next photo",
  frames: [
    { slot: "team", placeholder: "[Placeholder] Team photo" },
    { slot: "office", placeholder: "[Placeholder] Office photo" },
    { slot: "event", placeholder: "[Placeholder] Event photo" },
  ] satisfies { slot: "team" | "office" | "event"; placeholder: string }[],
};

// "What you’ll gain along the way" (website copy v3), from
// Amber's careers-with-icons mock (copy as given, XionTech spelling).
export const careersGain = {
  heading: "What you’ll gain along the way",
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
  title: "Tuyển dụng tại XionTech | Việc làm phần mềm tại TP. Hồ Chí Minh",
  description:
    "Gia nhập XionTech tại TP. Hồ Chí Minh. Làm việc với các nền tảng cho trường học và sản phẩm của khách hàng cùng AI/ML, AI tạo sinh, cloud và phương pháp agile, trong một văn hóa lấy con người làm trung tâm.",
};

export const careersHeroVi: typeof careersHero = {
  title: { first: "Luôn tò mò.", second: "Xây dựng điều tiếp theo" },
  lede: "Chúng tôi đang xây dựng một đội ngũ cho những người học nhanh, đặt câu hỏi hay hơn, thích ứng khi mọi thứ thay đổi và quan tâm đến kết quả, không chỉ nhiệm vụ. Tại đây, bạn sẽ góp phần tiên phong những cách mới để xây dựng phần mềm với AI.",
};

export const careersRolesVi: typeof careersRoles = {
  heading: "Tìm thử thách tiếp theo của bạn",
  emptyText: "Hiện chưa có vị trí nào đang tuyển.",
  applyLabel: "Xem và ứng tuyển",
};

const [teamFrame, officeFrame, eventFrame] = careersLife.frames;

export const careersLifeVi: typeof careersLife = {
  heading: "Cuộc sống tại XionTech",
  prevLabel: "Ảnh trước",
  nextLabel: "Ảnh tiếp theo",
  frames: [
    { ...teamFrame, placeholder: "[Placeholder] Ảnh đội ngũ" },
    { ...officeFrame, placeholder: "[Placeholder] Ảnh văn phòng" },
    { ...eventFrame, placeholder: "[Placeholder] Ảnh sự kiện" },
  ],
};

export const careersGainVi: Localized<typeof careersGain> = {
  heading: "Những điều bạn nhận được trên hành trình",
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
