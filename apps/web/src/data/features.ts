export interface FeatureTile {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const FEATURES: readonly FeatureTile[] = [
  {
    id: "ats",
    title: "ATS Friendly",
    description: "Layouts tuned to pass automated parsers without sacrificing design.",
    icon: "shield-check",
  },
  {
    id: "pdf",
    title: "One Click PDF Export",
    description: "Pixel-perfect PDFs that look the same on every screen and every desk.",
    icon: "file-down",
  },
  {
    id: "ai",
    title: "AI Writing Assistant",
    description: "Rewrites in your voice. Stronger verbs. Fewer clichés. Actual metrics.",
    icon: "sparkles",
  },
  {
    id: "certs",
    title: "Certificate Storage",
    description: "Upload once. Every credential verifies itself at a glance.",
    icon: "award",
  },
  {
    id: "share",
    title: "Shareable Resume Links",
    description: "A quiet URL that opens to your best work. Track who looked.",
    icon: "link",
  },
  {
    id: "templates",
    title: "Modern Templates",
    description: "Editorial typography. Tasteful whitespace. Zero clip-art.",
    icon: "layout-template",
  },
] as const;
