export type BentoSpan = "1x1" | "2x1" | "1x2" | "2x2";

export interface BentoTile {
  id: string;
  span: BentoSpan;
  title: string;
  description: string;
}

export const BENTO_TILES: readonly BentoTile[] = [
  {
    id: "ai-powered",
    span: "2x1",
    title: "AI-Powered Writing",
    description: "Get intelligent suggestions that match your industry and role level.",
  },
  {
    id: "real-time-preview",
    span: "1x1",
    title: "Real-Time Preview",
    description: "See changes instantly as you type with our live editor.",
  },
  {
    id: "multi-format",
    span: "1x1",
    title: "Multi-Format Export",
    description: "Export to PDF, DOCX, or share via a unique link.",
  },
  {
    id: "ats-scoring",
    span: "1x2",
    title: "ATS Scoring Engine",
    description: "Get a compatibility score before you submit your application.",
  },
  {
    id: "version-history",
    span: "1x1",
    title: "Version History",
    description: "Track every change and revert to any previous version.",
  },
  {
    id: "collaboration",
    span: "2x1",
    title: "Team Collaboration",
    description: "Share templates and review resumes with your team in real time.",
  },
  {
    id: "analytics",
    span: "1x1",
    title: "Resume Analytics",
    description: "Track views and engagement on your shared resume links.",
  },
] as const;
