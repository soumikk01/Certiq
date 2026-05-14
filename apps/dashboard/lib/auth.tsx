"use client";

/**
 * AuthProvider for the Certiq Dashboard.
 *
 * Handles:
 * - Session restoration on mount via insforge.auth.getCurrentUser()
 *   (the SDK automatically handles PKCE OAuth callback detection from URL params)
 * - User state management
 * - Sign out with redirect to landing page
 * - Loading state while session is being resolved
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
    async function initSession() {
      try {
        // The InsForge SDK automatically detects OAuth PKCE callback params
        // (insforge_code in URL) and exchanges them for a session.
        // getCurrentUser() waits for that exchange to complete.
        const { data, error } = await insforge.auth.getCurrentUser();

        if (data?.user) {
          const u = data.user;
          setUser({
            id: u.id,
            email: u.email,
            name: u.profile?.name ?? u.email.split("@")[0] ?? "User",
            avatarUrl: u.profile?.avatar_url ?? undefined,
            providers: u.providers ?? [],
          });

          // Clean URL params after successful auth callback
          if (typeof window !== "undefined" && window.location.search.includes("insforge_code")) {
            window.history.replaceState(null, "", window.location.pathname);
          }
        } else {
          // No session — redirect to landing page login
          window.location.href = getLandingUrl();
        }
      } catch {
        // Auth failed — redirect to landing
        window.location.href = getLandingUrl();
      } finally {
        setLoading(false);
      }
    }

    initSession();
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
  // In dev, dashboard is on :12001, landing is on :12000
  return origin.replace(":12001", ":12000");
}
