/**
 * AccentGlow — radial gradient glow component with theme-aware opacity.
 *
 * Requirements: 1.10, 5.10, 6.2, 16.3
 */

export interface AccentGlowProps {
  className?: string;
  size?: string;
  opacity?: string;
}

export function AccentGlow({
  className = "",
  size = "50%",
  opacity,
}: AccentGlowProps): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        opacity: opacity ?? "var(--glow-accent-ambient)",
        background:
          "radial-gradient(circle, rgba(217,255,63,0.6) 0%, rgba(217,255,63,0) 70%)",
        filter: "blur(60px)",
      }}
    />
  );
}
