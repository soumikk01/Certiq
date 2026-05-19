"use client";

/**
 * GeneratedAvatar — deterministic geometric avatar generated from a name.
 *
 * Creates a unique, visually appealing avatar using the person's name as a seed.
 * No external images needed — pure SVG with gradient backgrounds and geometric shapes.
 */

interface GeneratedAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

/** Simple hash function to generate deterministic values from a string */
function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/** Premium gradient pairs */
const GRADIENT_PAIRS = [
  ["#667eea", "#764ba2"], // indigo → purple
  ["#f093fb", "#f5576c"], // pink → rose
  ["#4facfe", "#00f2fe"], // blue → cyan
  ["#43e97b", "#38f9d7"], // green → teal
  ["#fa709a", "#fee140"], // rose → yellow
  ["#a18cd1", "#fbc2eb"], // purple → pink
  ["#fccb90", "#d57eeb"], // peach → violet
  ["#667eea", "#38f9d7"], // indigo → teal
  ["#f6d365", "#fda085"], // gold → coral
  ["#89f7fe", "#66a6ff"], // cyan → blue
] as const;

export function GeneratedAvatar({ name, size = 40, className = "" }: GeneratedAvatarProps): JSX.Element {
  const hash = hashName(name);
  const gradientIndex = hash % GRADIENT_PAIRS.length;
  const [color1, color2] = GRADIENT_PAIRS[gradientIndex]!;

  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Deterministic shape parameters
  const shapeType = hash % 4; // 0: circles, 1: diamond, 2: ring, 3: dots
  const rotation = (hash % 360);
  const gradientId = `avatar-grad-${hash}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`rounded-full ${className}`}
      role="img"
      aria-label={`${name}'s avatar`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>

      {/* Background */}
      <circle cx="20" cy="20" r="20" fill={`url(#${gradientId})`} />

      {/* Decorative shape layer */}
      <g opacity="0.3" transform={`rotate(${rotation} 20 20)`}>
        {shapeType === 0 && (
          <>
            <circle cx="12" cy="12" r="4" fill="white" />
            <circle cx="28" cy="28" r="3" fill="white" />
          </>
        )}
        {shapeType === 1 && (
          <rect x="14" y="14" width="12" height="12" rx="2" fill="white" transform="rotate(45 20 20)" />
        )}
        {shapeType === 2 && (
          <circle cx="20" cy="20" r="14" fill="none" stroke="white" strokeWidth="2" />
        )}
        {shapeType === 3 && (
          <>
            <circle cx="12" cy="20" r="2" fill="white" />
            <circle cx="20" cy="12" r="2" fill="white" />
            <circle cx="28" cy="20" r="2" fill="white" />
            <circle cx="20" cy="28" r="2" fill="white" />
          </>
        )}
      </g>

      {/* Initials */}
      <text
        x="20"
        y="20"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="13"
        fontWeight="600"
        letterSpacing="0.5"
      >
        {initials}
      </text>
    </svg>
  );
}
