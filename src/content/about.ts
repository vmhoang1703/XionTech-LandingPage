// About page copy (prototype about.html). Kept out of the components so it can
// be translated later.

export const aboutMeta = {
  title: "About XionTech | AI-driven product and engineering company",
  description:
    "Meet XionTech: technology built with ownership, with delivery centers in Plano and Ho Chi Minh City and a team that turns ideas into working software.",
};

export const aboutHero = {
  title: {
    lead: "We’re XionTech.",
    middle: "Technology built with ",
    accent: "ownership",
    tail: "",
  },
  text: "We bring people, ideas, and technology together to build meaningful digital solutions. From developing software products to exploring AI-powered innovation, we combine engineering expertise, experienced leadership, and a strong sense of ownership to help businesses move forward.",
  links: [
    { href: "/#contact", label: "Talk to our team" },
    { href: "/services", label: "Explore our services" },
  ],
};

// Website copy v3: the two chapters are one story.
export const aboutStory = {
  title: {
    lead: "Inspired by a mountain.",
    middle: "Driven by ",
    highlight: "purpose",
    tail: "",
  },
  paragraphs: [
    "Our name draws inspiration from a mountain, a symbol of ambition, unity, and the determination to reach new heights.",
    "That spirit shapes who we are today. We bring people and technology together, embrace challenges, and take ownership of what we build, working toward a future where innovation creates meaningful progress.",
  ],
  // Under the story while it is held; on the summit of the picture.
  tagName: "XionTech",
};

// About shows the same "What drives us" heading as Home.
export const aboutValuesHeading = {
  title: "What drives us",
  lede: "Five principles that guide how we collaborate, make decisions, and deliver meaningful results.",
};

// Each answer has an id (the two-column grid keys on it).
export const aboutFaq = {
  title: "Curious about XionTech?",
  lede: "A few things you might want to know before working with us.",
  // Two columns, row by row: left 1, 3, 5 and right 2, 4, 6.
  items: [
    {
      id: "what",
      question: "What does XionTech do?",
      answer:
        "We create AI-powered products and deliver custom software, product engineering, dedicated teams, and technology solutions for businesses.",
    },
    {
      id: "industries",
      question: "Which industries do you work with?",
      answer:
        "Education is our starting point. We bring adaptable engineering capabilities to projects in other industries, based on each client’s needs.",
    },
    {
      id: "begin",
      question: "How does a new project begin?",
      answer:
        "We start by understanding your goals and requirements, then shape the approach before progressing through design, development, testing, and deployment.",
    },
    {
      id: "time-zones",
      question: "How do your teams work across time zones?",
      answer:
        "Our teams in Plano, Ho Chi Minh City, Ha Noi and Da Nang cover USA, Europe and Australia time zones, with shared tools for real-time updates.",
    },
    {
      id: "quality",
      question: "How do you maintain delivery quality?",
      answer:
        "Engineers review work and combine testing and quality assurance with AI-assisted development, guided by agreed project standards.",
    },
  ],
};

