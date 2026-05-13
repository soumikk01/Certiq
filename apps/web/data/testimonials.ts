export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  profession: string;
  company: string;
  avatarUrl?: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "testimonial-1",
    quote:
      "Certiq transformed my job search. The AI suggestions helped me tailor my resume for each role, and I landed interviews at three top companies within a week.",
    name: "Sarah Chen",
    profession: "Senior Software Engineer",
    company: "Stripe",
    avatarUrl: "/images/avatars/sarah-chen.jpg",
  },
  {
    id: "testimonial-2",
    quote:
      "The ATS optimization score gave me confidence that my resume would actually get past the screening. I went from zero callbacks to multiple offers.",
    name: "Marcus Johnson",
    profession: "Product Manager",
    company: "Notion",
  },
  {
    id: "testimonial-3",
    quote:
      "As a designer, I needed my resume to reflect my aesthetic sensibility. Certiq's templates are the only ones that feel truly premium.",
    name: "Elena Rodriguez",
    profession: "Lead Product Designer",
    company: "Figma",
    avatarUrl: "/images/avatars/elena-rodriguez.jpg",
  },
  {
    id: "testimonial-4",
    quote:
      "The certificate storage feature is a game-changer. I can attach all my AWS and Google Cloud certs directly to my resume with verified badges.",
    name: "David Park",
    profession: "Cloud Architect",
    company: "Datadog",
  },
  {
    id: "testimonial-5",
    quote:
      "I switched from a generic resume builder and immediately noticed the difference. The live preview and instant PDF export saved me hours of formatting.",
    name: "Amara Okafor",
    profession: "Data Scientist",
    company: "Anthropic",
    avatarUrl: "/images/avatars/amara-okafor.jpg",
  },
  {
    id: "testimonial-6",
    quote:
      "Our entire recruiting team recommends Certiq to candidates. The resumes that come through are consistently well-structured and ATS-friendly.",
    name: "James Mitchell",
    profession: "Head of Talent Acquisition",
    company: "Linear",
  },
  {
    id: "testimonial-7",
    quote:
      "The shareable resume links made networking so much easier. I just drop my Certiq link in messages and people are always impressed by the presentation.",
    name: "Priya Sharma",
    profession: "Marketing Director",
    company: "Vercel",
    avatarUrl: "/images/avatars/priya-sharma.jpg",
  },
  {
    id: "testimonial-8",
    quote:
      "As a recent graduate, I had no idea how to format a professional resume. Certiq's AI assistant guided me through every section perfectly.",
    name: "Alex Turner",
    profession: "Junior Developer",
    company: "Railway",
  },
] as const;
