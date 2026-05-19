"use client";

/**
 * CertificatePreview — code-generated certificate card previews.
 *
 * Each certificate renders a unique branded mini-certificate using
 * pure SVG + HTML/CSS. No external images needed.
 */

interface CertificatePreviewProps {
  certId: string;
  className?: string;
}

/** Brand colors and icons for each certificate issuer */
const CERT_BRANDS: Record<string, { bg: string; accent: string; icon: JSX.Element; pattern: string }> = {
  "cert-aws": {
    bg: "linear-gradient(135deg, #232F3E 0%, #1a2332 100%)",
    accent: "#FF9900",
    pattern: "radial-gradient(circle at 80% 20%, rgba(255,153,0,0.15) 0%, transparent 50%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M6.5 17.5c-1.5-1-2.5-2.5-2.5-4.5 0-3 2.5-5.5 5.5-5.5.5 0 1 .1 1.5.2C11.5 5.5 13.5 4 16 4c3 0 5.5 2.5 5.5 5.5 0 .5-.1 1-.2 1.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 20l4-4 4 4" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 20V12" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  "cert-gcp": {
    bg: "linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)",
    accent: "#FBBC04",
    pattern: "radial-gradient(circle at 20% 80%, rgba(251,188,4,0.15) 0%, transparent 50%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="#FBBC04" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 22V12" stroke="#FBBC04" strokeWidth="1.5" />
        <path d="M3 7l9 5 9-5" stroke="#FBBC04" strokeWidth="1.5" />
      </svg>
    ),
  },
  "cert-k8s": {
    bg: "linear-gradient(135deg, #326CE5 0%, #2554b8 100%)",
    accent: "#FFFFFF",
    pattern: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  "cert-azure": {
    bg: "linear-gradient(135deg, #0078D4 0%, #005a9e 100%)",
    accent: "#50E6FF",
    pattern: "radial-gradient(circle at 70% 30%, rgba(80,230,255,0.15) 0%, transparent 50%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M5 4h6l-6 16h14" stroke="#50E6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 4l6 8-6 8" stroke="#50E6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

export function CertificatePreview({ certId, className = "" }: CertificatePreviewProps): JSX.Element {
  const brand = CERT_BRANDS[certId] ?? CERT_BRANDS["cert-aws"]!;

  return (
    <div
      className={`w-full h-full rounded-xl overflow-hidden relative ${className}`}
      style={{ background: brand.bg }}
    >
      {/* Background pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: brand.pattern }}
      />

      {/* Decorative border glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 0 1px rgba(255,255,255,0.08)` }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col p-4">
        {/* Top: icon + label */}
        <div className="flex items-start justify-between">
          <div className="w-8 h-8 rounded-lg bg-white/10 p-1.5 backdrop-blur-sm border border-white/10">
            {brand.icon}
          </div>
          <span
            className="text-[7px] font-sans font-medium tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
            style={{ background: `${brand.accent}20`, color: brand.accent }}
          >
            Certificate
          </span>
        </div>

        {/* Middle: decorative lines representing certificate content */}
        <div className="mt-4 space-y-1.5 flex-1">
          <div className="h-1 w-[70%] rounded-full bg-white/25" />
          <div className="h-1 w-[55%] rounded-full bg-white/15" />
          <div className="h-1 w-[80%] rounded-full bg-white/15" />
          <div className="mt-3 h-0.5 w-full bg-white/10" />
          <div className="h-1 w-[60%] rounded-full bg-white/15" />
          <div className="h-1 w-[45%] rounded-full bg-white/15" />
        </div>

        {/* Bottom: seal + signature line */}
        <div className="flex items-end justify-between mt-auto pt-3">
          <div className="space-y-1">
            <div className="h-0.5 w-12 rounded-full bg-white/30" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
          {/* Seal */}
          <div
            className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: `${brand.accent}60` }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: `${brand.accent}40` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
