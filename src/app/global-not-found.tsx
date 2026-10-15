import type { Metadata } from "next";
import { NotFoundView } from "@/components/layout/not-found-view";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { SHELL } from "@/i18n/shell";
import { fontVariables } from "./fonts";
import { THEME_SCRIPT } from "@/lib/theme/theme-preference";
import "./globals.css";

export const metadata: Metadata = {
  title: SHELL[DEFAULT_LOCALE].notFound.metaTitle,
  robots: { index: false },
};

// Unmatched URLs (no locale layout applies) skip rendering and get this page,
// so it brings its own <html>, fonts and styles.
export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
      // The theme script sets data-theme before React hydrates.
      suppressHydrationWarning
    >
      <head>
        {/* Sets the light or dark theme before first paint, so it never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader locale={DEFAULT_LOCALE} />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
          <NotFoundView locale={DEFAULT_LOCALE} />
        </main>
        <SiteFooter locale={DEFAULT_LOCALE} />
      </body>
    </html>
  );
}
