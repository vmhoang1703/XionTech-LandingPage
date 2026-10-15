import { DICTIONARIES } from "./dictionaries";
import type { Locale } from "./locales";
import { SERVICE_NAMES } from "./service-names";

// Site shell strings (header, footer, language menu, 404). Page bodies are not translated here.
// Vietnamese comes from the prototype (data-vi) where it has the string, otherwise it is
// AI-translated for native review; each string's source is in docs/translations/vi-review.md.

const names = SERVICE_NAMES;

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
    contact: string;
    // The header button: short, so the bar fits a 412px phone in Vietnamese.
    contactShort: string;
    cityPlano: string;
    cityHcmc: string;
  };
  language: { label: string };
  // The dark-mode toggle (a pressed/not-pressed button, so one label).
  theme: { label: string };
  backToTop: { label: string };
  footer: {
    blurb: string;
    products: string;
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
    primary: string;
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
    contact: "Let's talk",
    contactShort: "Let's talk",
    cityPlano: "Plano",
    cityHcmc: "Ho Chi Minh City",
  },
  language: { label: "Language" },
  theme: { label: "Dark mode" },
  backToTop: { label: "Back to top" },
  footer: {
    blurb:
      "XionTech builds AI-powered products and custom solutions, combining real-world expertise with modern technology to solve business challenges.",
    products: "Products",
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
    title: "Page not found",
    primary: "Back to Home",
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
    skipLink: "Chuyển đến nội dung",
    mainNav: "Điều hướng chính",
    homeLink: "Trang chủ XionTech",
    logoAlt: "XionTech, Get IT Done",
    menu: "Menu",
    contact: "Trao đổi với chúng tôi",
    contactShort: "Liên hệ",
    cityPlano: "Plano",
    cityHcmc: "TP. Hồ Chí Minh",
  },
  language: { label: "Ngôn ngữ" },
  theme: { label: "Chế độ tối" },
  backToTop: { label: "Lên đầu trang" },
  footer: {
    blurb:
      "XionTech xây dựng các sản phẩm ứng dụng AI và giải pháp theo yêu cầu, kết hợp kinh nghiệm thực tiễn với công nghệ hiện đại để giải quyết các bài toán kinh doanh.",
    products: "Sản phẩm",
    services: "Dịch vụ",
    howWeWork: "Cách chúng tôi làm việc",
    allServices: "Tất cả dịch vụ",
    company: "Công ty",
    aboutUs: "Về chúng tôi",
    offices: "Văn phòng",
    privacy: "Chính sách bảo mật",
  },
  notFound: {
    metaTitle: "Không tìm thấy trang | XionTech",
    title: "Không tìm thấy trang",
    primary: "Về trang chủ",
  },
};

export const SHELL: Record<Locale, ShellDictionary> = {
  en,
  vi,
  ja: DICTIONARIES.ja?.shell ?? en,
  fr: DICTIONARIES.fr?.shell ?? en,
  ko: DICTIONARIES.ko?.shell ?? en,
  zh: DICTIONARIES.zh?.shell ?? en,
};
