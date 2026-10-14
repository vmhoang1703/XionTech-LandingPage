import type { Localized } from "@/i18n/content";
import {
  aboutOfficeView,
  aboutOfficeViewVi,
  otherLocations,
  otherLocationsVi,
} from "@/content/offices";

// About page copy (prototype about.html). Kept out of the components so it can
// be translated later.

export const aboutMeta = {
  title: "About XionTech | Get IT Done",
  description:
    "XionTech is an education technology company and software partner, with headquarters in Plano (USA) and Ho Chi Minh City (Vietnam) and teams in Ha Noi and Da Nang, serving clients in the USA, Europe and Australia.",
};

export const aboutHero = {
  title: {
    lead: "We’re XionTech,",
    middle: "technology built with ",
    accent: "ownership",
    tail: ".",
  },
  text: "We bring people, ideas and technology together to build exceptional IT systems and shape a brighter future for all. From Ho Chi Minh City and Plano, we build our own platforms for schools and deliver digital products for clients around the world.",
  links: [
    { href: "/products", label: "Explore our products" },
    { href: "/services", label: "Explore our services" },
  ],
};

export const aboutStory = {
  title: {
    lead: "Inspired by a mountain.",
    middle: "United by ",
    highlight: "purpose",
    tail: ".",
  },
  chapters: [
    {
      number: "01",
      title: "The inspiration",
      text: "Our name is inspired by a mountain: a place people look up to, gather around and climb together towards a brighter future.",
    },
    {
      number: "02",
      title: "The purpose",
      // The founding sentence is a placeholder until the business confirms it (Q12).
      text: "[Placeholder] Inspired by this vision, a group of pioneers established newXion in America. Guided by enduring core values, they set out to build a community true to the spirit of the mountain: where people unite, harness cutting-edge technology, and build exceptional IT systems to advance humanity and shape a brighter future for all.",
    },
  ],
  closing: {
    line: "Our inspiration is a mountain. Our purpose is people.",
    tags: "Vision · Community · Technology",
  },
};

// Each answer has an id, so Home can pick some (homeFaq in home.ts).
export const aboutFaq = {
  title: "Your question, we answer",
  lede: "Straight answers about our products, our services and how we work.",
  items: [
    {
      id: "what",
      question: "What does XionTech do?",
      answer:
        "We build our own school platforms (Parent Hub, Staff Hub and IoT Device Management) and deliver software for other companies: product engineering, AI-driven analytics, product co-creation and staffing.",
    },
    {
      id: "industries",
      question: "Which industries do you work with?",
      answer:
        "EdTech is our core. We also serve Healthcare, Logistics and Private Equity.",
    },
    {
      id: "try-apps",
      question: "How can our school try Parent Hub or Staff Hub?",
      answer:
        "Book a demo. We walk you through the apps using scenarios from your own school.",
    },
    {
      id: "time-zones",
      question: "How do you work across time zones?",
      answer:
        "Our teams in Plano, Ho Chi Minh City, Ha Noi and Da Nang cover USA, Europe and Australia time zones, with shared tools for real-time updates.",
    },
    {
      id: "shape",
      question: "When do you shape the solution to our needs?",
      answer:
        "From the start. Discovery, the first of our four steps, sets your goals, users and scope before design begins.",
    },
    {
      id: "results",
      question: "What results can we expect?",
      answer:
        "Cost-efficient delivery by skilled Vietnamese engineers, on-time releases and measurable results that support your growth.",
    },
    {
      id: "security",
      question: "How do you keep our data secure?",
      answer:
        "[Placeholder] We work with honesty, transparency and clear ethical standards, backed by security automation and continuous scanning.",
    },
    {
      id: "feedback",
      question: "How do we give feedback during a project?",
      answer:
        "Through dedicated channels, frequent check-ins and agile sprints, so your input shapes the product all the way through.",
    },
    {
      id: "value",
      question: "How do you measure and show value?",
      answer:
        "We track speed, quality, product impact and team autonomy, and share them openly with you.",
    },
  ],
  ask: {
    label: "Still have a question? Ask us directly",
    href: "/#contact",
  },
};

export const aboutOffices = {
  title: "Two headquarters, four locations.",
  more: otherLocations,
  // Plano first, then Ho Chi Minh City.
  offices: aboutOfficeView,
};

export const aboutCapture = {
  heading: "See our apps in action.",
  lede: "Leave your work email and we'll arrange a walkthrough of Parent Hub and Staff Hub.",
};

// Vietnamese. Product names stay English (2026-10-13); hrefs, ids and numbers
// are shared with English.
export const aboutMetaVi: typeof aboutMeta = {
  title: "Về XionTech | Get IT Done",
  description:
    "XionTech là công ty công nghệ giáo dục và đối tác phần mềm, có trụ sở chính tại Plano (Mỹ) và TP. Hồ Chí Minh (Việt Nam), cùng đội ngũ tại Hà Nội và Đà Nẵng, phục vụ khách hàng tại Mỹ, châu Âu và Úc.",
};

export const aboutHeroVi: typeof aboutHero = {
  title: {
    lead: "Chúng tôi là XionTech,",
    middle: "công nghệ của tinh thần ",
    accent: "làm chủ",
    tail: ".",
  },
  text: "Chúng tôi kết nối con người, ý tưởng và công nghệ để xây dựng những hệ thống CNTT xuất sắc và kiến tạo một tương lai tươi sáng hơn cho tất cả. Từ TP. Hồ Chí Minh và Plano, chúng tôi tự xây dựng nền tảng cho trường học và phát triển sản phẩm số cho khách hàng trên toàn thế giới.",
  links: [
    { href: aboutHero.links[0].href, label: "Khám phá sản phẩm" },
    { href: aboutHero.links[1].href, label: "Khám phá dịch vụ" },
  ],
};

