// Job page copy. Kept out of the components so it can be translated later.

import type { Localized } from "@/i18n/content";

export const jobMeta = {
  title: "Open role | Careers at XionTech",
  description:
    "Read the role and apply with your CV. XionTech, Ho Chi Minh City.",
};

export const jobHero = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCareers: "Careers",
  chipsLabel: "Role details",
} as const;

export const jobDetails = {
  sectionLabel: "Role details and application",
  aboutHeading: "About the role",
  doHeading: "What you'll do",
  bringHeading: "What you bring",
  backLabel: "All open roles",
  backHref: "/careers#roles",
} as const;

export const jobForm = {
  heading: "Apply for this role",
  name: "Full name",
  email: "Email",
  phone: "Phone (optional)",
  cv: "CV",
  cvHelp: "PDF or Word, up to 5 MB.",
  note: "Cover note (optional)",
  submit: "Send application",
  sending: "Sending...",
  successHeading: "Summit reached. Thank you!",
  successText:
    "We've received your application and will be in touch if it's a match.",
  sendError: "We could not send your application. Please try again.",
  rateError:
    "You have sent several requests in a short time. Please try again in a few minutes.",
  consent: "We only use your details and CV to consider your application.",
  privacyLink: "Privacy policy",
  privacyHref: "/privacy",
  errorsHeading: "Please fix the following:",
} as const;

// Vietnamese. Prototype `data-vi` text where the English still matches, the
// rest AI-translated for native review (src/i18n/vi-sources.json).
export const jobMetaVi: typeof jobMeta = {
  title: "Vị trí tuyển dụng | Tuyển dụng tại XionTech",
  description:
    "Đọc mô tả vị trí và ứng tuyển kèm CV. XionTech, TP. Hồ Chí Minh.",
};

export const jobHeroVi: Localized<typeof jobHero> = {
  breadcrumbLabel: "Đường dẫn",
  breadcrumbHome: "Trang chủ",
  breadcrumbCareers: "Tuyển dụng",
  chipsLabel: "Thông tin vị trí",
};

export const jobDetailsVi: Localized<typeof jobDetails> = {
  sectionLabel: "Thông tin vị trí và ứng tuyển",
  aboutHeading: "Về vị trí này",
  doHeading: "Bạn sẽ làm gì",
  bringHeading: "Bạn mang đến điều gì",
  backLabel: "Tất cả vị trí",
  backHref: jobDetails.backHref,
};

export const jobFormVi: Localized<typeof jobForm> = {
  heading: "Ứng tuyển vị trí này",
  name: "Họ và tên",
  email: "Email",
  phone: "Số điện thoại (không bắt buộc)",
  cv: "CV",
  cvHelp: "PDF hoặc Word, tối đa 5 MB.",
  note: "Lời nhắn (không bắt buộc)",
  submit: "Gửi hồ sơ",
  sending: "Đang gửi...",
  successHeading: "Đã lên tới đỉnh. Cảm ơn bạn!",
  successText:
    "Chúng tôi đã nhận được hồ sơ của bạn và sẽ liên hệ nếu phù hợp.",
  sendError: "Chúng tôi không gửi được hồ sơ của bạn. Vui lòng thử lại.",
  rateError:
    "Bạn đã gửi nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau vài phút.",
  consent: "Chúng tôi chỉ dùng thông tin và CV của bạn để xét tuyển.",
  privacyLink: "Chính sách bảo mật",
  privacyHref: jobForm.privacyHref,
  errorsHeading: "Vui lòng sửa các mục sau:",
};
