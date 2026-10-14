import type { Localized } from "@/i18n/content";

/**
 * Every visible string of /privacy, in one place so it can be translated later.
 * Unverified policy text starts with "[Placeholder]" (AGENTS.md hard rule 1).
 * Only `retentionDecided` is a decided fact (decision A4).
 */
const RETENTION_DECIDED =
  "Contact and demo requests, email capture submissions, job applications and CVs are kept with no time limit.";

export const PRIVACY = {
  metaTitle: "Privacy Policy | XionTech",
  metaDescription:
    "[Placeholder] How XionTech uses the personal data you share through our forms.",
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Privacy policy",
  title: "Privacy policy.",
  lede: "[Placeholder] Policy text to be supplied by the legal owner, compliant with Vietnam's Decree 13/2023 (PDPD).",
  bodyLabel: "Policy",
  outlineNote:
    "[Placeholder] Content outline. The sections below are what the policy must cover, not the real policy.",
  retentionDecided: RETENTION_DECIDED,
  sections: [
    {
      id: "privacy-who",
      heading: "Who we are and how to reach us",
      paragraphs: [
        "[Placeholder] The data controller (XionTech legal entity), its address and a contact for privacy requests.",
      ],
    },
    {
      id: "privacy-collect",
      heading: "What we collect",
      paragraphs: [
        "[Placeholder] Email, name, phone number, organisation, role and anything you send through our forms, including a CV if you apply for a job.",
        "[Placeholder] The email you type in the email capture band is sent to our company inbox like a form message. Your browser also keeps it in session storage only until the demo request page reads it.",
      ],
    },
    {
      id: "privacy-use",
      heading: "How we use it",
      paragraphs: [
        "[Placeholder] Only to answer your request, arrange a demo, or consider your job application and CV.",
      ],
    },
    {
      id: "privacy-share",
      heading: "Who we share it with",
      paragraphs: [
        "[Placeholder] Service providers that process data for us: Gmail (sends form messages to our company inbox), Upstash (rate-limit counters made from hashed values), Vercel (website hosting and private CV storage).",
      ],
    },
    {
      id: "privacy-transfers",
      heading: "Transfers outside Vietnam",
      paragraphs: [
        "[Placeholder] When data is transferred abroad (for example to our Plano office) and the safeguards required by Decree 13/2023.",
      ],
    },
    {
      id: "privacy-retention",
      heading: "How long we keep it",
      paragraphs: [
        RETENTION_DECIDED,
        "[Placeholder] The final retention wording, and whether a time limit will be added later.",
      ],
    },
    {
      id: "privacy-cookies",
      heading: "Cookies and analytics",
      paragraphs: [
        "[Placeholder] Temporary text. The final text will list the essential first-party language cookie (what it stores and why) and state that no non-essential cookies or analytics are set without your consent.",
      ],
    },
    {
      id: "privacy-rights",
      heading: "Your rights",
      paragraphs: [
        "[Placeholder] Access, correct or delete your data, or withdraw consent; how to ask for deletion is not decided yet.",
      ],
    },
  ],
} as const;

const RETENTION_DECIDED_VI =
  "Yêu cầu liên hệ và đặt lịch demo, email đăng ký nhận tin, hồ sơ ứng tuyển và CV được lưu giữ không giới hạn thời gian.";

const [who, collect, use, share, transfers, retention, cookies, rights] =
  PRIVACY.sections;

// Vietnamese. Prototype `data-vi` text where the English still matches, the
// rest AI-translated for native review (docs/translations/vi-review.md).
export const PRIVACY_VI: Localized<typeof PRIVACY> = {
  metaTitle: "Chính sách bảo mật | XionTech",
  metaDescription:
    "[Placeholder] Cách XionTech sử dụng dữ liệu cá nhân bạn chia sẻ qua các biểu mẫu của chúng tôi.",
  breadcrumbLabel: "Đường dẫn",
  breadcrumbHome: "Trang chủ",
  breadcrumbCurrent: "Chính sách bảo mật",
  title: "Chính sách bảo mật.",
  lede: "[Placeholder] Nội dung chính sách do bộ phận pháp lý cung cấp, tuân thủ Nghị định 13/2023 của Việt Nam (PDPD).",
  bodyLabel: "Chính sách",
  outlineNote:
    "[Placeholder] Dàn ý nội dung. Các mục dưới đây là những gì chính sách phải đề cập, không phải chính sách thật.",
  retentionDecided: RETENTION_DECIDED_VI,
  sections: [
    {
      id: who.id,
      heading: "Chúng tôi là ai và cách liên hệ",
      paragraphs: [
        "[Placeholder] Bên kiểm soát dữ liệu (pháp nhân XionTech), địa chỉ và đầu mối liên hệ cho các yêu cầu về quyền riêng tư.",
      ],
    },
    {
      id: collect.id,
      heading: "Chúng tôi thu thập gì",
      paragraphs: [
        "[Placeholder] Email, họ tên, số điện thoại, tổ chức, vai trò và mọi nội dung bạn gửi qua biểu mẫu của chúng tôi, bao gồm CV nếu bạn ứng tuyển.",
        "[Placeholder] Email bạn nhập ở mục đăng ký nhận tin được gửi đến hộp thư công ty như một tin nhắn biểu mẫu. Trình duyệt của bạn cũng chỉ giữ email này trong session storage cho đến khi trang đặt lịch demo đọc nó.",
      ],
    },
    {
      id: use.id,
      heading: "Chúng tôi dùng để làm gì",
      paragraphs: [
        "[Placeholder] Chỉ để trả lời yêu cầu của bạn, sắp xếp buổi demo, hoặc xét hồ sơ ứng tuyển và CV của bạn.",
      ],
    },
    {
      id: share.id,
      heading: "Chúng tôi chia sẻ với ai",
      paragraphs: [
        "[Placeholder] Các nhà cung cấp dịch vụ xử lý dữ liệu cho chúng tôi: Gmail (gửi tin nhắn biểu mẫu đến hộp thư công ty), Upstash (bộ đếm giới hạn tần suất tạo từ giá trị đã băm), Vercel (lưu trữ website và lưu trữ CV riêng tư).",
      ],
    },
    {
      id: transfers.id,
      heading: "Chuyển dữ liệu ra nước ngoài",
      paragraphs: [
        "[Placeholder] Khi dữ liệu được chuyển ra nước ngoài (ví dụ đến văn phòng Plano) và các biện pháp bảo vệ theo yêu cầu của Nghị định 13/2023.",
      ],
    },
    {
      id: retention.id,
      heading: "Lưu trữ bao lâu",
      paragraphs: [
        RETENTION_DECIDED_VI,
        "[Placeholder] Câu chữ cuối cùng về thời hạn lưu trữ, và liệu sau này có thêm giới hạn thời gian hay không.",
      ],
    },
    {
      id: cookies.id,
      heading: "Cookie và phân tích",
      paragraphs: [
        "[Placeholder] Nội dung tạm thời. Nội dung cuối cùng sẽ liệt kê cookie ngôn ngữ thiết yếu của bên thứ nhất (lưu gì và vì sao) và nêu rõ không đặt cookie không thiết yếu hay công cụ phân tích nào khi chưa có sự đồng ý của bạn.",
      ],
    },
    {
      id: rights.id,
      heading: "Quyền của bạn",
      paragraphs: [
        "[Placeholder] Truy cập, chỉnh sửa hoặc xóa dữ liệu của bạn, hoặc rút lại sự đồng ý; cách yêu cầu xóa dữ liệu chưa được quyết định.",
      ],
    },
  ],
};
