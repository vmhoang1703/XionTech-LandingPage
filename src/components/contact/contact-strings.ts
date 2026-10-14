import { SERVICES } from "@/components/layout/nav-data";
import { APPS, appById } from "@/content/apps";
import type { Localized } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { JOB_ERRORS } from "@/lib/careers/application-rules";
import {
  CONTACT_ERRORS,
  LENGTH_ERROR,
  MESSAGE_MAX_LENGTH,
  MESSAGE_REQUIRED_ERROR,
  TEXT_MAX_LENGTH,
} from "@/lib/contact/contact-rules";

// A length limit as Vietnamese writes it ("2.000").
const viCount = (n: number) => n.toLocaleString("vi-VN");

const DETAILS_CONSENT = "We only use your details to respond to this request.";

/**
 * Every visible string of the /demo hero and contact form, in one place so it
 * can be translated later. Service and product names stay in English.
 */
export const CONTACT_STRINGS = {
  metaTitle: "Book a Demo or Start a Project | XionTech",
  metaDescription:
    "Book a demo of Parent Hub and Staff Hub for your school, or tell us about your software project. XionTech, Ho Chi Minh City and Plano.",
  hero: {
    breadcrumbLabel: "Breadcrumb",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Contact",
    titleBefore: "Let's talk about your ",
    titleHighlight: "school",
    titleAfter: " or your project.",
    items: [
      "A walkthrough of Parent Hub and Staff Hub using your school's scenarios.",
      "Answers on setup, data and support.",
      "For projects: a first Discovery conversation, the first of our four steps.",
    ],
    officesLabel: "Our offices",
  },
  form: {
    heading: "What can we help with?",
    tabsLabel: "Request type",
    tabDemo: "Product demo",
    tabProject: "Outsourcing project",
    name: "Full name",
    email: "Work email",
    org: "School or company",
    role: "Your role",
    roleHelp: "For example: Principal, Head of IT",
    products: "Products of interest",
    schoolSize: "School size",
    date: "Preferred date",
    service: "Service",
    startTiming: "When do you want to start?",
    message: "Message (optional)",
    submit: "Send request",
    sending: "Sending...",
    successHeading: "Summit reached. Thank you!",
    successText: "We will be in touch soon.",
    sendError: "We could not send your request. Please try again.",
    rateError:
      "You have sent several requests in a short time. Please try again in a few minutes.",
    consent: DETAILS_CONSENT,
    privacyLink: "Privacy policy",
    errorsHeading: "Please fix the following:",
  },
  // Home #contact section (prototype index.html:241-268).
  home: {
    heading: "Have something you want to build?",
    lede: "Tell us a little about yourself and what you're working on. Our team will get in touch to learn more.",
    name: "Your name",
    email: "Work email",
    phone: "Phone number",
    optional: "(optional)",
    phonePlaceholder: "(+1) 469 322 9899",
    message: "Tell us about your project",
    messagePlaceholder:
      "What are you looking to build? Tell us about your idea, existing product, team or challenge.",
    submit: "Start the conversation",
    consent: "We only use your details to reply to your message.",
    successHeading: "Summit reached. Thanks — we've received your message.",
    successText:
      "Our team will review what you shared and get in touch with you.",
  },
  capture: {
    emailLabel: "Work email",
    demo: {
      heading: "See it working at your school.",
      lede: "Leave your work email and we'll arrange a walkthrough built around your school.",
      placeholder: "name@school.edu.vn",
      button: "Book a demo",
      consent: "We only use your email to arrange your demo.",
    },
    project: {
      heading: "Tell us what you're building.",
      lede: "Leave your work email and we'll reach out to start Discovery.",
      placeholder: "name@company.com",
      button: "Start a project",
      consent: DETAILS_CONSENT,
    },
  },
  errors: CONTACT_ERRORS,
  // The Demo form offers every app except AI Tutor (prototype demo.html).
  productPills: APPS.filter((app) => app.id !== "ai-tutor").map(
    (app) => app.shortName,
  ),
  defaultProduct: appById("parent-hub").shortName,
  schoolSizes: [
    "Under 500 students",
    "500 to 1,500 students",
    "Over 1,500 students",
    "Multiple campuses",
  ],
  startTimings: ["As soon as possible", "In 1 to 3 months", "Just exploring"],
  services: [...SERVICES.map((service) => service.name), "Not sure yet"],
} as const;

