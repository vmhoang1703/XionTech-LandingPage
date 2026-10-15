import type { Locale } from "./locales";

export interface SiteMeta {
  title: string;
  description: string;
}

// Site-wide title and description, the fallback for pages that set no metadata of their own.
const DESCRIPTION =
  "IT services and product engineering: AI, cloud, custom apps and low-code solutions.";

const en: SiteMeta = { title: "XionTech", description: DESCRIPTION };

export const META: Record<Locale, SiteMeta> = {
  en,
  vi: {
    title: "XionTech",
    description:
      "Dịch vụ CNTT và phát triển sản phẩm: AI, cloud, ứng dụng tùy chỉnh và giải pháp low-code.",
  },
};
