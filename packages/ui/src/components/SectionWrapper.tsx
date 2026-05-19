import type { ReactNode } from "react";

export interface SectionWrapperProps {
  id: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  align?: "start" | "center";
  children: ReactNode;
  className?: string;
}

/**
 * Section wrapper with consistent vertical padding, optional eyebrow/heading/description.
 *
 * Enforces ≥ 96px desktop / ≥ 64px mobile vertical padding.
 *
 * Requirements: 2.7, 2.8, 2.11
 */
export function SectionWrapper({
  id,
  eyebrow,
  heading,
  description,
  align = "center",
  children,
  className = "",
}: SectionWrapperProps): JSX.Element {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <section
      id={id}
      className={`w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 ${className}`.trim()}
    >
      <div className={`mx-auto max-w-7xl flex flex-col ${alignClass}`}>
        {eyebrow && (
          <span className="text-text-muted text-xs font-sans font-medium uppercase tracking-widest mb-3">
            {eyebrow}
          </span>
        )}
        {heading && (
          <h2 className="font-serif text-text-headline text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight mb-4">
            {heading}
          </h2>
        )}
        {description && (
          <p className="text-text-body font-sans text-base sm:text-lg max-w-2xl mb-12">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
