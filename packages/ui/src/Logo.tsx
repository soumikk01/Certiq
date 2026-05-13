export interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/**
 * Certiq logo — a stylized "C" monogram with a verification check mark,
 * representing certified credentials on cinematic resumes.
 */
export function Logo({
  size = 32,
  showWordmark = true,
  className = "",
}: LogoProps): JSX.Element {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="certiqLogoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D9FF3F" />
            <stop offset="100%" stopColor="#C7FF00" />
          </linearGradient>
        </defs>
        <path
          d="M22 11.5A7 7 0 1 0 22 20.5"
          stroke="url(#certiqLogoGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="22.5" cy="16" r="2" fill="url(#certiqLogoGradient)" />
        <path
          d="M21.2 16.1L22.1 17L23.8 15.3"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="text-bg-1"
        />
      </svg>
      {showWordmark && (
        <span className="font-serif text-text-headline text-xl font-normal tracking-tight">
          Certiq
        </span>
      )}
    </div>
  );
}
