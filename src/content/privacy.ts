import type { Localized } from "@/i18n/content";

/**
 * The page strings around the XionTech Privacy Policy (privacy-policy.ts).
 * The policy itself is legal text, authoritative in English and shown as-is
 * on every locale; only these strings are translated, with a note that says
 * the policy is in English.
 */
export const PRIVACY = {
  metaTitle: "Privacy Policy | XionTech",
  metaDescription:
    "How XionTech Joint Stock Company collects, uses and protects your information when you use our digital products, applications, websites and IT services.",
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Privacy policy",
  title: "Privacy Policy",
  bodyLabel: "Policy",
  tocLabel: "On this page",
  languageNote: "This policy is provided in English.",
} as const;

// Vietnamese, AI-translated for native review (docs/translations/vi-review.md).
export const PRIVACY_VI: Localized<typeof PRIVACY> = {
  metaTitle: "Chính sách bảo mật | XionTech",
  metaDescription:
    "Cách XionTech Joint Stock Company thu thập, sử dụng và bảo vệ thông tin của bạn khi bạn dùng sản phẩm số, ứng dụng, website và dịch vụ CNTT của chúng tôi.",
  breadcrumbLabel: "Đường dẫn",
  breadcrumbHome: "Trang chủ",
  breadcrumbCurrent: "Chính sách bảo mật",
  title: "Chính sách bảo mật",
  bodyLabel: "Chính sách",
  tocLabel: "Trong trang này",
  languageNote: "Chính sách này được cung cấp bằng tiếng Anh.",
};
