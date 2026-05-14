"use client";

import { Logo } from "@certiq/ui";

const RECENT_PROJECTS = [
  { id: "1", title: "Senior Engineer Resume", date: "May 12, 2026", shared: false },
  { id: "2", title: "Product Manager CV", date: "May 8, 2026", shared: true },
  { id: "3", title: "Creative Portfolio", date: "Apr 29, 2026", shared: false },
  { id: "4", title: "Startup Founder Bio", date: "Apr 15, 2026", shared: true },
];

const TEMPLATES = [
  { id: "t1", title: "Executive Template", date: "Built-in", shared: true },
  { id: "t2", title: "Minimal Template", date: "Built-in", shared: true },
  { id: "t3", title: "Developer Template", date: "Built-in", shared: false },
];

export function Sidebar() {
  return (
    <aside className="w-[280px] h-full border-r border-border-card bg-bg-2 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border-card">
        <Logo size={24} />
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-card-1 border border-border-card">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search resumes"
            className="bg-transparent text-text-body text-sm font-sans w-full outline-none placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Recent projects */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-2 py-2 text-text-muted text-xs font-sans font-medium uppercase tracking-wider">
          This year
        </p>
        <ul className="space-y-0.5">
          {RECENT_PROJECTS.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-card-1 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-card-2 border border-border-card flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-text-headline text-sm font-sans font-medium truncate group-hover:text-accent transition-colors">
                    {project.title}
                  </p>
                  <p className="text-text-muted text-xs font-sans flex items-center gap-2">
                    <span>{project.date}</span>
                    {project.shared && (
                      <span className="flex items-center gap-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        Shared
                      </span>
                    )}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <p className="px-2 py-2 mt-4 text-text-muted text-xs font-sans font-medium uppercase tracking-wider">
          Templates
        </p>
        <ul className="space-y-0.5">
          {TEMPLATES.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-card-1 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-text-headline text-sm font-sans font-medium truncate group-hover:text-accent transition-colors">
                    {t.title}
                  </p>
                  <p className="text-text-muted text-xs font-sans">{t.date}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
