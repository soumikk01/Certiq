"use client";

/**
 * AIWorkspace — cinematic AI prompt canvas.
 * Theme-aware: works in both dark and light mode.
 */

import { motion } from "framer-motion";

const AI_CHIPS = [
  { label: "Build ATS Resume", icon: "📄" },
  { label: "Create Portfolio CV", icon: "🎨" },
  { label: "Optimize for FAANG", icon: "🚀" },
  { label: "Generate Cover Letter", icon: "✉️" },
];

interface AIWorkspaceProps {
  userName?: string;
}

export function AIWorkspace({ userName }: AIWorkspaceProps) {
  const firstName = userName?.split(" ")[0] ?? "there";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
      {/* Welcome — compact editorial */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="font-serif text-text-headline text-4xl sm:text-5xl font-normal tracking-tight leading-tight">
          Welcome back, {firstName}.
        </h1>
        <p className="text-text-muted font-sans text-sm mt-2">
          What shall we build today?
        </p>
      </motion.div>

      {/* AI suggestion chips */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-8 max-w-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        {AI_CHIPS.map((chip) => (
          <motion.button
            key={chip.label}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border-card bg-surface-card-1 backdrop-blur-md text-text-body text-xs font-sans hover:bg-surface-card-2 hover:border-accent/20 hover:text-text-headline transition-all"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-sm">{chip.icon}</span>
            {chip.label}
          </motion.button>
        ))}
      </motion.div>

      {/* AI Prompt Box */}
      <motion.div
        className="w-full max-w-2xl rounded-[28px] border border-border-card bg-surface-card-1 backdrop-blur-[24px] shadow-[var(--glass-shadow)] overflow-hidden"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Prompt area */}
        <div className="px-6 pt-5 pb-3">
          <textarea
            placeholder="Describe the resume you want to create..."
            className="w-full bg-transparent text-text-headline text-sm font-sans resize-none outline-none placeholder:text-text-muted/60 min-h-[80px] leading-relaxed"
            rows={3}
          />
        </div>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border-card">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-muted text-[11px] font-sans hover:bg-surface-card-2 hover:text-text-headline transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Attach
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-card-2 border border-border-card text-text-headline text-[11px] font-sans"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              Resume
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-muted text-[11px] font-sans hover:bg-surface-card-2 hover:text-text-headline transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              Cover Letter
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-muted text-[11px] font-sans hover:bg-surface-card-2 hover:text-text-headline transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
              Template
            </button>
          </div>

          {/* Generate button */}
          <motion.button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-[#0F172A] text-[11px] font-sans font-semibold shadow-[0_0_20px_rgba(217,255,63,0.2)] hover:shadow-[0_0_32px_rgba(217,255,63,0.35)] transition-shadow"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            Generate
          </motion.button>
        </div>
      </motion.div>

      {/* Keyboard shortcut hint */}
      <motion.p
        className="text-text-muted/50 text-[10px] font-sans mt-4 flex items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <kbd className="px-1.5 py-0.5 rounded bg-surface-card-1 border border-border-card text-[9px]">⌘</kbd>
        <kbd className="px-1.5 py-0.5 rounded bg-surface-card-1 border border-border-card text-[9px]">Enter</kbd>
        <span>to generate</span>
      </motion.p>
    </div>
  );
}
