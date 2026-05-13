import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: boolean;
  href?: string;
  children: ReactNode;
}

/**
 * Shared Button primitive.
 *
 * - Primary: Accent_Color bg, #0F172A text, Accent_Glow on hover, pill shape, min-h 44px.
 * - Secondary: glass bg, Card_Border, Text_Headline text, pill shape, min-h 44px.
 *
 * Requirements: 1.9, 1.11, 3.6, 18.5
 */
export function Button({
  variant = "primary",
  asChild = false,
  href,
  children,
  className = "",
  ...props
}: ButtonProps): JSX.Element {
  const base =
    "inline-flex items-center justify-center rounded-full font-sans font-medium text-sm min-h-[44px] px-6 py-3 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-accent text-[#0F172A] hover:shadow-[0_0_24px_rgba(217,255,63,0.45)] active:scale-[0.97]",
    secondary:
      "bg-surface-card-1 border border-border-card text-text-headline backdrop-blur-md hover:bg-surface-card-2 active:scale-[0.97]",
  };

  const classes = `${base} ${variants[variant]} ${className}`.trim();

  if (asChild && href) {
    return (
      <a href={href} className={classes} role="button">
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
