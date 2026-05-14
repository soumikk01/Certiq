"use client";

/**
 * FloatingSidebar — glass card sidebar floating off screen edges.
 *
 * Rounded 28px corners, translucent glass, ambient shadow.
 * Contains: logo, search, recent resumes, templates.
 * Inspired by Stitch / Linear sidebar.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@certiq/ui";
import { ExpandableNav } from "@/components/ExpandableNav";

const RECENT_PROJECTS = [
  { id: "1", title: "Senior Engineer Resume", date: "May 12", icon: "resume", active: true },
  { id: "2", title: "Product Manager CV", date: "May 8", icon: "resume", active: false },
  { id: "3", title: "Creative Portfolio", date: "Apr 29", icon: "portfolio", active: false },
  { id: "4", title: "Startup Founder Bio", date: "Apr 15", icon: "resume", active: false },
];

const TEMPLATES = [
  { id: "t1", title: "Executive", color: "#D9FF3F" },
  { id: "t2", title: "Minimal", color: "#38BDF8" },
  { id: "t3", title: "Developer", color: "#A78BFA" },
];

export function FloatingSidebar() {
  const [activeId, setActiveId] = useState("1");

  return (
    <aside className="w-[260px] shrink-0 rounded-[28px] border border-border-card bg-surface-card-1 backdrop-blur-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">
      {/* Logo + brand */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2.5">
        <Logo size={22} showWordmark={false} />
        <span className="font-serif text-text-headline text-base font-normal tracking-tight">
          Certiq
        </span>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted shrink-0">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-text-body text-xs font-sans w-full outline-none placeholder:text-text-muted"
          />
          <kbd className="text-[9px] text-text-muted bg-white/[0.06] px-1.5 py-0.5 rounded font-sans">⌘K</kbd>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/[0.06]" />

      {/* Recent projects */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        <p className="px-3 py-1.5 text-text-muted text-[10px] font-sans font-semibold uppercase tracking-[0.12em]">
          Recent
        </p>
        {RECENT_PROJECTS.map((project) => {
          const isActive = activeId === project.id;
          return (
            <motion.button
              key={project.id}
              type="button"
              onClick={() => setActiveId(project.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150 group ${
                isActive
                  ? "bg-white/[0.08] border border-white/[0.1] shadow-[0_2px_12px_rgba(217,255,63,0.08)]"
                  : "border border-transparent hover:bg-white/[0.04]"
              }`}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              {/* Mini preview */}
              <div className={`w-7 h-8 rounded-md flex items-center justify-center shrink-0 ${
                isActive ? "bg-accent/15 border border-accent/25" : "bg-white/[0.06] border border-white/[0.08]"
              }`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isActive ? "text-accent" : "text-text-muted"}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] font-sans font-medium truncate ${
                  isActive ? "text-text-headline" : "text-text-body group-hover:text-text-headline"
                }`}>
                  {project.title}
                </p>
                <p className="text-[9px] text-text-muted font-sans">{project.date}</p>
              </div>
            </motion.button>
          );
        })}

        {/* Templates section */}
        <div className="mt-3">
          <p className="px-3 py-1.5 text-text-muted text-[10px] font-sans font-semibold uppercase tracking-[0.12em]">
            Templates
          </p>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left border border-transparent hover:bg-white/[0.04] transition-colors group"
            >
              <div
                className="w-7 h-8 rounded-md border border-white/[0.08] flex items-center justify-center shrink-0"
                style={{ background: `${t.color}10` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: t.color, opacity: 0.7 }} />
              </div>
              <p className="text-[11px] font-sans font-medium text-text-body group-hover:text-text-headline truncate transition-colors">
                {t.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom: Expandable navigation */}
      <div className="px-2 pb-3 pt-2">
        <ExpandableNav />
      </div>
    </aside>
  );
}
