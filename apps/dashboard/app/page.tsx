"use client";

import { DashboardAuthProvider } from "@/lib/auth";
import { DashboardContent } from "@/components/DashboardContent";

/**
 * Dashboard page — wraps content with auth provider.
 * The auth provider handles session validation and redirects
 * unauthenticated users back to the landing page.
 */
export default function DashboardPage() {
  return (
    <DashboardAuthProvider>
      <DashboardContent />
    </DashboardAuthProvider>
  );
}
