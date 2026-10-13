import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import NotFound from "./[locale]/not-found";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = { robots: { index: false } };

// Unmatched URLs (no locale layout applies) skip rendering and get this page,
// so it brings its own <html>, fonts and styles.
export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader locale={DEFAULT_LOCALE} />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
          <NotFound />
        </main>
        <SiteFooter locale={DEFAULT_LOCALE} />
      </body>
    </html>
  );
}
