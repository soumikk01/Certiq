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
}

export const TEMPLATES: readonly Template[] = [
  {
    id: "executive",
    name: "Executive",
    category: "Professional",
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "Clean & Simple",
  },
  {
    id: "developer",
    name: "Developer",
    category: "Technical",
  },
  {
    id: "student",
    name: "Student",
    category: "Academic",
  },
  {
    id: "creative",
    name: "Creative",
    category: "Design & Arts",
  },
  {
    id: "ats-professional",
    name: "ATS Professional",
    category: "ATS Optimized",
  },
] as const;
