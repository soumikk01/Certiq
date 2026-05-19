"use client";

import { createContext, useContext, useCallback, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:12001",
    });
  }, []);

  const signInWithLinkedIn = useCallback(async () => {
    setError(null);
    await authClient.signIn.social({
      provider: "linkedin",
      callbackURL: "http://localhost:12001",
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setError(null);
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      setError(result.error.message || "Sign in failed");
      return;
    }
    window.location.href = "http://localhost:12001";
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setError(null);
    const result = await authClient.signUp.email({ email, password, name });
    if (result.error) {
      setError(result.error.message || "Sign up failed");
      return;
    }
    window.location.href = "http://localhost:12001";
  }, []);

  const signOut = useCallback(async () => {
    await authClient.signOut();
  }, []);

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image ?? null,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isPending,
        signInWithGoogle,
        signInWithLinkedIn,
        signInWithEmail,
        signUp,
        signOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
