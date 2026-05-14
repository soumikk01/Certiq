export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  profession: string;
  company: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "testimonial-1",
    quote:
      "I'd been sending the same resume for six months. Rewrote it in Certiq on a Sunday. Three callbacks by Wednesday.",
    name: "Sarah Chen",
    profession: "Senior Software Engineer",
    company: "Stripe",
  },
  {
    id: "testimonial-2",
    quote:
      "The ATS score told me exactly which keywords I'd missed. Felt less like cheating and more like finally understanding the game.",
    name: "Marcus Johnson",
    profession: "Product Manager",
    company: "Notion",
  },
  {
    id: "testimonial-3",
    quote:
      "Every other builder looked like it was designed in 2014. Certiq is the first one that doesn't embarrass my portfolio.",
    name: "Elena Rodriguez",
    profession: "Lead Product Designer",
    company: "Figma",
  },
  {
    id: "testimonial-4",
    quote:
      "I attach my AWS and GCP certificates directly in the resume now. Recruiters click the badge, it verifies, we move on. It just works.",
    name: "David Park",
    profession: "Cloud Architect",
    company: "Datadog",
  },
  {
    id: "testimonial-5",
    quote:
      "Live preview saved my weekend. No more exporting, squinting at the PDF, and making tiny tweaks on loop.",
    name: "Amara Okafor",
    profession: "Data Scientist",
    company: "Anthropic",
  },
  {
    id: "testimonial-6",
    quote:
      "Every Certiq resume that comes through our pipeline reads the same way: clear, tight, ATS-clean. It's become a quiet signal.",
    name: "James Mitchell",
    profession: "Head of Talent",
    company: "Linear",
  },
  {
    id: "testimonial-7",
    quote:
      "I drop my Certiq link in DMs now instead of a PDF. People open it. People respond. The analytics alone are worth it.",
    name: "Priya Sharma",
    profession: "Marketing Director",
    company: "Vercel",
  },
  {
    id: "testimonial-8",
    quote:
      "I had no idea how to structure a resume out of school. Certiq basically walked me through it without being condescending.",
    name: "Alex Turner",
    profession: "Junior Engineer",
    company: "Railway",
  },
] as const;
