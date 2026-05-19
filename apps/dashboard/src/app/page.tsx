"use client";

import { DashboardAuthProvider } from "@/lib/auth";
import { DashboardThemeProvider } from "@/lib/theme";
import { DashboardContent } from "@/components/DashboardContent";

/**
 * Dashboard page — wraps content with auth and theme providers.
 */
export default function DashboardPage() {
  return (
    <DashboardThemeProvider>
      <DashboardAuthProvider>
        <DashboardContent />
      </DashboardAuthProvider>
    </DashboardThemeProvider>
  );
}