const DETAILS_CONSENT_VI =
  "Chúng tôi chỉ dùng thông tin của bạn để phản hồi yêu cầu này.";

// Vietnamese: prototype demo.html and index.html renderings where the English
// matches, the rest AI-translated for native review (docs/translations/vi-review.md).
// Option lists are display labels only: the form posts the English value at
// the same index, which the server checks. Product and service names stay English.
export const CONTACT_STRINGS_VI: Localized<typeof CONTACT_STRINGS> = {
  metaTitle: "Đặt lịch demo hoặc bắt đầu dự án | XionTech",
  metaDescription:
    "Đặt lịch demo Parent Hub và Staff Hub cho trường của bạn, hoặc kể cho chúng tôi về dự án phần mềm của bạn. XionTech, TP. Hồ Chí Minh và Plano.",
  hero: {
    breadcrumbLabel: "Đường dẫn",
    breadcrumbHome: "Trang chủ",
    breadcrumbCurrent: "Liên hệ",
    titleBefore: "Hãy trao đổi về ",
    titleHighlight: "trường học",
    titleAfter: " hoặc dự án của bạn.",
    items: [
      "Demo Parent Hub và Staff Hub với chính tình huống của trường bạn.",
      "Giải đáp về triển khai, dữ liệu và hỗ trợ.",
      "Với dự án: buổi Khám phá, bước đầu tiên trong quy trình bốn bước của chúng tôi.",
    ],
    officesLabel: "Văn phòng của chúng tôi",
  },
  form: {
    heading: "Bạn cần gì?",
    tabsLabel: "Loại yêu cầu",
    tabDemo: "Demo sản phẩm",
    tabProject: "Dự án outsourcing",
    name: "Họ và tên",
    email: "Email công việc",
    org: "Trường học hoặc công ty",
    role: "Vai trò",
    roleHelp: "Ví dụ: Hiệu trưởng, Trưởng phòng IT",
    products: "Sản phẩm quan tâm",
    schoolSize: "Quy mô trường",
    date: "Ngày mong muốn",
    service: "Dịch vụ",
    startTiming: "Thời gian bắt đầu",
    message: "Tin nhắn (không bắt buộc)",
    submit: "Gửi yêu cầu",
    sending: "Đang gửi...",
    successHeading: "Đã lên tới đỉnh. Cảm ơn bạn!",
    successText: "Chúng tôi sẽ sớm liên hệ với bạn.",
    sendError: "Không gửi được yêu cầu của bạn. Vui lòng thử lại.",
    rateError:
      "Bạn đã gửi nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau vài phút.",
    consent: DETAILS_CONSENT_VI,
    privacyLink: "Chính sách bảo mật",
    errorsHeading: "Vui lòng sửa các mục sau:",
  },
  home: {
    heading: "Bạn có điều gì muốn xây dựng?",
    lede: "Hãy cho chúng tôi biết đôi chút về bạn và việc bạn đang làm. Đội ngũ của chúng tôi sẽ liên hệ để tìm hiểu thêm.",
    name: "Tên của bạn",
    email: "Email công việc",
    phone: "Số điện thoại",
    optional: "(không bắt buộc)",
    phonePlaceholder: CONTACT_STRINGS.home.phonePlaceholder,
    message: "Hãy kể về dự án của bạn",
    messagePlaceholder:
      "Bạn muốn xây dựng gì? Hãy kể về ý tưởng, sản phẩm hiện có, đội ngũ hoặc thách thức của bạn.",
    submit: "Bắt đầu trao đổi",
    consent: "Chúng tôi chỉ dùng thông tin của bạn để phản hồi tin nhắn này.",
    successHeading:
      "Đã lên tới đỉnh. Cảm ơn bạn, chúng tôi đã nhận được tin nhắn.",
    successText:
      "Đội ngũ của chúng tôi sẽ xem nội dung bạn chia sẻ và liên hệ với bạn.",
  },
  capture: {
    emailLabel: "Email công việc",
    demo: {
      heading: "Xem ứng dụng hoạt động tại trường của bạn.",
      lede: "Để lại email công việc, chúng tôi sẽ sắp xếp buổi demo dành riêng cho trường của bạn.",
      placeholder: CONTACT_STRINGS.capture.demo.placeholder,
      button: "Đặt lịch demo",
      consent: "Chúng tôi chỉ dùng email của bạn để sắp xếp buổi demo.",
    },
    project: {
      heading: "Hãy kể về điều bạn đang xây dựng.",
      lede: "Để lại email công việc, chúng tôi sẽ liên hệ để bắt đầu bước Khám phá.",
      placeholder: CONTACT_STRINGS.capture.project.placeholder,
      button: "Bắt đầu dự án",
      consent: DETAILS_CONSENT_VI,
    },
  },
  errors: {
    name: "Vui lòng nhập họ tên.",
    email: "Vui lòng nhập email hợp lệ.",
    org: "Vui lòng nhập tên tổ chức.",
    phone: "Vui lòng nhập số điện thoại hợp lệ, ví dụ (+1) 469 322 9899.",
    date: "Vui lòng chọn hôm nay hoặc một ngày sau đó.",
    message: `Vui lòng giữ tin nhắn dưới ${viCount(MESSAGE_MAX_LENGTH)} ký tự.`,
  },
  productPills: CONTACT_STRINGS.productPills,
  defaultProduct: CONTACT_STRINGS.defaultProduct,
  schoolSizes: [
    "Dưới 500 học sinh",
    "500 đến 1.500 học sinh",
    "Trên 1.500 học sinh",
    "Nhiều cơ sở",
  ],
  startTimings: ["Càng sớm càng tốt", "Trong 1 đến 3 tháng", "Đang tìm hiểu"],
  services: [...SERVICES.map((service) => service.name), "Chưa chắc chắn"],
};

