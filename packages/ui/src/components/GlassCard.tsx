import type { HTMLAttributes, ReactNode } from "react";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  tint?: "default" | "strong";
  interactive?: boolean;
  children: ReactNode;
}

/**
 * Glass-morphism card with backdrop blur, themed surface, and border.
 *
 * - tint="default": Card_Surface_1 (subtle)
 * - tint="strong": Card_Surface_2 (more opaque)
 * - interactive: enables hover lift + accent glow
 *
 * Requirements: 1.4, 1.8
 */
export function GlassCard({
  tint = "default",
  interactive = false,
  children,
  className = "",
  ...props
}: GlassCardProps): JSX.Element {
  const base =
    "rounded-2xl border border-border-card shadow-[var(--shadow-glass)]";

  const tintClass = tint === "strong" ? "bg-surface-card-2" : "bg-surface-card-1";

  const blur = "backdrop-blur-[16px]";

  const interactiveClass = interactive
    ? "transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(217,255,63,0.3)]"
    : "";

  return (
    <div
      className={`${base} ${tintClass} ${blur} ${interactiveClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
