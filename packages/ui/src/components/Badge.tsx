import type { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "accent" | "muted";
  className?: string;
}

/**
 * Small badge/label component.
 *
 * Requirements: 10.4, 11.5
 */
export function Badge({ children, variant = "accent", className = "" }: BadgeProps): JSX.Element {
  const variants = {
    accent: "bg-accent/20 text-accent border-accent/30",
    muted: "bg-surface-card-2 text-text-muted border-border-card",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium border ${variants[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
