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
    description: "Get started with a polished resume using our core tools.",
    features: [
      "1 resume template",
      "Basic ATS score check",
      "PDF export",
      "Shareable resume link",
    ],
    ctaLabel: "Get Started",
    ctaVariant: "secondary",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12/mo",
    description: "Unlock the full suite of AI-powered resume tools.",
    features: [
      "All premium templates",
      "Advanced ATS optimization",
      "AI writing assistant",
      "Certificate storage",
      "Custom branding",
      "Priority support",
    ],
    ctaLabel: "Upgrade to Pro",
    ctaVariant: "primary",
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$29/mo",
    description: "Collaborate on resumes and manage credentials as a team.",
    features: [
      "Everything in Pro",
      "Team workspace",
      "Shared template library",
      "Admin dashboard",
      "Bulk PDF export",
    ],
    ctaLabel: "Contact Sales",
    ctaVariant: "secondary",
    highlighted: false,
  },
] as const;
