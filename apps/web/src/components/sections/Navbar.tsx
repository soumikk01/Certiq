"use client";

/**
 * Section 1 — Navbar
 *
 * Layout: [Logo + Name] ... [pill nav links with active highlight] ... [Avatar + Cart-style card + ThemeToggle]
 * Inspired by the reference image: glass pill container, accent-highlighted active link,
 * avatar circle on the right, and a card-style action button beside it.
 *
 * Requirements: 4.1–4.10, 20.9, 22.5
 */

import { useState, useEffect, useCallback } from "react";
import { Logo, ThemeToggle } from "@certiq/ui";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { LoginModal } from "@/components/LoginModal";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Templates", href: "#templates" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Builder", href: "#builder" },
] as const;

export function Navbar(): JSX.Element {
  const { theme, preference, cycle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#hero");
  const [loginOpen, setLoginOpen] = useState(false);

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
    setActiveLink(href);
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
          : "py-3 backdrop-blur-md bg-bg-1/40"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo + Name */}
        <a href="#" aria-label="Certiq home" className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded">
          <Logo size={28} showWordmark={false} />
          <span className="font-serif text-text-headline text-lg font-normal tracking-tight hidden sm:inline">
            Certiq
          </span>
        </a>

        {/* Center: Pill navigation */}
        <div className="hidden md:flex items-center rounded-full border border-border-card bg-surface-card-1 backdrop-blur-md px-1.5 py-1.5 gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeLink === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-4 py-1.5 rounded-full font-sans text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                  isActive
                    ? "bg-accent text-[#0F172A] shadow-sm"
                    : "text-text-body hover:text-text-headline"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right: Avatar + Action card + Theme toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* User avatar circle */}
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            aria-label="User profile"
            className="w-9 h-9 rounded-full border border-border-card bg-surface-card-1 backdrop-blur-md flex items-center justify-center text-text-muted hover:text-text-headline hover:border-accent/30 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Get Started card-style button */}
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-border-card bg-surface-card-1 backdrop-blur-md px-4 py-1.5 text-text-headline font-sans text-sm font-medium hover:bg-surface-card-2 hover:border-accent/30 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Get Started
          </button>

          {/* Theme toggle */}
          <ThemeToggle theme={theme} preference={preference} onToggle={cycle} />
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-1/95 backdrop-blur-xl border-b border-border-card p-6 flex flex-col gap-3">
          {NAV_LINKS.map((link) => {
            const isActive = activeLink === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`font-sans text-base py-2 px-4 rounded-lg min-h-[44px] flex items-center transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                  isActive
                    ? "bg-accent text-[#0F172A] font-medium"
                    : "text-text-body hover:text-text-headline"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <hr className="border-border-card my-2" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => { setLoginOpen(true); setMobileOpen(false); }}
              className="inline-flex items-center justify-center rounded-full bg-accent text-[#0F172A] font-sans font-medium text-sm min-h-[44px] px-6 py-2 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Get Started
            </button>
            <ThemeToggle theme={theme} preference={preference} onToggle={cycle} />
          </div>
        </div>
      )}

      {/* Login modal */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </nav>
  );
}
