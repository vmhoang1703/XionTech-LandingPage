import type { Localized } from "@/i18n/content";

/**
 * Every visible string of /privacy, in one place so it can be translated later.
 * Website copy v3: outline-only sections and [Placeholder] tags removed from view;
 * the remaining text describes what the site forms actually do.
 * Only `retentionDecided` is a decided fact (decision A4).
 */
const RETENTION_DECIDED =
  "Contact and demo requests, email capture submissions, job applications and CVs are kept with no time limit.";

export const PRIVACY = {
  metaTitle: "Privacy Policy | XionTech",
  metaDescription:
    "How XionTech uses the personal data you share through our forms.",
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Privacy policy",
  title: "Privacy policy",
  bodyLabel: "Policy",
  retentionDecided: RETENTION_DECIDED,
  sections: [
    {
      id: "privacy-collect",
      heading: "What we collect",
      paragraphs: [
        "Email, name, phone number, organization, role and anything you send through our forms, including a CV if you apply for a job.",
      ],
    },
    {
      id: "privacy-use",
      heading: "How we use it",
      paragraphs: [
        "Only to answer your request or to consider your job application and CV.",
      ],
    },
    {
      id: "privacy-share",
      heading: "Who we share it with",
      paragraphs: [
        "Service providers that process data for us: Gmail (sends form messages to our company inbox), Upstash (rate-limit counters made from hashed values), Vercel (website hosting and private CV storage), Google Fonts (fonts for Japanese, Korean and Chinese pages).",
      ],
    },
    {
      id: "privacy-retention",
      heading: "How long we keep it",
      paragraphs: [RETENTION_DECIDED],
    },
  ],
} as const;

const RETENTION_DECIDED_VI =
  "Yêu cầu liên hệ và đặt lịch demo, email đăng ký nhận tin, hồ sơ ứng tuyển và CV được lưu giữ không giới hạn thời gian.";

const [collect, use, share, retention] = PRIVACY.sections;

// Vietnamese. Prototype `data-vi` text where the English still matches, the
// rest AI-translated for native review (docs/translations/vi-review.md).
export const PRIVACY_VI: Localized<typeof PRIVACY> = {
  metaTitle: "Chính sách bảo mật | XionTech",
  metaDescription:
    "Cách XionTech sử dụng dữ liệu cá nhân bạn chia sẻ qua các biểu mẫu của chúng tôi.",
  breadcrumbLabel: "Đường dẫn",
  breadcrumbHome: "Trang chủ",
  breadcrumbCurrent: "Chính sách bảo mật",
  title: "Chính sách bảo mật",
  bodyLabel: "Chính sách",
  retentionDecided: RETENTION_DECIDED_VI,
  sections: [
    {
      id: collect.id,
      heading: "Chúng tôi thu thập gì",
      paragraphs: [
        "Email, họ tên, số điện thoại, tổ chức, vai trò và mọi nội dung bạn gửi qua biểu mẫu của chúng tôi, bao gồm CV nếu bạn ứng tuyển.",
      ],
    },
    {
      id: use.id,
      heading: "Chúng tôi dùng để làm gì",
      paragraphs: [
        "Chỉ để trả lời yêu cầu của bạn hoặc xét hồ sơ ứng tuyển và CV của bạn.",
      ],
    },
    {
      id: share.id,
      heading: "Chúng tôi chia sẻ với ai",
      paragraphs: [
        "Các nhà cung cấp dịch vụ xử lý dữ liệu cho chúng tôi: Gmail (gửi tin nhắn biểu mẫu đến hộp thư công ty), Upstash (bộ đếm giới hạn tần suất tạo từ giá trị đã băm), Vercel (lưu trữ website và lưu trữ CV riêng tư), Google Fonts (phông chữ cho các trang tiếng Nhật, tiếng Hàn và tiếng Trung).",
      ],
    },
    {
      id: retention.id,
      heading: "Lưu trữ bao lâu",
      paragraphs: [RETENTION_DECIDED_VI],
    },
  ],
};
