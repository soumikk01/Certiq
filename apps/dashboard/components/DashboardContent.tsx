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

export function DashboardContent() {
  const { user, loading } = useDashboardAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) return null;

  return (
    <div className="relative h-screen w-screen overflow-hidden p-3 flex gap-3">
      {/* Cinematic background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(30,41,59,0.5) 0%, rgb(var(--bg-1)) 70%)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

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
