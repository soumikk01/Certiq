"use client";

/**
 * ProfileDropdown — floating glass dropdown for user profile actions.
 * Matches the new cinematic workspace aesthetic.
 */

import { motion, AnimatePresence } from "framer-motion";
import { type DashboardUser, useDashboardAuth } from "@/lib/auth";

interface ProfileDropdownProps {
  user: DashboardUser;
  open: boolean;
  onClose: () => void;
}

export function ProfileDropdown({ user, open, onClose }: ProfileDropdownProps) {
  const { signOut } = useDashboardAuth();

  const initials = user.name
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />

          <motion.div
            className="fixed top-14 right-5 z-50 w-64 rounded-2xl border border-border-card bg-surface-card-1 backdrop-blur-[32px] shadow-[var(--glass-shadow)] overflow-hidden"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-border-card flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-sans font-bold text-xs">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-text-headline font-sans text-xs font-medium truncate">
                  {user.name}
                </p>
                <p className="text-text-muted font-sans text-[10px] truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Menu */}
            <div className="py-1.5">
              <button type="button" className="w-full px-4 py-2 text-left text-text-body text-xs font-sans hover:bg-surface-card-2 hover:text-text-headline transition-colors flex items-center gap-2.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                Settings
              </button>
              <button type="button" className="w-full px-4 py-2 text-left text-text-body text-xs font-sans hover:bg-surface-card-2 hover:text-text-headline transition-colors flex items-center gap-2.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                Account
              </button>

              <div className="my-1.5 mx-3 h-px bg-border-card" />

              <button
                type="button"
                onClick={signOut}
                className="w-full px-4 py-2 text-left text-red-400 text-xs font-sans hover:bg-red-500/10 transition-colors flex items-center gap-2.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                Sign out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
