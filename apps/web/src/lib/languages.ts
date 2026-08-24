import { Language } from "@/types/problem";

export interface LanguageConfig {
  label: string;
  monacoLanguage: string;
  starterKey: "c" | "cpp" | "java" | "python" | "javascript";
}

export const languages: Record<Language, LanguageConfig> = {
  C: { label: "C", monacoLanguage: "c", starterKey: "c" },
  CPP: { label: "C++", monacoLanguage: "cpp", starterKey: "cpp" },
  JAVA: { label: "Java", monacoLanguage: "java", starterKey: "java" },
  PYTHON: { label: "Python", monacoLanguage: "python", starterKey: "python" },
  JAVASCRIPT: { label: "JavaScript", monacoLanguage: "javascript", starterKey: "javascript" },
};
