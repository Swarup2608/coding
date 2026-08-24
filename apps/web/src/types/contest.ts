import { ContestStatus } from "@coding-platform/shared";

export type { ContestStatus };

export interface ContestProblemItem {
  problemId: { _id: string; title: string; slug: string; difficulty: string; visibility?: "GLOBAL" | "CONTEST" } | string;
  label: string;
}

export interface Contest {
  _id: string;
  title: string;
  slug: string;
  description: string;
  startTime: string;
  endTime: string;
  status: ContestStatus;
  problems: ContestProblemItem[];
  registered?: boolean;
  isOwner?: boolean;
  createdBy: string;
  createdAt: string;
}

export type ContestPhase = "UPCOMING" | "RUNNING" | "ENDED";

export function getContestPhase(contest: { startTime: string; endTime: string }): ContestPhase {
  const now = Date.now();
  const start = new Date(contest.startTime).getTime();
  const end = new Date(contest.endTime).getTime();

  if (now < start) return "UPCOMING";
  if (now >= end) return "ENDED";
  return "RUNNING";
}
