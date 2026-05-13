/**
 * NoiseOverlay — full-viewport fixed noise texture layer.
 *
 * This is a React component version of the CSS noise overlay in globals.css.
 * It renders as a fixed layer with pointer-events: none, using the theme's
 * --noise-opacity token.
 *
 * Requirement 1.7
 */
export function NoiseOverlay(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        opacity: "var(--noise-opacity, 0.05)" as unknown as number,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    />
  );
}
