export interface AtsKeyword {
  term: string;
  matched: boolean;
}

export interface AtsSuggestion {
  id: string;
  text: string;
}

export interface AtsMock {
  score: number;
  strength: number;
  keywords: AtsKeyword[];
  suggestions: AtsSuggestion[];
}

export const ATS_MOCK: AtsMock = {
  score: 82,
  strength: 74,
  keywords: [
    { term: "TypeScript", matched: true },
    { term: "React", matched: true },
    { term: "CI/CD", matched: true },
    { term: "Agile", matched: false },
    { term: "Cloud Architecture", matched: false },
  ],
  suggestions: [
    {
      id: "sug-1",
      text: "Add measurable achievements with specific metrics to strengthen impact.",
    },
    {
      id: "sug-2",
      text: "Include relevant industry certifications to improve keyword matching.",
    },
    {
      id: "sug-3",
      text: "Use action verbs at the start of each bullet point for clarity.",
    },
    {
      id: "sug-4",
      text: "Tailor your summary section to align with the target job description.",
    },
  ],
};
