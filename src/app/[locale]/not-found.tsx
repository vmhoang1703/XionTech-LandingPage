import type { Metadata, ResolvingMetadata } from "next";
import { NotFoundView } from "@/components/layout/not-found-view";
import { getRequestLocale } from "@/i18n/request-locale";
import { SHELL } from "@/i18n/shell";

// Server Component: the 404 text is in the HTML. The layout stored the locale for this request.
export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  await parent; // the layout's generateMetadata runs first and stores the locale
  return { title: SHELL[getRequestLocale()].notFound.metaTitle };
}

export default function NotFound() {
  return <NotFoundView locale={getRequestLocale()} />;
}
