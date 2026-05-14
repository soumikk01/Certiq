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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-bg-1 text-text-body font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