export const aboutStoryVi: typeof aboutStory = {
  title: {
    lead: "Khởi nguồn từ một ngọn núi.",
    middle: "Gắn kết bởi ",
    highlight: "mục đích",
    tail: ".",
  },
  chapters: [
    {
      number: aboutStory.chapters[0].number,
      title: "Nguồn cảm hứng",
      text: "Tên Xion lấy cảm hứng từ một ngọn núi: nơi mọi người cùng hướng lên, cùng tụ hội và cùng nhau vượt lên tới một tương lai tươi sáng hơn.",
    },
    {
      number: aboutStory.chapters[1].number,
      title: "Mục đích",
      text: "[Placeholder] Từ hình ảnh đó, một nhóm người tiên phong đã lập nên newXion tại Mỹ. Dẫn dắt bởi những giá trị cốt lõi bền vững, họ xây dựng một cộng đồng mang tinh thần của ngọn núi: nơi con người gắn kết, làm chủ công nghệ tiên tiến và xây dựng những hệ thống CNTT xuất sắc, vì nhân loại và một tương lai tươi sáng hơn cho tất cả.",
    },
  ],
  closing: {
    line: "Cảm hứng của chúng tôi là một ngọn núi. Mục đích của chúng tôi là con người.",
    tags: "Tầm nhìn · Cộng đồng · Công nghệ",
  },
};

const FAQ_VI: Record<string, { question: string; answer: string }> = {
  what: {
    question: "XionTech làm gì?",
    answer:
      "Chúng tôi xây dựng nền tảng riêng cho trường học (Parent Hub, Staff Hub và IoT Device Management) và phát triển phần mềm cho doanh nghiệp khác: phát triển sản phẩm, phân tích dữ liệu bằng AI, đồng sáng tạo sản phẩm và cung cấp nhân sự.",
  },
  industries: {
    question: "Các bạn làm việc với những lĩnh vực nào?",
    answer:
      "Giáo dục là thế mạnh cốt lõi. Chúng tôi cũng phục vụ Y tế, Logistics và Quỹ đầu tư tư nhân.",
  },
  "try-apps": {
    question:
      "Trường chúng tôi có thể trải nghiệm Parent Hub hoặc Staff Hub như thế nào?",
    answer:
      "Hãy đặt lịch demo. Chúng tôi sẽ hướng dẫn bạn qua các ứng dụng với chính các tình huống của trường bạn.",
  },
  "time-zones": {
    question: "Các bạn làm việc qua nhiều múi giờ như thế nào?",
    answer:
      "Đội ngũ tại Plano, TP. Hồ Chí Minh, Hà Nội và Đà Nẵng làm việc theo múi giờ Mỹ, châu Âu và Úc, với công cụ chung để cập nhật theo thời gian thực.",
  },
  shape: {
    question: "Khi nào giải pháp được điều chỉnh theo nhu cầu của chúng tôi?",
    answer:
      "Ngay từ đầu. Bước Khám phá, bước đầu tiên trong quy trình bốn bước của chúng tôi, xác định mục tiêu, người dùng và phạm vi trước khi bắt đầu thiết kế.",
  },
  results: {
    question: "Chúng tôi có thể mong đợi kết quả gì?",
    answer:
      "Phát triển tối ưu chi phí bởi đội ngũ kỹ sư Việt Nam giàu kinh nghiệm, phát hành đúng hạn và kết quả đo lường được, hỗ trợ sự phát triển của bạn.",
  },
  security: {
    question: "Các bạn bảo vệ dữ liệu của chúng tôi như thế nào?",
    answer:
      "[Placeholder] Chúng tôi làm việc trung thực, minh bạch và theo chuẩn mực đạo đức rõ ràng, cùng với tự động hóa bảo mật và quét liên tục.",
  },
  feedback: {
    question: "Chúng tôi góp ý trong quá trình dự án bằng cách nào?",
    answer:
      "Qua các kênh riêng, các buổi trao đổi thường xuyên và sprint Agile, để ý kiến của bạn định hình sản phẩm xuyên suốt dự án.",
  },
  value: {
    question: "Các bạn đo lường và chứng minh giá trị như thế nào?",
    answer:
      "Chúng tôi theo dõi tốc độ, chất lượng, tác động sản phẩm và tính tự chủ của đội ngũ, và chia sẻ minh bạch với bạn.",
  },
};

export const aboutFaqVi: typeof aboutFaq = {
  title: "Bạn hỏi, chúng tôi trả lời",
  lede: "Câu trả lời thẳng thắn về sản phẩm, dịch vụ và cách chúng tôi làm việc.",
  items: aboutFaq.items.map((item) => ({ id: item.id, ...FAQ_VI[item.id] })),
  ask: {
    href: aboutFaq.ask.href,
    label: "Vẫn còn câu hỏi? Hỏi trực tiếp chúng tôi",
  },
};

export const aboutOfficesVi: typeof aboutOffices = {
  title: "Hai trụ sở chính, bốn địa điểm.",
  more: otherLocationsVi,
  offices: aboutOfficeViewVi,
};

export const aboutCaptureVi: Localized<typeof aboutCapture> = {
  heading: "Xem ứng dụng của chúng tôi hoạt động.",
  lede: "Để lại email công việc, chúng tôi sẽ sắp xếp buổi demo Parent Hub và Staff Hub cho bạn.",
};
