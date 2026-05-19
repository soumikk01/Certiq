export interface ProgressIndicatorProps {
  value: number; // 0–100
  variant?: "linear" | "circular";
  animate?: boolean;
  className?: string;
  label?: string;
}

/**
 * Progress indicator (linear bar or circular ring).
 *
 * Requirements: 11.2, 11.3, 11.4
 */
export function ProgressIndicator({
  value,
  variant = "linear",
  animate = false,
  className = "",
  label,
}: ProgressIndicatorProps): JSX.Element {
  const clamped = Math.max(0, Math.min(100, value));

  if (variant === "circular") {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clamped / 100) * circumference;

    return (
      // eslint-disable-next-line jsx-a11y/aria-proptypes
      <div className={`relative inline-flex items-center justify-center ${className}`} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label || `Progress: ${clamped}%`}>
        <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-border-card opacity-30"
          />
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`text-accent ${animate ? "transition-[stroke-dashoffset] duration-[1200ms] ease-out" : ""}`}
            style={{ filter: "drop-shadow(0 0 6px rgba(217,255,63,0.4))" }}
          />
        </svg>
        <span className="absolute text-text-headline font-sans font-semibold text-lg">
          {clamped}
        </span>
      </div>
    );
  }

  // Linear variant
  return (
    // eslint-disable-next-line jsx-a11y/aria-proptypes
    <div className={`w-full ${className}`} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label || `Progress: ${clamped}%`}>
      <div className="h-2 rounded-full bg-border-card/30 overflow-hidden">
        <div
          className={`h-full rounded-full bg-accent ${animate ? "transition-[width] duration-[1200ms] ease-out" : ""}`}
          style={{
            width: `${clamped}%`,
            boxShadow: "0 0 8px rgba(217,255,63,0.4)",
          }}
        />
      </div>
    </div>
  );
}
