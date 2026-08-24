import Submission from "./submission.model.js";
import Problem from "./problem.model.js";
import UserStats from "./user-stats.model.js";

export async function updateProgress(submissionId: string) {
  const submission = await Submission.findById(submissionId);

  if (!submission) {
    return;
  }

  if (submission.status !== "ACCEPTED") {
    return;
  }

  // Only an official SUBMIT counts toward solved/accepted stats — a Run must never mark a problem solved.
  if (submission.mode !== "SUBMIT") {
    return;
  }

  const previousAccepted = await Submission.findOne({
    userId: submission.userId,
    problemId: submission.problemId,
    status: "ACCEPTED",
    mode: "SUBMIT",
    _id: { $ne: submission._id },
  });

  const update: Record<string, unknown> = { $inc: { acceptedSubmissions: 1 } };

  if (!previousAccepted) {
    const problem = await Problem.findById(submission.problemId);

    if (!problem) {
      return;
    }

    const inc = update.$inc as Record<string, number>;
    inc.solvedProblems = 1;

    switch (problem.difficulty) {
      case "EASY":
        inc.easySolved = 1;
        break;
      case "MEDIUM":
        inc.mediumSolved = 1;
        break;
      case "HARD":
        inc.hardSolved = 1;
        break;
    }
  }

  await UserStats.findOneAndUpdate({ userId: submission.userId }, update, { upsert: true });
}
