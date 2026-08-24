export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type Language = "C" | "CPP" | "JAVA" | "PYTHON" | "JAVASCRIPT";

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface StarterCode {
  c: string;
  cpp: string;
  java: string;
  python: string;
  javascript: string;
}

export interface Problem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  constraints: string[];
  examples: ProblemExample[];
  starterCode: StarterCode;
  timeLimit: number;
  memoryLimit: number;
  status: string;
}
