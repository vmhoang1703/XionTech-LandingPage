import { SOCIAL_LINKS } from "@/content/site-footer";
import { htmlLang, type Locale } from "@/i18n/locales";
import { SHELL } from "@/i18n/shell";
import { localePath, SITE_URL } from "./site";

type Thing = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const absolute = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path}`;

/**
 * The company. No address on purpose: the registered office and the delivery
 * centers differ and must not be merged (Amber, 2026-10-16). No founding year.
 */
export function organizationLd(): Thing {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "XionTech",
    legalName: "XionTech Joint Stock Company",
    url: SITE_URL,
    logo: absolute("/brand/xiontechs-logo.png"),
    email: "contact@xiontechs.com",
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  };
}

export function websiteLd(locale: Locale): Thing {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "XionTech",
    url: absolute(localePath(locale, "/")),
    inLanguage: htmlLang(locale),
    publisher: { "@id": ORG_ID },
  };
}

export type Crumb = { name: string; path: string };

/** Home, then each crumb; `path` is after the locale ("/news/x"). */
export function breadcrumbLd(locale: Locale, crumbs: Crumb[]): Thing {
  const all = [{ name: SHELL[locale].nav.home, path: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    itemListElement: all.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absolute(localePath(locale, crumb.path)),
    })),
  };
}

export function articleLd(
  locale: Locale,
  story: {
    slug: string;
    title: string;
    excerpt?: string | null;
    publishedAt: string;
    image?: string | null;
  },
): Thing {
  return {
    "@type": "Article",
    headline: story.title,
    ...(story.excerpt ? { description: story.excerpt } : {}),
    datePublished: story.publishedAt,
    ...(story.image ? { image: [story.image] } : {}),
    mainEntityOfPage: absolute(localePath(locale, `/news/${story.slug}`)),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

const EMPLOYMENT_TYPES: Record<string, string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
};

/** Only fields the job document really has (no salary, no address). */
export function jobPostingLd(
  locale: Locale,
  role: {
    slug: string;
    title: string;
    about?: string | null;
    location?: string | null;
    type?: string | null;
    createdAt?: string | null;
  },
): Thing {
  const employmentType = role.type ? EMPLOYMENT_TYPES[role.type] : undefined;
  return {
    "@type": "JobPosting",
    title: role.title,
    ...(role.about ? { description: role.about } : {}),
    ...(role.createdAt ? { datePosted: role.createdAt } : {}),
    ...(employmentType ? { employmentType } : {}),
    ...(role.location
      ? {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: role.location,
            },
          },
        }
      : {}),
    url: absolute(localePath(locale, `/careers/${role.slug}`)),
    hiringOrganization: {
      "@type": "Organization",
      name: "XionTech",
      sameAs: SITE_URL,
    },
  };
}

/** One JSON-LD script; "<" is escaped so text cannot close the tag. */
export function JsonLd({ data }: Readonly<{ data: Thing | Thing[] }>) {
  const graph = Array.isArray(data) ? data : [data];
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replaceAll("<", "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD needs raw JSON
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
