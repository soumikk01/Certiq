"use client";

/**
 * FloatingSidebar — glass card sidebar.
 *
 * Structure:
 * - Logo + name OUTSIDE (above) the glass card — always visible
 * - Glass card contains: Workspace/History toggle, recent projects, templates
 * - ExpandableNav at the bottom
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@certiq/ui";
import { ExpandableNav } from "@/components/ExpandableNav";

const RECENT_PROJECTS = [
  { id: "1", title: "Senior Engineer Resume", date: "May 12" },
  { id: "2", title: "Product Manager CV", date: "May 8" },
  { id: "3", title: "Creative Portfolio", date: "Apr 29" },
  { id: "4", title: "Startup Founder Bio", date: "Apr 15" },
];

const TEMPLATES = [
  { id: "t1", title: "Executive", color: "rgb(var(--accent))" },
  { id: "t2", title: "Minimal", color: "#38BDF8" },
  { id: "t3", title: "Developer", color: "#A78BFA" },
];

export function FloatingSidebar() {
  const [activeId, setActiveId] = useState("1");
  const [tab, setTab] = useState<"workspace" | "history">("workspace");

  return (
    <div className="w-[270px] shrink-0 flex flex-col gap-3">
      {/* Logo + name — OUTSIDE the card, bigger, always visible */}
      <div className="flex items-center gap-3 px-2 pt-1">
        <Logo size={28} showWordmark={false} />
        <span className="font-serif text-text-headline text-xl font-normal tracking-tight">
          Certiq
        </span>
      </div>

      {/* Main glass card */}
      <aside className="flex-1 rounded-[24px] border border-border-card bg-surface-card-1 backdrop-blur-[24px] shadow-[var(--glass-shadow)] flex flex-col overflow-hidden">
        {/* Workspace / History toggle — glassy pill */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center gap-1 p-1 rounded-xl border border-border-card bg-surface-card-2 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setTab("workspace")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-sans font-medium transition-all ${
                tab === "workspace"
                  ? "bg-bg-1 text-text-headline shadow-sm border border-border-card"
                  : "text-text-muted hover:text-text-body"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              Workspace
            </button>
            <button
              type="button"
              onClick={() => setTab("history")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-sans font-medium transition-all ${
                tab === "history"
                  ? "bg-bg-1 text-text-headline shadow-sm border border-border-card"
                  : "text-text-muted hover:text-text-body"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              History
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {tab === "workspace" ? (
            <>
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
                        ? "bg-surface-card-2 border border-border-card shadow-sm"
                        : "border border-transparent hover:bg-surface-card-2"
                    }`}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className={`w-7 h-8 rounded-md flex items-center justify-center shrink-0 ${
                      isActive ? "bg-accent/15 border border-accent/25" : "bg-surface-card-2 border border-border-card"
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

              {/* Templates */}
              <div className="mt-3">
                <p className="px-3 py-1.5 text-text-muted text-[10px] font-sans font-semibold uppercase tracking-[0.12em]">
                  Templates
                </p>
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left border border-transparent hover:bg-surface-card-2 transition-colors group"
                  >
                    <div
                      className="w-7 h-8 rounded-md border border-border-card flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in srgb, ${t.color} 10%, transparent)` }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ background: t.color, opacity: 0.8 }} />
                    </div>
                    <p className="text-[11px] font-sans font-medium text-text-body group-hover:text-text-headline truncate transition-colors">
                      {t.title}
                    </p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="px-3 py-1.5 text-text-muted text-[10px] font-sans font-semibold uppercase tracking-[0.12em]">
                AI History
              </p>
              <div className="px-3 py-4 text-center">
                <p className="text-text-muted text-[11px] font-sans">No history yet</p>
                <p className="text-text-muted/60 text-[10px] font-sans mt-1">Generate your first resume to see history</p>
              </div>
            </>
          )}
        </div>

        {/* Bottom: Expandable navigation */}
        <div className="px-2 pb-3 pt-2 border-t border-border-card">
          <ExpandableNav />
        </div>
      </aside>
    </div>
  );
}
