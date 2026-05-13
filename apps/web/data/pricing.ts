export interface PricingTier {
  id: "free" | "pro" | "team";
  name: string;
  price: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaVariant: "primary" | "secondary";
  highlighted: boolean;
}

export const PRICING_TIERS: readonly [PricingTier, PricingTier, PricingTier] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Enough to ship a resume you're proud of.",
    features: [
      "One template of your choice",
      "Unlimited PDF exports",
      "Basic ATS score",
      "Shareable resume link",
    ],
    ctaLabel: "Start free",
    ctaVariant: "secondary",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12/mo",
    description: "The full suite. What most people end up on.",
    features: [
      "Every template, unlocked",
      "Advanced ATS with rewrite suggestions",
      "AI writing assistant",
      "Certificate vault with verified badges",
      "Custom domains for shared links",
      "Priority support",
    ],
    ctaLabel: "Go Pro",
    ctaVariant: "primary",
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$29/mo",
    description: "For agencies, bootcamps, and talent teams.",
    features: [
      "Everything in Pro",
      "Shared template library",
      "Workspace-wide branding",
      "Admin controls + SSO",
      "Bulk export + CSV ingestion",
    ],
    ctaLabel: "Talk to sales",
    ctaVariant: "secondary",
    highlighted: false,
  },
] as const;
