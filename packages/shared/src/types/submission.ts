import { Language } from "./problem.js";

export type SubmissionMode = "RUN" | "SUBMIT";

export type SubmissionStatus =
  | "QUEUED"
  | "COMPILING"
  | "RUNNING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT"
  | "MEMORY_LIMIT"
  | "RUNTIME_ERROR"
  | "COMPILE_ERROR"
  | "SYSTEM_ERROR";

export interface CreateSubmissionInput {
  problemId: string;
  language: Language;
  code: string;
  mode: SubmissionMode;
  contestId?: string;
}
