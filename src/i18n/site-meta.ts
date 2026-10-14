import type { Locale } from "./locales";

// Site-wide title and description, the fallback for pages that set no metadata of their own.
const DESCRIPTION =
  "IT services and product engineering: AI, cloud, custom apps and low-code solutions.";

export const META: Record<Locale, { title: string; description: string }> = {
  en: { title: "XionTech", description: DESCRIPTION },
  vi: {
    title: "XionTech",
    description:
      "Dịch vụ CNTT và phát triển sản phẩm: AI, cloud, ứng dụng tùy chỉnh và giải pháp low-code.",
  },
};
