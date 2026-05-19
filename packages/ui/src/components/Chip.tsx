export interface ChipProps {
  label: string;
  active?: boolean;
  className?: string;
}

/**
 * Keyword chip for ATS section (matched/missing state).
 *
 * Requirements: 11.5
 */
export function Chip({ label, active = false, className = "" }: ChipProps): JSX.Element {
  const stateClass = active
    ? "bg-accent/15 text-accent border-accent/40"
    : "bg-surface-card-1 text-text-muted border-border-card";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium border ${stateClass} ${className}`.trim()}
    >
      {label}
    </span>
  );
}
