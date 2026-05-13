import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Instrument_Serif, Inter } from "next/font/google";

import { HEAD_THEME_SCRIPT } from "./head-theme-script";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-serif",
  preload: true,
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
  preload: true,
});

/**
 * Root layout for the Certiq landing page.
 *
 * - Fonts loaded via next/font/google with CSS variable exposure.
 * - Inline theme script in <head> prevents FOUC (Requirement 22.4).
 * - ThemeProvider wraps children for useTheme() access.
 * - SSR default: data-theme="dark" (Requirement 22.8).
 */
export const metadata: Metadata = {
  title: "Certiq — Build resumes that feel premium.",
  description:
    "Certiq is a cinematic resume builder with premium templates, an AI-assisted editor, ATS scoring, and verifiable certificate storage.",
};

export const viewport: Viewport = {
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_THEME_SCRIPT }} />
      </head>
      <body className="bg-bg-1 text-text-body font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
