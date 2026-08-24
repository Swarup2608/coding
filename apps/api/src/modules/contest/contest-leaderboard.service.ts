import Contest from "./contest.model.js";
import ContestRegistration from "./contest-registration.model.js";
import Submission from "../submission/submission.model.js";
import { TERMINAL_SUBMISSION_STATUSES } from "@coding-platform/shared";

const WRONG_SUBMISSION_PENALTY_MINUTES = 20;

interface ProblemResult {
  label: string;
  solved: boolean;
  attempts: number;
  penaltyMinutes: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  rank: number;
  totalSolved: number;
  totalPenalty: number;
  problems: ProblemResult[];
}

// ICPC-style scoring: rank by problems solved (desc), tie-broken by total
// penalty minutes (asc). Penalty = minutes from contest start to the accepted
// submission, plus 20 minutes for every wrong attempt made before it. Wrong
// attempts on a problem that's never solved don't count toward penalty.
export async function computeLeaderboard(slug: string): Promise<LeaderboardEntry[]> {
  const contest = await Contest.findOne({ slug, status: "PUBLISHED" });

  if (!contest) {
    throw new Error("[CONTEST_NOT_FOUND] Contest not found");
  }

  const registrations = await ContestRegistration.find({ contestId: contest._id }).populate("userId", "username");

  const rawSubmissions = await Submission.find({
    contestId: contest._id,
    mode: "SUBMIT",
    status: { $in: TERMINAL_SUBMISSION_STATUSES },
  }).sort({ createdAt: 1 });

  const submissions = rawSubmissions.map((s) => ({
    userId: s.userId.toString(),
    problemId: s.problemId.toString(),
    status: s.status,
    createdAt: s.createdAt as Date,
  }));

  const entries: LeaderboardEntry[] = registrations
    .filter((registration) => registration.userId)
    .map((registration) => {
      const user = registration.userId as unknown as { _id: { toString(): string }; username: string };
      const userId = user._id.toString();

      const problems: ProblemResult[] = contest.problems.map((contestProblem) => {
        const problemId = contestProblem.problemId.toString();
        const attempts = submissions.filter((s) => s.userId === userId && s.problemId === problemId);

        let wrongCount = 0;
        let acceptedAt: Date | null = null;

        for (const attempt of attempts) {
          if (attempt.status === "ACCEPTED") {
            acceptedAt = attempt.createdAt;
            break;
          }
          wrongCount++;
        }

        if (!acceptedAt) {
          return { label: contestProblem.label, solved: false, attempts: wrongCount, penaltyMinutes: 0 };
        }

        const minutesSinceStart = Math.floor((acceptedAt.getTime() - contest.startTime.getTime()) / 60000);
        const penaltyMinutes = minutesSinceStart + wrongCount * WRONG_SUBMISSION_PENALTY_MINUTES;

        return { label: contestProblem.label, solved: true, attempts: wrongCount + 1, penaltyMinutes };
      });

      const totalSolved = problems.filter((p) => p.solved).length;
      const totalPenalty = problems.reduce((sum, p) => sum + (p.solved ? p.penaltyMinutes : 0), 0);

      return { userId, username: user.username, rank: 0, totalSolved, totalPenalty, problems };
    });

  entries.sort((a, b) => (b.totalSolved !== a.totalSolved ? b.totalSolved - a.totalSolved : a.totalPenalty - b.totalPenalty));

  let rank = 0;
  entries.forEach((entry, index) => {
    const previous = entries[index - 1];
    if (index === 0 || entry.totalSolved !== previous.totalSolved || entry.totalPenalty !== previous.totalPenalty) {
      rank = index + 1;
    }
    entry.rank = rank;
  });

  return entries;
}
