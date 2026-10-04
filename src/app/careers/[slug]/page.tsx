import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobApplicationForm } from "@/components/careers/job-application-form";
import { JobDetails } from "@/components/careers/job-details";
import { JobHero } from "@/components/careers/job-hero";
import { jobMeta } from "@/content/job";
import { getOpenRole } from "@/lib/careers/open-roles";

export const metadata: Metadata = {
  title: jobMeta.title,
  description: jobMeta.description,
};

// No loading.tsx here: streaming would turn the 404 into a 200.
export default async function JobPage({
  params,
}: Readonly<PageProps<"/careers/[slug]">>) {
  const { slug } = await params;
  const role = await getOpenRole(slug);
  if (!role) notFound();

  return (
    <>
      <JobHero role={role} />
      <JobDetails role={role}>
        <JobApplicationForm slug={role.slug} />
      </JobDetails>
    </>
  );
}
