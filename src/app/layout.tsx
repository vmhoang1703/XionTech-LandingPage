import type { Metadata } from "next";
import {
  Unbounded,
  Lexend_Exa,
  Be_Vietnam_Pro,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const fontSubsets = ["latin", "vietnamese"] as const;

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: [...fontSubsets],
  weight: ["500", "600", "700"],
  display: "swap",
});

const lexendExa = Lexend_Exa({
  variable: "--font-lexend-exa",
  subsets: [...fontSubsets],
  weight: ["400", "500", "600"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: [...fontSubsets],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: [...fontSubsets],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "XionTech",
  description:
    "IT services and product engineering: AI, cloud, custom apps and low-code solutions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${lexendExa.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
