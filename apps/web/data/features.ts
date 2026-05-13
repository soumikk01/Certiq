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
    description: "Optimized formatting that passes automated screening systems with ease.",
    icon: "shield-check",
  },
  {
    id: "pdf",
    title: "One Click PDF Export",
    description: "Export polished, print-ready PDFs instantly with a single click.",
    icon: "file-down",
  },
  {
    id: "ai",
    title: "AI Writing Assistant",
    description: "Get intelligent suggestions to refine your content and tone.",
    icon: "sparkles",
  },
  {
    id: "certs",
    title: "Certificate Storage",
    description: "Upload and attach verified credentials directly to your resume.",
    icon: "award",
  },
  {
    id: "share",
    title: "Shareable Resume Links",
    description: "Generate unique links to share your resume with anyone, anywhere.",
    icon: "link",
  },
  {
    id: "templates",
    title: "Modern Templates",
    description: "Choose from cinematic, professionally designed resume layouts.",
    icon: "layout-template",
  },
] as const;
