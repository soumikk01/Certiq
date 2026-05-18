"use client";

/**
 * AuthProvider for the Certiq Dashboard.
 *
 * Flow:
 * 1. User logs in on landing page → immediately redirected here
 * 2. Dashboard shows the loading animation (logo drawing)
 * 3. Meanwhile, tries to get the user session
 * 4. If session found → show dashboard
 * 5. If no session after retries → redirect to landing page
 *
 * The loading animation always plays fully (minimum 2.5s) for a premium feel.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { insforge } from "@/lib/insforge";

export interface DashboardUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | undefined;
  providers: string[];
}

interface DashboardAuthContextValue {
  user: DashboardUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const DashboardAuthContext = createContext<DashboardAuthContextValue | null>(null);

/** Minimum time to show loading animation (ms) */
const MIN_LOADING_TIME = 2500;

export function DashboardAuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const startTime = Date.now();

    async function initSession() {
      let resolvedUser: DashboardUser | null = null;

      try {
        // Try getCurrentUser — handles PKCE callback automatically
        let { data } = await insforge.auth.getCurrentUser();

        if (!data?.user) {
          // Try refresh session (shared httpOnly cookie across ports)
          try {
            const refreshResult = await insforge.auth.refreshSession();
            if (refreshResult.data) {
              const retryResult = await insforge.auth.getCurrentUser();
              data = retryResult.data;
            }
          } catch {
            // Refresh failed — will try one more time after delay
          }
        }

        // If still no user, wait a moment and try once more
        // (gives time for cookie to propagate)
        if (!data?.user) {
          await new Promise((r) => setTimeout(r, 800));
          const lastTry = await insforge.auth.getCurrentUser();
          data = lastTry.data;
        }

        if (data?.user) {
          const u = data.user;
          resolvedUser = {
            id: u.id,
            email: u.email,
            name: u.profile?.name ?? u.email.split("@")[0] ?? "User",
            avatarUrl: u.profile?.avatar_url ?? undefined,
            providers: u.providers ?? [],
          };

          // Clean URL params
          if (window.location.search.includes("insforge_code")) {
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
      } catch {
        // Auth failed
      }

      // Ensure minimum loading time for the animation to complete
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_LOADING_TIME) {
        await new Promise((r) => setTimeout(r, MIN_LOADING_TIME - elapsed));
      }

      if (cancelled) return;

      if (resolvedUser) {
        setUser(resolvedUser);
        setLoading(false);
      } else {
        // No session — redirect to landing page
        window.location.href = getLandingUrl();
      }
    }

    initSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(async () => {
    await insforge.auth.signOut();
    setUser(null);
    window.location.href = getLandingUrl();
  }, []);

  const value = useMemo(
    () => ({ user, loading, signOut }),
    [user, loading, signOut],
  );

  return (
    <DashboardAuthContext.Provider value={value}>
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth(): DashboardAuthContextValue {
  const ctx = useContext(DashboardAuthContext);
  if (!ctx) throw new Error("useDashboardAuth must be used within DashboardAuthProvider");
  return ctx;
}

/** Get the landing page URL (same host, port 12000 in dev) */
function getLandingUrl(): string {
  if (typeof window === "undefined") return "http://localhost:12000";
  const origin = window.location.origin;
  return origin.replace(":12001", ":12000");
}
