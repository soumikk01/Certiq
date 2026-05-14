"use client";

/**
 * AuthProvider for the Certiq Dashboard.
 *
 * Auth flow:
 * 1. User logs in on landing page (port 12000) via InsForge OAuth
 * 2. OAuth callback returns to landing page, SDK exchanges code for tokens
 * 3. InsForge sets httpOnly refresh cookie (shared across localhost ports)
 * 4. Landing page redirects to dashboard (port 12001)
 * 5. Dashboard calls getCurrentUser() → if no memory token, tries refreshSession()
 *    using the shared httpOnly cookie to get a fresh access token
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

export function DashboardAuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initSession() {
      try {
        // First try: getCurrentUser() — works if SDK has tokens in memory
        // or if there's an insforge_code in the URL to exchange
        let { data, error } = await insforge.auth.getCurrentUser();

        if (!data?.user) {
          // No user from getCurrentUser — try refreshing the session.
          // The httpOnly refresh cookie is shared across localhost ports,
          // so refreshSession() can obtain a new access token.
          const refreshResult = await insforge.auth.refreshSession();
          if (refreshResult.data) {
            // Refresh succeeded — now getCurrentUser should work
            const retryResult = await insforge.auth.getCurrentUser();
            data = retryResult.data;
          }
        }

        if (cancelled) return;

        if (data?.user) {
          const u = data.user;
          setUser({
            id: u.id,
            email: u.email,
            name: u.profile?.name ?? u.email.split("@")[0] ?? "User",
            avatarUrl: u.profile?.avatar_url ?? undefined,
            providers: u.providers ?? [],
          });

          // Clean URL params if present
          if (window.location.search.includes("insforge_code")) {
            window.history.replaceState(null, "", window.location.pathname);
          }
        } else {
          // No session at all — redirect to landing page to log in
          if (!cancelled) {
            window.location.href = getLandingUrl();
          }
          return;
        }
      } catch {
        // Auth completely failed — redirect to landing
        if (!cancelled) {
          window.location.href = getLandingUrl();
        }
        return;
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
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
