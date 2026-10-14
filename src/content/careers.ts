// Careers page copy. Kept out of the components so it can be translated later.

export const careersMeta = {
  title: "Careers at XionTech | Software Jobs in Ho Chi Minh City",
  description:
    "Join XionTech in Ho Chi Minh City. Work on school platforms and client products with AI/ML, generative AI, cloud and agile delivery in a people-centered culture.",
};

export const careersHero = {
  title: { first: "Stay curious.", second: "Build what’s next." },
  lede: "We’re building a team for people who learn fast, ask better questions, adapt when things change, and care about the outcome, not just the task. Here you’ll help pioneer new ways to build software with AI.",
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
// confirmed, so each front and back title starts with [Placeholder].
export const careersValues = {
  heading: "Five things that shape the way we work.",
  lede: "These are the behaviours we want people to experience from us every day. Flip a card to see what each one means in practice.",
  frontHint: "Flip for details",
  backHint: "Flip back",
  cards: [
    {
      icon: "agile",
      title: "[Placeholder] Stay agile",
      label: "STAY AGILE",
      backTitle: "[Placeholder] Move without losing direction.",
      text: "Stay flexible and adapt when new information or a better answer changes the path.",
    },
    {
      icon: "outcome",
      title: "[Placeholder] Own the outcome",
      label: "OWNERSHIP",
      backTitle: "[Placeholder] Care beyond your task.",
      text: "Raise issues early, protect quality and take responsibility for whether the work actually succeeds.",
    },
    {
      icon: "innovate",
      title: "[Placeholder] Innovate with purpose",
      label: "INNOVATE",
      backTitle: "[Placeholder] New is useful only when it helps.",
      text: "Explore emerging technology when it improves the product, the user experience or the way we work.",
    },
    {
      icon: "together",
      title: "[Placeholder] Grow together",
      label: "GROW TOGETHER",
      backTitle: "[Placeholder] Make each other better.",
      text: "Share what you know, give useful feedback and create space for teammates to stretch, contribute and grow.",
    },
    {
      icon: "done",
      title: "[Placeholder] Get IT Done",
      label: "GET IT DONE",
      backTitle: "[Placeholder] Turn possibility into something real.",
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

// Vietnamese. Prototype `data-vi` text where the English still matches, the
// rest AI-translated for native review (docs/translations/vi-review.md).
export const careersMetaVi: typeof careersMeta = {
  title: "Tuyển dụng tại XionTech | Việc làm phần mềm tại TP. Hồ Chí Minh",
  description:
    "Gia nhập XionTech tại TP. Hồ Chí Minh. Làm việc với các nền tảng cho trường học và sản phẩm của khách hàng cùng AI/ML, AI tạo sinh, cloud và phương pháp agile, trong một văn hóa lấy con người làm trung tâm.",
};

export const careersHeroVi: typeof careersHero = {
  title: { first: "Luôn tò mò.", second: "Xây dựng điều tiếp theo." },
  lede: "Chúng tôi đang xây dựng một đội ngũ cho những người học nhanh, đặt câu hỏi hay hơn, thích ứng khi mọi thứ thay đổi và quan tâm đến kết quả, không chỉ nhiệm vụ. Tại đây, bạn sẽ góp phần tiên phong những cách mới để xây dựng phần mềm với AI.",
  cta: { href: careersHero.cta.href, label: "Xem vị trí đang tuyển" },
};

export const careersGrowthVi: typeof careersGrowth = {
  caption: "[Placeholder] Mô hình học hỏi để phát triển",
  center: "Phát triển",
  steps: ["Tò mò", "Học hỏi", "Đặt câu hỏi", "Phát triển", "Cải thiện"],
};

const [workshops, visits, townHalls, kickoffs, celebration] =
  careersInside.tiles;

export const careersInsideVi: typeof careersInside = {
  heading: "Bên trong XionTech.",
  lede: "Những khoảnh khắc làm nên cuộc sống ở đây: workshop, khởi động dự án, ngày gắn kết đội ngũ, những dịp ăn mừng, cùng học hỏi và những khoảnh khắc nhỏ giữa chúng.",
  tiles: [
    {
      ...workshops,
      tag: "Cùng nhau học hỏi",
      title: "Workshop và thử nghiệm",
      text: "Những buổi thực hành nơi đội ngũ thử công cụ mới, quy trình AI tác tử và những cách làm việc tốt hơn.",
    },
    {
      ...visits,
      tag: "Xây dựng quan hệ",
      title: "Khách hàng đến thăm",
      text: "Hiểu bối cảnh trực tiếp và xây dựng quan hệ hợp tác bền chặt hơn.",
    },
    {
      ...townHalls,
      tag: "Cùng một hướng đi",
      title: "Họp toàn công ty",
      text: "Điều gì đã thay đổi, điều gì quan trọng lúc này và chúng tôi sẽ đi đâu tiếp theo.",
    },
    {
      ...kickoffs,
      tag: "Cùng nhau khởi đầu",
      title: "Khởi động dự án",
      text: "Công việc mới bắt đầu bằng bối cảnh chung, không phải một danh sách nhiệm vụ bí ẩn.",
    },
    {
      ...celebration,
      tag: "Ăn mừng tiến bộ",
      title: "[Placeholder] Ăn mừng",
      text: "Vì công việc đã hoàn thành xứng đáng hơn một nhãn trạng thái màu xanh.",
    },
  ],
};

const [agile, outcome, innovate, together, done] = careersValues.cards;

export const careersValuesVi: typeof careersValues = {
  heading: "Năm điều định hình cách chúng tôi làm việc.",
  lede: "Đây là những hành vi chúng tôi muốn mọi người cảm nhận được từ chúng tôi mỗi ngày. Lật một thẻ để xem ý nghĩa trong thực tế.",
  frontHint: "Lật để xem chi tiết",
  backHint: "Lật lại",
  cards: [
    {
      ...agile,
      title: "[Placeholder] Linh hoạt",
      label: "LINH HOẠT",
      backTitle: "[Placeholder] Di chuyển mà không lạc hướng.",
      text: "Luôn linh hoạt và thích ứng khi thông tin mới hoặc một câu trả lời tốt hơn thay đổi con đường.",
    },
    {
      ...outcome,
      title: "[Placeholder] Làm chủ kết quả",
      label: "LÀM CHỦ KẾT QUẢ",
      backTitle: "[Placeholder] Quan tâm vượt ra ngoài phần việc của mình.",
      text: "Nêu vấn đề sớm, giữ vững chất lượng và chịu trách nhiệm cho việc công việc có thực sự thành công hay không.",
    },
    {
      ...innovate,
      title: "[Placeholder] Đổi mới có mục đích",
      label: "ĐỔI MỚI CÓ MỤC ĐÍCH",
      backTitle: "[Placeholder] Cái mới chỉ hữu ích khi nó giúp ích.",
      text: "Khám phá công nghệ mới khi nó cải thiện sản phẩm, trải nghiệm người dùng hoặc cách chúng tôi làm việc.",
    },
    {
      ...together,
      title: "[Placeholder] Cùng nhau phát triển",
      label: "CÙNG NHAU PHÁT TRIỂN",
      backTitle: "[Placeholder] Giúp nhau tốt hơn.",
      text: "Chia sẻ điều bạn biết, góp ý hữu ích và tạo không gian để đồng đội thử thách bản thân, đóng góp và phát triển.",
    },
    {
      ...done,
      title: "[Placeholder] Get IT Done",
      label: "GET IT DONE",
      backTitle: "[Placeholder] Biến khả năng thành điều có thật.",
      text: "Ý tưởng hay rất quan trọng. Mang lại kết quả hữu ích, hoạt động thật mới là điều tạo nên giá trị của chúng.",
    },
  ],
};

export const careersRolesVi: typeof careersRoles = {
  heading: "Tìm thử thách tiếp theo của bạn.",
  emptyText: "Hiện chưa có vị trí nào đang tuyển.",
  applyLabel: "Xem và ứng tuyển",
};

const [teamFrame, officeFrame, eventFrame] = careersLife.frames;

export const careersLifeVi: typeof careersLife = {
  heading: "Cuộc sống tại XionTech.",
  frames: [
    { ...teamFrame, placeholder: "[Placeholder] Ảnh đội ngũ" },
    { ...officeFrame, placeholder: "[Placeholder] Ảnh văn phòng" },
    { ...eventFrame, placeholder: "[Placeholder] Ảnh sự kiện" },
  ],
};
