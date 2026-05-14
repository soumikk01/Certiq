"use client";

/**
 * DashboardContent — cinematic AI workspace layout.
 *
 * Structure: floating glass sidebar + main AI workspace canvas.
 * No traditional navbar. Utility icons float in top-right.
 * Inspired by Stitch, Linear, Arc Browser.
 */

import { useState } from "react";
import { useDashboardAuth } from "@/lib/auth";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import { AIWorkspace } from "@/components/AIWorkspace";
import { UtilityBar } from "@/components/UtilityBar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DotGridBackground } from "@/components/DotGridBackground";

export function DashboardContent() {
  const { user, loading } = useDashboardAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) return null;

  return (
    <div className="relative h-screen w-screen overflow-hidden p-3 flex gap-3">
      {/* Interactive dot grid background with cursor glow */}
      <DotGridBackground />

      {/* Floating sidebar */}
      <FloatingSidebar />

      {/* Main workspace */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Floating utility icons — top right */}
        <UtilityBar
          user={user}
          onAvatarClick={() => setProfileOpen(!profileOpen)}
        />

        {/* AI workspace canvas */}
        <AIWorkspace userName={user.name} />
      </div>

      {/* Profile dropdown */}
      <ProfileDropdown
        user={user}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}
