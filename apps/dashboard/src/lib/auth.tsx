"use client";

/**
 * DashboardAuthProvider for the Certiq Dashboard.
 *
 * Flow:
 * 1. User logs in on Web_App → redirected here
 * 2. Dashboard shows loading animation (min 2500ms)
 * 3. Tries to get session via better-auth client
 * 4. If session not immediately available, retries up to 3 times (800ms apart, max 5s total)
 * 5. If session found → show dashboard
 * 6. If no session after retries → redirect to Web_App
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";

export interface DashboardUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
}

interface DashboardAuthContextType {
  user: DashboardUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const DashboardAuthContext = createContext<DashboardAuthContextType | null>(null);

/** Minimum time to show loading animation (ms) */
const MIN_LOADING_MS = 2500;
/** Maximum retry attempts for session */
const MAX_RETRIES = 3;
/** Delay between retry attempts (ms) */
const RETRY_DELAY_MS = 800;
/** Maximum total time for retries (ms) */
const MAX_RETRY_TIME_MS = 5000;
/** Web App URL to redirect to when no session */
const WEB_APP_URL = "http://localhost:12000";

export function DashboardAuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const { data: session, isPending } = authClient.useSession();
  const [ready, setReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const retryCount = useRef(0);
  const startTime = useRef(Date.now());
  const redirected = useRef(false);

  // Minimum loading time for animation
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  // Session retry logic
  useEffect(() => {
    if (isPending) return;

    // Session found — mark ready
    if (session?.user) {
      setReady(true);
      return;
    }

    // No session — retry or redirect
    if (retryCount.current < MAX_RETRIES) {
      const elapsed = Date.now() - startTime.current;
      if (elapsed < MAX_RETRY_TIME_MS) {
        const timer = setTimeout(() => {
          retryCount.current++;
          // Force re-fetch session
          authClient.getSession();
        }, RETRY_DELAY_MS);
        return () => clearTimeout(timer);
      }
    }

    // All retries exhausted or max time exceeded — redirect to Web_App
    if (!redirected.current) {
      redirected.current = true;
      window.location.href = WEB_APP_URL;
    }
  }, [isPending, session]);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    window.location.href = WEB_APP_URL;
  }, []);

  const loading = !ready || !minTimeElapsed;

  const user: DashboardUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email.split("@")[0] || "User",
        image: session.user.image ?? null,
      }
    : null;

  return (
    <DashboardAuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth(): DashboardAuthContextType {
  const context = useContext(DashboardAuthContext);
  if (!context) {
    throw new Error("useDashboardAuth must be used within DashboardAuthProvider");
  }
  return context;
}
