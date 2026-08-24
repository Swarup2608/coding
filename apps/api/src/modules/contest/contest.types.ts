import { ContestStatus } from "@coding-platform/shared";

export interface ContestProblemInput {
  problemId: string;
  label: string;
}

export interface CreateContestInput {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: ContestStatus;
  problems: ContestProblemInput[];
}

export type { ContestStatus };
