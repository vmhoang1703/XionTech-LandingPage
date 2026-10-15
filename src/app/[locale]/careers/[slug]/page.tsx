import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobApplicationForm } from "@/components/careers/job-application-form";
import { JobDetails } from "@/components/careers/job-details";
import { JobHero } from "@/components/careers/job-hero";
import { jobMeta, jobMetaVi } from "@/content/job";
import { pickLocale } from "@/i18n/content";
import { isLocale } from "@/i18n/locales";
import { seoMetadata, summaryDescription } from "@/lib/seo/site";
import { breadcrumbLd, jobPostingLd, JsonLd } from "@/lib/seo/json-ld";
import { SHELL } from "@/i18n/shell";
import { getOpenRole } from "@/lib/careers/open-roles";

type JobProps = Readonly<PageProps<"/[locale]/careers/[slug]">>;

// "<Role> | Careers at XionTech"; the description is the start of the role summary.
export async function generateMetadata({
  params,
}: JobProps): Promise<Metadata> {
  const { locale: param, slug } = await params;
  const locale = isLocale(param) ? param : "en";
  const role = await getOpenRole(slug, locale);
  const meta = pickLocale(locale, { en: jobMeta, vi: jobMetaVi });
  if (!role) return { title: meta.title };
  return seoMetadata(locale, `/careers/${role.slug}`, {
    title: meta.roleTitle(role.title),
    description: role.about?.trim()
      ? summaryDescription(role.about)
      : meta.description,
  });
}

// No loading.tsx here: streaming would turn the 404 into a 200.
export default async function JobPage({ params }: JobProps) {
  const { locale: param, slug } = await params;
  const locale = isLocale(param) ? param : "en";
  const role = await getOpenRole(slug, locale);
  if (!role) notFound();

  return (
    <>
      <JsonLd
        data={[
          jobPostingLd(locale, role),
          breadcrumbLd(locale, [
            { name: SHELL[locale].nav.careers, path: "/careers" },
            { name: role.title, path: `/careers/${role.slug}` },
          ]),
        ]}
      />
      <JobHero role={role} locale={locale} />
      <JobDetails role={role} locale={locale}>
        <JobApplicationForm slug={role.slug} />
      </JobDetails>
    </>
  );
}
