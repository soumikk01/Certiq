"use client";

/**
 * DashboardContent — main dashboard shell that reads auth state.
 * Shows a premium logo-drawing animation while session is being resolved,
 * then renders the full dashboard with real user data.
 */

import { useState } from "react";
import { useDashboardAuth } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { WelcomeArea } from "@/components/WelcomeArea";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { LoadingScreen } from "@/components/LoadingScreen";

export function DashboardContent() {
  const { user, loading } = useDashboardAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    // This shouldn't render — auth provider redirects if no user
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with real user data */}
        <TopBar
          user={user}
          onAvatarClick={() => setProfileOpen(!profileOpen)}
        />

        {/* Center workspace */}
        <main className="flex-1 overflow-y-auto px-8 py-10">
          <WelcomeArea userName={user.name} />
        </main>
      </div>

      {/* Profile dropdown with real user data */}
      <ProfileDropdown
        user={user}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}
