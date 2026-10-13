import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, LOCALES, type Locale } from "@/i18n/locales";
import { setRequestLocale } from "@/i18n/request-locale";
import { LocaleProvider } from "@/components/layout/locale-link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PointerGlow } from "@/components/sections/pointer-glow";
import { ScrollReveal } from "@/components/sections/scroll-reveal";
import "../globals.css";
import { fontVariables } from "../fonts";

const DESCRIPTION =
  "IT services and product engineering: AI, cloud, custom apps and low-code solutions.";

// No Vietnamese copy exists yet for the description (no invented Vietnamese).
const META: Record<Locale, { title: string; description: string }> = {
  en: { title: "XionTech", description: DESCRIPTION },
  vi: { title: "XionTech", description: `[Placeholder] ${DESCRIPTION}` },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

async function resolveLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  return META[locale];
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  return (
    <html
      lang={locale}
      // globals.css sets smooth scroll for in-page links; this asks Next.js 16
      // to switch it off during route changes so they stay instant.
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={locale}>
          <SiteHeader locale={locale} />
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter locale={locale} />
        </LocaleProvider>
        <ScrollReveal />
        <PointerGlow />
      </body>
    </html>
  );
}
