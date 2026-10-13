import type { Locale } from "./locales";

// Site shell strings (header, footer, language menu, 404). Page bodies are not translated here.
// Vietnamese comes from the prototype (data-vi); where the prototype has none, the value is
// "[Placeholder] " + the English text.

const names = {
  productEngineering: "Product Engineering",
  aiAnalytics: "AI-Driven Analytics",
  coCreation: "Product Co-Creation",
  staffing: "Staffing Service",
  customApps: "Custom App Development",
  lowCode: "Low-code Solutions",
  aiSolutions: "AI-Powered Solutions",
  cloud: "Cloud Computing",
};

export interface ShellDictionary {
  names: Record<keyof typeof names, string>;
  nav: {
    home: string;
    products: string;
    services: string;
    news: string;
    about: string;
    careers: string;
    skipLink: string;
    mainNav: string;
    homeLink: string;
    logoAlt: string;
    menu: string;
    demo: string;
  };
  language: { label: string; en: string; vi: string };
  footer: {
    blurb: string;
    products: string;
    forSchools: string;
    forStudents: string;
    forParents: string;
    services: string;
    howWeWork: string;
    allServices: string;
    company: string;
    aboutUs: string;
    offices: string;
    privacy: string;
  };
  notFound: {
    metaTitle: string;
    title: string;
    lede: string;
    primary: string;
    here: string;
  };
}

const en: ShellDictionary = {
  names,
  nav: {
    home: "Home",
    products: "Products",
    services: "Services",
    news: "News",
    about: "About",
    careers: "Careers",
    skipLink: "Skip to content",
    mainNav: "Main",
    homeLink: "XionTech home",
    logoAlt: "XionTech, Get IT Done",
    menu: "Menu",
    demo: "Book a demo",
  },
  language: { label: "Language", en: "English", vi: "Tiếng Việt" },
  footer: {
    blurb:
      "Education technology products and software delivery services for schools and businesses.",
    products: "Products",
    forSchools: "For schools",
    forStudents: "For students",
    forParents: "For parents",
    services: "Services",
    howWeWork: "How we work",
    allServices: "All services",
    company: "Company",
    aboutUs: "About us",
    offices: "Offices",
    privacy: "Privacy policy",
  },
  notFound: {
    metaTitle: "Page not found | XionTech",
    title: "You’ve wandered off the trail.",
    lede: "The page you were looking for isn’t here. Follow the trail back home, or pick a path below.",
    primary: "Go to Home",
    here: "You are here",
  },
};

const vi: ShellDictionary = {
  names,
  nav: {
    home: "Trang chủ",
    products: "Sản phẩm",
    services: "Dịch vụ",
    news: "Tin tức",
    about: "Về chúng tôi",
    careers: "Tuyển dụng",
    skipLink: "[Placeholder] Skip to content",
    mainNav: "[Placeholder] Main",
    homeLink: "[Placeholder] XionTech home",
    logoAlt: "XionTech, Get IT Done",
    menu: "Menu",
    demo: "[Placeholder] Book a demo",
  },
  language: {
    label: "Ngôn ngữ",
    en: "English",
    vi: "Tiếng Việt",
  },
  footer: {
    blurb:
      "Sản phẩm công nghệ giáo dục và dịch vụ phát triển phần mềm cho trường học và doanh nghiệp.",
    products: "Sản phẩm",
    forSchools: "Cho nhà trường",
    forStudents: "Cho học sinh",
    forParents: "Cho phụ huynh",
    services: "Dịch vụ",
    howWeWork: "Cách chúng tôi làm việc",
    allServices: "Tất cả dịch vụ",
    company: "Công ty",
    aboutUs: "Về chúng tôi",
    offices: "Văn phòng",
    privacy: "Chính sách bảo mật",
  },
  notFound: {
    metaTitle: "[Placeholder] Page not found | XionTech",
    title: "Bạn đã đi lạc lối mòn.",
    lede: "Trang bạn tìm không có ở đây. Hãy theo lối mòn về trang chủ, hoặc chọn một con đường bên dưới.",
    primary: "Về trang chủ",
    here: "Bạn đang ở đây",
  },
};

export const SHELL: Record<Locale, ShellDictionary> = { en, vi };
