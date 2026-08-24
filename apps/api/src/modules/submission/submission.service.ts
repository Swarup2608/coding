import Submission from "./submission.model.js";
import Problem from "../problem/problem.model.js";
import { CreateSubmissionInput } from "./submission.types.js";
import TestCase from "../test-case/test-case.model.js";
import { submissionQueue } from "../../queue/submission.queue.js";
import UserStats from "../user/user-stats.model.js";
import Contest from "../contest/contest.model.js";
import ContestRegistration from "../contest/contest-registration.model.js";

async function assertValidContestSubmission(contestId: string, problemId: string, userId: string) {
    const contest = await Contest.findOne({ _id: contestId, status: "PUBLISHED" });

    if (!contest) {
        throw new Error("[CONTEST_NOT_FOUND] Contest not found");
    }

    const now = Date.now();

    if (now < contest.startTime.getTime() || now >= contest.endTime.getTime()) {
        throw new Error("[CONTEST_NOT_RUNNING] This contest is not currently running");
    }

    const registered = await ContestRegistration.findOne({ contestId, userId });

    if (!registered) {
        throw new Error("[NOT_REGISTERED] You must register for this contest first");
    }

    const belongsToContest = contest.problems.some((p) => p.problemId.toString() === problemId);

    if (!belongsToContest) {
        throw new Error("[PROBLEM_NOT_IN_CONTEST] This problem is not part of the contest");
    }
}

export async function createSubmission(userId: string, input: CreateSubmissionInput) {
    const problem = await Problem.findOne({
        _id: input.problemId,
        status: "PUBLISHED",
    });

    if (!problem) {
        throw new Error("[PROBLEM_NOT_FOUND] Problem not found");
    }

    if (!input.code.trim()) {
        throw new Error("[SUBMISSION_CODE_EMPTY] Submission code cannot be empty");
    }

    if (input.contestId) {
        await assertValidContestSubmission(input.contestId, input.problemId, userId);
    }

    const testCases = await TestCase.countDocuments({ problemId: input.problemId, isSample: false });
    const submission = await Submission.create({
        userId,
        problemId: input.problemId,
        contestId: input.contestId,
        language: input.language,
        code: input.code,
        mode: input.mode,
        status: "QUEUED",
        totalTests: testCases,
    });

    await submissionQueue.add("judge-submission",{
        submissionId: submission._id.toString(),
    });

    if (input.mode === "SUBMIT") {
        await UserStats.findOneAndUpdate({ userId }, { $inc: { totalSubmissions: 1 } }, { upsert: true });
    }

    return submission;
}

export async function getSubmissionById(submissionId: string, userId: string) {
    const submission = await Submission.findOne({
        _id: submissionId,
        userId,
    })
        .populate(
            "problemId",
            "title slug difficulty"
        )
        .select(
            "-__v"
        );

    if (!submission) {
        throw new Error("[SUBMISSION_NOT_FOUND] Submission not found");
    }

    return submission;
}

export async function getUserSubmissions(userId: string, problemId?: string) {
    return Submission.find(
        { userId, ...(problemId ? { problemId } : {}) }
    ).populate("problemId", "title slug difficulty")
    .select("problemId language status score runtimeMs passedTests totalTests createdAt")
    .sort({ createdAt: -1 });
}

export async function getAllSubmissionsForAdmin() {
    return Submission.find()
        .populate("problemId", "title slug difficulty")
        .populate("userId", "username email")
        .select("userId problemId language mode status score runtimeMs passedTests totalTests createdAt")
        .sort({ createdAt: -1 })
        .limit(200);
}
