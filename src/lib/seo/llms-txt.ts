import { aboutMeta } from "@/content/about";
import { careersMeta } from "@/content/careers";
import { homeMeta } from "@/content/home";
import { newsMeta } from "@/content/news";
import { productsMeta } from "@/content/products";
import { servicesMeta } from "@/content/services";
import { SITE_URL } from "@/lib/seo/site";

// Body of /llms.txt (audit M7, served by src/app/llms.txt/route.ts): a short Markdown map of the site for AI assistants,
// per the llms.txt convention. A route handler, not public/, so the links use
// the same origin as the canonical URLs (NEXT_PUBLIC_SITE_URL). Every line
// comes from existing page copy; no new facts.

/** The llms.txt body for a site origin (no trailing slash). */
export function llmsTxt(origin: string = SITE_URL): string {
  const page = (path: string) => `${origin}/en${path}`;
  return [
    "# XionTech",
    "",
    "> XionTech is an AI-driven product and engineering company: build smarter, ship faster. We build our own school platforms, Parent Hub, Staff Hub and AI Tutor, and custom software for clients in any industry.",
    "",
    "## Pages",
    "",
    `- [Home](${page("")}): ${homeMeta.description}`,
    `- [Services](${page("/services")}): ${servicesMeta.description}`,
    `- [Products](${page("/products")}): ${productsMeta.description}`,
    `- [About](${page("/about")}): ${aboutMeta.description}`,
    `- [News](${page("/news")}): ${newsMeta.description}`,
    `- [Careers](${page("/careers")}): ${careersMeta.description}`,
    `- [Contact](${page("#contact")}): Get in touch with the XionTech team.`,
    "",
    "## Optional",
    "",
    `- [Privacy Policy](${page("/privacy")})`,
    "",
  ].join("\n");
}
