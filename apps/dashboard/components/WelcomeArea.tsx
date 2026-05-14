"use client";

import { motion } from "framer-motion";

const QUICK_ACTIONS = [
  "Build a resume for a senior role",
  "Optimize my resume for ATS",
  "Create a portfolio-style CV",
];

interface WelcomeAreaProps {
  userName?: string;
}

export function WelcomeArea({ userName }: WelcomeAreaProps) {
  const firstName = userName?.split(" ")[0] ?? "there";
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      {/* Welcome heading */}
      <motion.h1
        className="font-serif text-text-headline text-5xl sm:text-6xl font-normal text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Welcome, {firstName}.
      </motion.h1>

      {/* Quick action pills */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            className="px-4 py-2 rounded-full border border-border-card bg-surface-card-1 text-text-body text-sm font-sans hover:bg-surface-card-2 hover:text-text-headline hover:border-accent/20 transition-all"
          >
            {action}
          </button>
        ))}
      </motion.div>

      {/* Main input area */}
      <motion.div
        className="w-full rounded-2xl border border-border-card bg-surface-card-1 backdrop-blur-md p-6 mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <textarea
          placeholder="What kind of resume shall we build?"
          className="w-full bg-transparent text-text-headline text-base font-sans resize-none outline-none placeholder:text-text-muted min-h-[100px]"
          rows={3}
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-card">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-text-muted text-sm font-sans hover:bg-surface-card-2 hover:text-text-headline transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              New
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card-2 border border-border-card text-text-headline text-sm font-sans"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              Resume
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-text-muted text-sm font-sans hover:bg-surface-card-2 hover:text-text-headline transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              Cover Letter
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-[#0F172A] text-sm font-sans font-medium hover:opacity-90 transition-opacity"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              Generate
            </button>
          </div>
        </div>
      </motion.div>

      {/* Start with template */}
      <motion.button
        type="button"
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-card bg-surface-card-1 text-text-muted text-sm font-sans hover:text-text-headline hover:border-accent/20 transition-all"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        Start with a template
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
      </motion.button>
    </div>
  );
}