/** Vietnamese for every English field error the rules or the server can return. */
export const ERRORS_VI: ReadonlyMap<string, string> = new Map([
  ...Object.entries(CONTACT_ERRORS).map(
    ([field, message]): [string, string] => [
      message,
      CONTACT_STRINGS_VI.errors[field as keyof typeof CONTACT_ERRORS],
    ],
  ),
  [MESSAGE_REQUIRED_ERROR, "Vui lòng kể đôi chút về dự án của bạn."],
  [LENGTH_ERROR, `Vui lòng nhập dưới ${viCount(TEXT_MAX_LENGTH)} ký tự.`],
  [JOB_ERRORS.cv, "Vui lòng tải lên CV dạng PDF hoặc Word, tối đa 5 MB."],
  [
    JOB_ERRORS.note,
    `Vui lòng giữ lời nhắn dưới ${viCount(MESSAGE_MAX_LENGTH)} ký tự.`,
  ],
]);

/** One English field error in the page's language; an unknown one becomes the generic send error. */
export function localizeError(message: string, locale: Locale): string {
  if (locale === "en") return message;
  return ERRORS_VI.get(message) ?? CONTACT_STRINGS_VI.form.sendError;
}

/** Field errors (from the rules or the server, always English) in the page's language. */
export function localizeErrors(
  errors: Partial<Record<string, string>>,
  locale: Locale,
): Partial<Record<string, string>> {
  if (locale === "en") return errors;
  const localized: Partial<Record<string, string>> = {};
  for (const [field, message] of Object.entries(errors)) {
    if (message) localized[field] = localizeError(message, locale);
  }
  return localized;
}
