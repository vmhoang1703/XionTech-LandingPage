import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { htmlLang, isLocale, LOCALES } from "@/i18n/locales";
import { setRequestLocale } from "@/i18n/request-locale";
import { META } from "@/i18n/site-meta";
import { LocaleProvider } from "@/components/layout/locale-link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SwipeRows } from "@/components/sections/swipe-rows";
import { TouchPress } from "@/components/sections/touch-press";
import { PageFade } from "@/components/sections/page-fade";
import { PointerGlow } from "@/components/sections/pointer-glow";
import { ScrollReveal } from "@/components/sections/scroll-reveal";
import "../globals.css";
import { fontVariables } from "../fonts";

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
      lang={htmlLang(locale)}
      // globals.css sets smooth scroll for in-page links; this asks Next.js 16
      // to switch it off during route changes so they stay instant.
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* With no script, a count-up figure shows its number (count-up.tsx). */}
        <noscript>
          <style>{`.count-up[data-count="wait"] { --count: var(--to) !important; }`}</style>
        </noscript>
        <LocaleProvider locale={locale}>
          <SiteHeader locale={locale} />
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter locale={locale} />
        </LocaleProvider>
        <ScrollReveal />
        <PointerGlow />
        <SwipeRows />
        <TouchPress />
        <PageFade />
      </body>
    </html>
  );
}
