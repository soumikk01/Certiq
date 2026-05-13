export interface BuilderField {
  name: string;
  value: string;
}

export interface BuilderSection {
  id:
    | "profile"
    | "skills"
    | "education"
    | "projects"
    | "certifications"
    | "experience"
    | "theme";
  label: string;
  sampleFields: BuilderField[];
}

export interface BuilderMock {
  sections: BuilderSection[];
  previewThemes: string[];
  aiSuggestions: Record<string, string[]>;
}

export const BUILDER_MOCK: BuilderMock = {
  sections: [
    {
      id: "profile",
      label: "Profile",
      sampleFields: [
        { name: "Full Name", value: "Alex Johnson" },
        { name: "Title", value: "Senior Software Engineer" },
        { name: "Email", value: "alex@example.com" },
        { name: "Location", value: "San Francisco, CA" },
      ],
    },
    {
      id: "skills",
      label: "Skills",
      sampleFields: [
        { name: "Languages", value: "TypeScript, Python, Go" },
        { name: "Frameworks", value: "React, Next.js, NestJS" },
        { name: "Tools", value: "Docker, Kubernetes, AWS" },
      ],
    },
    {
      id: "education",
      label: "Education",
      sampleFields: [
        { name: "Degree", value: "B.S. Computer Science" },
        { name: "University", value: "Stanford University" },
        { name: "Year", value: "2018" },
      ],
    },
    {
      id: "projects",
      label: "Projects",
      sampleFields: [
        { name: "Project Name", value: "Open Source CLI Tool" },
        { name: "Description", value: "Built a developer productivity tool with 2k+ stars" },
      ],
    },
    {
      id: "certifications",
      label: "Certifications",
      sampleFields: [
        { name: "Certification", value: "AWS Solutions Architect" },
        { name: "Issuer", value: "Amazon Web Services" },
      ],
    },
    {
      id: "experience",
      label: "Experience",
      sampleFields: [
        { name: "Company", value: "Stripe" },
        { name: "Role", value: "Staff Engineer" },
        { name: "Duration", value: "2020 – Present" },
      ],
    },
    {
      id: "theme",
      label: "Theme Switcher",
      sampleFields: [
        { name: "Active Theme", value: "Executive" },
      ],
    },
  ],
  previewThemes: ["Executive", "Minimal", "Developer", "Creative"],
  aiSuggestions: {
    profile: ["Add a concise professional summary highlighting your key strengths."],
    skills: ["Consider grouping skills by proficiency level for clarity."],
    experience: ["Start each bullet with a strong action verb and include metrics."],
    education: ["Include relevant coursework or honors if applicable."],
    projects: ["Quantify impact — mention users, stars, or performance improvements."],
    certifications: ["List certifications in reverse chronological order."],
    theme: ["The Executive theme works best for senior-level roles."],
  },
};
