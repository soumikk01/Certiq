"use client";

/**
 * AuthProvider — wraps InsForge auth SDK for the Certiq app.
 * Provides signIn (Google, LinkedIn, Email), signOut, and current user state.
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

interface User {
  id: string;
  email: string;
  name?: string | undefined;
  avatarUrl?: string | undefined;
  providers: string[];
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string; requireVerification?: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    async function loadUser() {
      try {
        // The SDK auto-detects insforge_code in URL and exchanges it for tokens.
        // getCurrentUser() waits for that exchange to complete.
        const { data } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.profile?.name ?? undefined,
            avatarUrl: data.user.profile?.avatar_url ?? undefined,
            providers: data.user.providers ?? [],
          });

          // If this was an OAuth callback, redirect to dashboard now
          if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            if (params.has("auth_callback") || params.has("insforge_code")) {
              // Clean URL and redirect to dashboard
              window.location.href = getDashboardUrl();
              return;
            }
          }
        }
      } catch {
        // No session
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // Redirect back to THIS origin for OAuth callback.
    // After token exchange completes here, we redirect to dashboard.
    await insforge.auth.signInWithOAuth({
      provider: "google",
      redirectTo: window.location.origin + "/?auth_callback=1",
    });
  }, []);

  const signInWithLinkedIn = useCallback(async () => {
    await insforge.auth.signInWithOAuth({
      provider: "linkedin",
      redirectTo: window.location.origin + "/?auth_callback=1",
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { data, error } = await insforge.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message ?? "Sign in failed" };
    }
    if (data?.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.profile?.name ?? undefined,
        avatarUrl: data.user.profile?.avatar_url ?? undefined,
        providers: data.user.providers ?? [],
      });
      // Redirect to dashboard after successful email login
      window.location.href = getDashboardUrl();
    }
    return {};
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const { data, error } = await insforge.auth.signUp({
      email,
      password,
      name,
      redirectTo: window.location.origin,
    });
    if (error) {
      return { error: error.message ?? "Sign up failed" };
    }
    if (data?.requireEmailVerification) {
      return { requireVerification: true };
    }
    if (data?.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.profile?.name ?? undefined,
        avatarUrl: data.user.profile?.avatar_url ?? undefined,
        providers: data.user.providers ?? [],
      });
    }
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await insforge.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signInWithGoogle, signInWithLinkedIn, signInWithEmail, signUp, signOut }),
    [user, loading, signInWithGoogle, signInWithLinkedIn, signInWithEmail, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Get the dashboard URL (same host, port 12001 in dev) */
function getDashboardUrl(): string {
  if (typeof window === "undefined") return "http://localhost:12001";
  const origin = window.location.origin;
  // In dev, landing is on :12000, dashboard is on :12001
  return origin.replace(":12000", ":12001");
}
