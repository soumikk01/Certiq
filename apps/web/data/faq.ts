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
      "Certiq offers six professionally designed templates — Executive, Minimal, Developer, Student, Creative, and ATS Professional — each crafted for different industries and career stages. All templates are fully customizable and optimized for both visual appeal and ATS compatibility.",
  },
  {
    id: "ats",
    question: "How does ATS optimization work?",
    answer:
      "Our ATS engine scans your resume against common applicant tracking system parsers, scores keyword relevance, checks formatting compatibility, and provides actionable suggestions to improve your pass rate. You get a real-time score and a keyword match breakdown so you know exactly where to improve.",
  },
  {
    id: "pricing",
    question: "Is there a free plan available?",
    answer:
      "Yes. The Free plan lets you create one resume with access to basic templates and standard PDF export. The Pro plan unlocks all templates, AI writing assistance, certificate storage, and priority support. The Team plan adds collaboration features and shared branding for organizations.",
  },
  {
    id: "export",
    question: "What export formats are supported?",
    answer:
      "Certiq supports one-click PDF export with pixel-perfect rendering that preserves your chosen template layout. Exported files are optimized for both digital sharing and print, ensuring consistent formatting across all devices and platforms.",
  },
  {
    id: "certificates",
    question: "How does certificate storage work?",
    answer:
      "You can upload certificate images or paste credential links directly into Certiq. Certificates are stored securely and can be attached to any resume with a single click. Verified credentials display a badge that recruiters can validate instantly.",
  },
  {
    id: "ai-features",
    question: "What can the AI writing assistant do?",
    answer:
      "The AI assistant generates professional bullet points from brief descriptions, suggests stronger action verbs, tailors content to specific job postings, and rewrites sections to match industry conventions — all while preserving your authentic voice and experience.",
  },
] as const;
