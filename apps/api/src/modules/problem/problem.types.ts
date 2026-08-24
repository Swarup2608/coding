import { Difficulty, ProblemStatus } from "@coding-platform/shared";

export type ProblemDifficulty = Difficulty;
export type { ProblemStatus };

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

export interface CreateProblemInput {
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  tags: string[];
  constraints?: string[];
  examples?: ProblemExample[];
  starterCode?: Partial<StarterCode>;
  timeLimit?: number;
  memoryLimit?: number;
}