const mapsHref = (lines: readonly string[]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lines.join(", "))}`;

export type AboutLocation = {
  id: string;
  eyebrow: string;
  city: string;
  timeZone: string;
  addressLines: readonly [string, string];
  mapHref: string;
  phone: { href: string; label: string };
  email: { href?: string; label: string };
};

const usAddress = [
  "7950 Legacy Drive, Suite 400",
  "Plano, Texas 75024, USA",
] as const;
const vnAddress = [
  "Floor 15, B1 Building, 279 Nguyen Tri Phuong Street",
  "Dien Hong Ward, Ho Chi Minh City, Vietnam",
] as const;

export const aboutOffices = {
  title: "Two delivery centers. One connected team",
  lede: "From Plano to Ho Chi Minh City, our teams work across time zones to support clients and keep projects moving.",
  timeLabel: "Local time",
  mapLabel: "Open {city} in Google Maps (opens in a new tab)",
  locations: [
    {
      id: "plano",
      eyebrow: "US Delivery Center",
      city: "Plano, Texas",
      timeZone: "America/Chicago",
      addressLines: usAddress,
      mapHref: mapsHref(usAddress),
      phone: { href: "tel:+14693229899", label: "+1 (469) 322-9899" },
      email: {
        href: "mailto:vinni.tran@newxion.com",
        label: "vinni.tran@newxion.com",
      },
    },
    {
      id: "hcmc",
      eyebrow: "Vietnam Delivery Center",
      city: "Ho Chi Minh City",
      timeZone: "Asia/Ho_Chi_Minh",
      addressLines: vnAddress,
      mapHref: mapsHref(vnAddress),
      phone: { href: "tel:+84908107552", label: "+84 908 107 552" },
      email: {
        href: "mailto:vinni.tran@xiontechs.com",
        label: "vinni.tran@xiontechs.com",
      },
    },
  ] as AboutLocation[],
};

export const aboutCta = {
  title: "Let’s build what’s next",
  text: "Have a product idea, a technology challenge, or an engineering team to scale? Let’s explore how we can turn your goals into meaningful solutions.",
  primary: { href: "/#contact", label: "Let’s talk about your project" },
  secondary: { href: "/products", label: "Explore our products" },
};

// Vietnamese. Product names stay English (2026-10-13); hrefs, ids, addresses,
// phones and emails are shared with English.
export const aboutMetaVi: typeof aboutMeta = {
  title: "Về XionTech | Công ty phát triển sản phẩm và kỹ thuật dựa trên AI",
  description:
    "Gặp gỡ XionTech: làm công nghệ với tinh thần làm chủ, có trung tâm phát triển tại Plano và TP. Hồ Chí Minh, cùng đội ngũ biến ý tưởng thành phần mềm thực tế.",
};

export const aboutHeroVi: typeof aboutHero = {
  title: {
    lead: "Chúng tôi là XionTech.",
    middle: "Công nghệ xây dựng bằng tinh thần ",
    accent: "làm chủ",
    tail: "",
  },
  text: "Chúng tôi kết nối con người, ý tưởng và công nghệ để xây dựng những giải pháp số có ý nghĩa. Từ phát triển sản phẩm phần mềm đến khám phá đổi mới sáng tạo ứng dụng AI, chúng tôi kết hợp chuyên môn kỹ thuật, đội ngũ lãnh đạo giàu kinh nghiệm và tinh thần làm chủ mạnh mẽ để giúp doanh nghiệp tiến về phía trước.",
  links: [
    { href: aboutHero.links[0].href, label: "Trò chuyện với đội ngũ" },
    { href: aboutHero.links[1].href, label: "Khám phá dịch vụ" },
  ],
};

export const aboutStoryVi: typeof aboutStory = {
  title: {
    lead: "Khởi nguồn từ một ngọn núi.",
    middle: "Dẫn lối bởi ",
    highlight: "mục đích",
    tail: "",
  },
  paragraphs: [
    "Tên của chúng tôi lấy cảm hứng từ một ngọn núi, biểu tượng của khát vọng, sự đoàn kết và quyết tâm vươn tới những tầm cao mới.",
    "Tinh thần đó định hình con người chúng tôi hôm nay. Chúng tôi kết nối con người với công nghệ, sẵn sàng đón nhận thử thách và làm chủ những gì mình xây dựng, hướng tới một tương lai nơi đổi mới sáng tạo tạo nên những tiến bộ có ý nghĩa.",
  ],
  tagName: aboutStory.tagName,
};

export const aboutValuesHeadingVi: typeof aboutValuesHeading = {
  title: "Điều thúc đẩy chúng tôi",
  lede: "Năm nguyên tắc định hướng cách chúng tôi hợp tác, đưa ra quyết định và mang lại kết quả có ý nghĩa.",
};

const FAQ_VI: Record<string, { question: string; answer: string }> = {
  what: {
    question: "XionTech làm gì?",
    answer:
      "Chúng tôi tạo ra các sản phẩm ứng dụng AI và cung cấp phần mềm theo yêu cầu, phát triển sản phẩm, đội ngũ chuyên trách và các giải pháp công nghệ cho doanh nghiệp.",
  },
  industries: {
    question: "Các bạn làm việc với những lĩnh vực nào?",
    answer:
      "Giáo dục là điểm khởi đầu của chúng tôi. Chúng tôi mang năng lực kỹ thuật linh hoạt đến các dự án ở những ngành khác, dựa trên nhu cầu của từng khách hàng.",
  },
  begin: {
    question: "Một dự án mới bắt đầu như thế nào?",
    answer:
      "Chúng tôi bắt đầu bằng việc tìm hiểu mục tiêu và yêu cầu của bạn, định hình cách tiếp cận, rồi lần lượt đi qua thiết kế, phát triển, kiểm thử và triển khai.",
  },
  "time-zones": {
    question: "Đội ngũ của các bạn làm việc qua nhiều múi giờ như thế nào?",
    answer:
      "Đội ngũ tại Plano, TP. Hồ Chí Minh, Hà Nội và Đà Nẵng làm việc theo múi giờ Mỹ, châu Âu và Úc, với công cụ chung để cập nhật theo thời gian thực.",
  },
  quality: {
    question: "Các bạn duy trì chất lượng triển khai như thế nào?",
    answer:
      "Kỹ sư rà soát công việc và kết hợp kiểm thử, đảm bảo chất lượng với phát triển có AI hỗ trợ, theo các tiêu chuẩn dự án đã thống nhất.",
  },
};

export const aboutFaqVi: typeof aboutFaq = {
  title: "Bạn muốn biết thêm về XionTech?",
  lede: "Một vài điều có thể bạn muốn biết trước khi làm việc cùng chúng tôi.",
  items: aboutFaq.items.map((item) => ({ id: item.id, ...FAQ_VI[item.id] })),
};

const CITY_VI: Record<string, { eyebrow: string; city: string }> = {
  plano: { eyebrow: "Trung tâm Phát triển Mỹ", city: "Plano, Texas" },
  hcmc: {
    eyebrow: "Trung tâm Phát triển Việt Nam",
    city: "TP. Hồ Chí Minh",
  },
};

export const aboutOfficesVi: typeof aboutOffices = {
  title: "Hai trung tâm triển khai. Một đội ngũ gắn kết",
  lede: "Từ Plano đến TP. Hồ Chí Minh, đội ngũ của chúng tôi làm việc qua nhiều múi giờ để hỗ trợ khách hàng và giữ dự án luôn tiến triển.",
  timeLabel: "Giờ địa phương",
  mapLabel: "Mở {city} trên Google Maps (mở trong thẻ mới)",
  locations: aboutOffices.locations.map((location) => ({
    ...location,
    ...CITY_VI[location.id],
  })),
};

export const aboutCtaVi: typeof aboutCta = {
  title: "Cùng xây dựng điều tiếp theo",
  text: "Bạn có ý tưởng sản phẩm, một bài toán công nghệ hay một đội ngũ kỹ thuật cần mở rộng? Hãy cùng tìm cách biến mục tiêu của bạn thành những giải pháp có ý nghĩa.",
  primary: { href: aboutCta.primary.href, label: "Trao đổi về dự án của bạn" },
  secondary: { href: aboutCta.secondary.href, label: "Khám phá sản phẩm" },
};
