"use client";

/**
 * LoginModal — centered modal with scale+fade entrance animation.
 * Shows Google, LinkedIn, and Email sign-in options.
 * Triggered by "Get Started" button or avatar click in Navbar.
 *
 * Fixed: uses fixed positioning with proper centering and high z-index
 * to always appear in the exact center of the viewport.
 */

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@certiq/ui";
import { useAuth } from "@/lib/auth/AuthProvider";

export interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps): JSX.Element | null {
  const [mounted, setMounted] = useState(false);
  const { signInWithGoogle, signInWithLinkedIn } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-hidden="true"
          />

          {/* Modal card — centered with animation */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            className="relative z-10 w-[90vw] max-w-[400px] rounded-2xl border border-border-card bg-bg-1 shadow-[0_32px_80px_rgba(0,0,0,0.5)] p-8 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close login"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-headline hover:bg-surface-card-2 transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Logo icon with accent glow circle */}
            <motion.div
              className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mb-6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Logo size={30} showWordmark={false} />
            </motion.div>

            {/* Heading */}
            <motion.h2
              id="login-modal-title"
              className="font-serif text-text-headline text-2xl font-normal text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Welcome back
            </motion.h2>
            <motion.p
              className="text-text-muted font-sans text-sm text-center mt-2 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              Sign in to access your resumes and credentials
            </motion.p>

            {/* Google button — primary dark pill */}
            <motion.button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 rounded-full bg-text-headline text-bg-1 font-sans font-medium text-sm min-h-[50px] px-5 py-3 hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </motion.button>

            {/* Divider */}
            <motion.div
              className="flex items-center gap-3 w-full my-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              <div className="flex-1 h-px bg-border-card" />
              <span className="text-text-muted font-sans text-xs uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-border-card" />
            </motion.div>

            {/* LinkedIn button */}
            <motion.button
              type="button"
              onClick={() => signInWithLinkedIn()}
              className="w-full flex items-center justify-center gap-3 rounded-full border border-border-card bg-surface-card-1 text-text-headline font-sans font-medium text-sm min-h-[50px] px-5 py-3 hover:bg-surface-card-2 hover:border-accent/20 transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 mb-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-[#0A66C2]">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </motion.button>

            {/* Email button */}
            <motion.button
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-full border border-border-card bg-surface-card-1 text-text-headline font-sans font-medium text-sm min-h-[50px] px-5 py-3 hover:bg-surface-card-2 hover:border-accent/20 transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.3 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Continue with Email
            </motion.button>

            {/* Footer */}
            <motion.p
              className="text-text-muted font-sans text-xs text-center mt-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              New to Certiq?{" "}
              <button type="button" className="text-accent hover:underline font-medium focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2">
                Create an account
              </button>
            </motion.p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
