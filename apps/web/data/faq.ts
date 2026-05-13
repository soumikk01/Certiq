export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "templates",
    question: "How many resume templates are available?",
    answer:
      "Six, and we're unapologetic about keeping the number small. Each template is the result of weeks of iteration with recruiters and typographers — not a clone with a different accent color. You can mix any of them across sections; the underlying grid is consistent.",
  },
  {
    id: "ats",
    question: "How does ATS optimization actually work?",
    answer:
      "Certiq parses your resume through the same open-source libraries most applicant tracking systems rely on, scores the output against the job description you paste in, and flags every keyword you're missing. Then it shows you the exact sentence to change. No guessing.",
  },
  {
    id: "pricing",
    question: "Is there really a free plan?",
    answer:
      "Yes. Free covers one resume, one template, and unlimited PDF exports — enough to land a job. Pro unlocks every template, the AI writing assistant, and certificate verification. Team adds shared libraries and admin controls for organizations.",
  },
  {
    id: "export",
    question: "What export formats do you support?",
    answer:
      "PDF is the headline. Our rendering pipeline matches the on-screen layout pixel for pixel — no surprises when a recruiter prints it. We also emit a shareable public link that opens instantly in a browser with your analytics attached.",
  },
  {
    id: "certificates",
    question: "How does certificate verification work?",
    answer:
      "Drop a certificate image or paste a credential URL. Certiq stores it, attaches a verified badge to your resume, and shows a recruiter-facing proof page when they click through. No custom integrations required.",
  },
  {
    id: "ai-features",
    question: "Will the AI make everyone's resume sound the same?",
    answer:
      "No. The AI is tuned to amplify your voice, not replace it. It suggests stronger verbs, adds metrics where you've under-sold your impact, and rewrites for tone — but it never generates content from scratch. Your story, written tighter.",
  },
  {
    id: "privacy",
    question: "What happens to my data?",
    answer:
      "Your resume content never trains our models. Certificates are encrypted at rest. You can export or delete everything in one click. We work for you, not for data brokers.",
  },
] as const;
