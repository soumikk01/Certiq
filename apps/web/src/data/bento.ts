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
    title: "AI that edits, doesn't replace",
    description: "Your voice, tightened. Stronger verbs, real metrics, zero corporate filler.",
  },
  {
    id: "real-time-preview",
    span: "1x1",
    title: "Live preview",
    description: "Every keystroke lands in the final layout. No draft mode.",
  },
  {
    id: "multi-format",
    span: "1x1",
    title: "Export anywhere",
    description: "PDF, DOCX, or a shareable URL with analytics baked in.",
  },
  {
    id: "ats-scoring",
    span: "1x2",
    title: "ATS that tells you why",
    description: "A compatibility score with the exact sentence to rewrite. Not a number you can't act on.",
  },
  {
    id: "version-history",
    span: "1x1",
    title: "Version history",
    description: "Every save is a snapshot. Roll back in one click.",
  },
  {
    id: "collaboration",
    span: "2x1",
    title: "Share before you send",
    description: "Loop in a mentor or a hiring friend without exporting a file.",
  },
  {
    id: "analytics",
    span: "1x1",
    title: "Silent analytics",
    description: "See who opened your link, for how long, without sending a follow-up.",
  },
] as const;
