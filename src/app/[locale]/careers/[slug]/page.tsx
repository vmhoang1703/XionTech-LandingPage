import { localeMetadata } from "@/i18n/page-metadata";
import { notFound } from "next/navigation";
import { JobApplicationForm } from "@/components/careers/job-application-form";
import { JobDetails } from "@/components/careers/job-details";
import { JobHero } from "@/components/careers/job-hero";
import { jobMeta, jobMetaVi } from "@/content/job";
import { isLocale } from "@/i18n/locales";
import { getOpenRole } from "@/lib/careers/open-roles";

export const generateMetadata = localeMetadata({
  en: jobMeta,
  vi: jobMetaVi,
});

// No loading.tsx here: streaming would turn the 404 into a 200.
export default async function JobPage({
  params,
}: Readonly<PageProps<"/[locale]/careers/[slug]">>) {
  const { locale: param, slug } = await params;
  const locale = isLocale(param) ? param : "en";
  const role = await getOpenRole(slug, locale);
  if (!role) notFound();

  return (
    <>
      <JobHero role={role} locale={locale} />
      <JobDetails role={role} locale={locale}>
        <JobApplicationForm slug={role.slug} />
      </JobDetails>
    </>
  );
}
