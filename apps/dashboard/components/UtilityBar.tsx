"use client";

/**
 * UtilityBar — floating minimal utility icons in top-right.
 * Replaces the traditional top navbar.
 * Contains: notifications, settings, theme toggle, avatar.
 */

import { ThemeToggle } from "@certiq/ui";
import { useDashboardTheme } from "@/lib/theme";
import type { DashboardUser } from "@/lib/auth";

interface UtilityBarProps {
  user: DashboardUser;
  onAvatarClick: () => void;
}

export function UtilityBar({ user, onAvatarClick }: UtilityBarProps) {
  const { theme, preference, cycle } = useDashboardTheme();

  const initials = user.name
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5">
      <button
        type="button"
        className="w-8 h-8 rounded-xl flex items-center justify-center text-text-muted hover:text-text-headline hover:bg-white/[0.06] transition-all"
        aria-label="Notifications"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>

      <button
        type="button"
        className="w-8 h-8 rounded-xl flex items-center justify-center text-text-muted hover:text-text-headline hover:bg-white/[0.06] transition-all"
        aria-label="Settings"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      <ThemeToggle theme={theme} preference={preference} onToggle={cycle} className="w-8 h-8 border-0 bg-transparent hover:bg-white/[0.06]" />

      {/* Avatar */}
      <button
        type="button"
        onClick={onAvatarClick}
        className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-[10px] font-sans font-bold hover:bg-accent/30 hover:scale-105 transition-all"
        aria-label={`Profile menu for ${user.name}`}
      >
        {initials}
      </button>
    </div>
  );
}
