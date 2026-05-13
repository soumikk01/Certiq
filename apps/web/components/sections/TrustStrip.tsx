/**
 * Section 4 — TrustStrip
 *
 * Six glass tiles from data/features.ts. Desktop row, tablet 3×2, mobile scroll-snap.
 *
 * Requirements: 7.1–7.8
 */

import { FEATURES } from "@/data/features";

const ICONS: Record<string, string> = {
  "shield-check": "🛡️",
  "file-down": "📄",
  sparkles: "✨",
  award: "🏆",
  link: "🔗",
  "layout-template": "📐",
};

export function TrustStrip(): JSX.Element {
  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto snap-x snap-mandatory lg:overflow-visible">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="snap-start min-w-[160px] rounded-xl border border-border-card bg-surface-card-1 backdrop-blur-[16px] p-5 flex flex-col items-center text-center gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(217,255,63,0.2)] hover:border-accent/30"
            >
              <span className="text-2xl" aria-hidden="true">
                {ICONS[feature.icon] ?? "⚡"}
              </span>
              <h3 className="text-text-headline font-sans text-sm font-medium">
                {feature.title}
              </h3>
              <p className="text-text-muted font-sans text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
