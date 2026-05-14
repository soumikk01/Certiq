import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Certiq — Dashboard",
  description: "Your resume workspace",
};

/** Inline script to set theme before first paint — prevents FOUC */
const THEME_SCRIPT = `try{var t=localStorage.getItem("certiq-theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}else{var d=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light"}}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="bg-bg-1 text-text-body font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
