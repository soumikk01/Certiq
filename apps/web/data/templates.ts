export interface Template {
  id:
    | "executive"
    | "minimal"
    | "developer"
    | "student"
    | "creative"
    | "ats-professional";
  name: string;
  category: string;
  previewImage: string;
}

export const TEMPLATES: readonly Template[] = [
  {
    id: "executive",
    name: "Executive",
    category: "Professional",
    previewImage: "/images/templates/executive.webp",
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "Clean & Simple",
    previewImage: "/images/templates/minimal.webp",
  },
  {
    id: "developer",
    name: "Developer",
    category: "Technical",
    previewImage: "/images/templates/developer.webp",
  },
  {
    id: "student",
    name: "Student",
    category: "Academic",
    previewImage: "/images/templates/student.webp",
  },
  {
    id: "creative",
    name: "Creative",
    category: "Design & Arts",
    previewImage: "/images/templates/creative.webp",
  },
  {
    id: "ats-professional",
    name: "ATS Professional",
    category: "ATS Optimized",
    previewImage: "/images/templates/ats-professional.webp",
  },
] as const;
