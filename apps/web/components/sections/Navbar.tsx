"use client";

/**
 * Section 1 — Navbar
 *
 * Fixed glass container with logo, center links, Login + Get Started buttons,
 * ThemeToggle, scroll compaction, and mobile overlay.
 *
 * Requirements: 4.1–4.10, 20.9, 22.5
 */

import { useState, useEffect, useCallback } from "react";
import { ThemeToggle } from "@certiq/ui";
import { useTheme } from "@/lib/theme/ThemeProvider";

const NAV_LINKS = [
  { label: "Templates", href: "#templates" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resume Builder", href: "#builder" },
  { label: "FAQ", href: "#faq" },
] as const;

export function Navbar(): JSX.Element {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 backdrop-blur-xl bg-bg-1/80 border-b border-border-card shadow-lg"
          : "py-4 backdrop-blur-md bg-bg-1/40"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-text-headline font-serif text-xl font-normal">
          <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-[#0F172A] font-bold text-sm">
            C
          </span>
          Certiq
        </a>

        {/* Center links — desktop */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-text-body font-sans text-sm hover:text-text-headline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="text-text-body font-sans text-sm hover:text-text-headline transition-colors duration-200 px-4 py-2 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Login
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-accent text-[#0F172A] font-sans font-medium text-sm min-h-[44px] px-5 py-2 hover:shadow-[0_0_24px_rgba(217,255,63,0.45)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Get Started
          </a>
          <ThemeToggle theme={theme} onToggle={toggle} />
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen ? "true" : "false"}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-text-headline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-1/95 backdrop-blur-xl border-b border-border-card p-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-text-body font-sans text-base hover:text-text-headline transition-colors py-2 min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              {link.label}
            </a>
          ))}
          <hr className="border-border-card" />
          <a
            href="/login"
            className="text-text-body font-sans text-base hover:text-text-headline py-2 min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Login
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-accent text-[#0F172A] font-sans font-medium text-base min-h-[44px] px-5 py-3 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Get Started
          </a>
          <div className="flex justify-center pt-2">
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>
        </div>
      )}
    </nav>
  );
}
