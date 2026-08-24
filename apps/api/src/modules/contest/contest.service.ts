import mongoose from "mongoose";
import Contest, { IContest } from "./contest.model.js";
import ContestRegistration from "./contest-registration.model.js";
import Problem from "../problem/problem.model.js";
import TestCase from "../test-case/test-case.model.js";
import { CreateContestInput } from "./contest.types.js";
import { createSlug } from "../../utils/slug.js";
import { CreateProblemInput } from "../problem/problem.types.js";
import { CreateTestCaseInput } from "../test-case/test-case.types.js";

function assertOwnerOrAdmin(contest: IContest, userId: string, isAdmin: boolean) {
  if (isAdmin) {
    return;
  }

  if (contest.createdBy.toString() !== userId) {
    throw new Error("[FORBIDDEN] Only the contest's creator or an admin can do this");
  }
}

export async function createContest(input: CreateContestInput, userId: string) {
  const slug = createSlug(input.title);
  const existing = await Contest.findOne({ slug });

  if (existing) {
    throw new Error("[CONTEST_EXISTS] A contest with this title already exists");
  }

  if (new Date(input.endTime) <= new Date(input.startTime)) {
    throw new Error("[INVALID_CONTEST_WINDOW] End time must be after start time");
  }

  return Contest.create({
    title: input.title,
    description: input.description,
    startTime: input.startTime,
    endTime: input.endTime,
    status: input.status,
    problems: input.problems,
    slug,
    createdBy: userId,
  });
}

export async function getAllContests() {
  return Contest.find({ status: "PUBLISHED" }).sort({ startTime: -1 });
}

export async function getAllContestsForAdmin() {
  return Contest.find().populate("createdBy", "username").sort({ createdAt: -1 });
}

export async function getContestBySlug(slug: string, userId: string | undefined, isAdmin: boolean) {
  const contest = await Contest.findOne({ slug }).populate("problems.problemId", "title slug difficulty visibility");

  if (!contest) {
    throw new Error("[CONTEST_NOT_FOUND] Contest not found");
  }

  const isOwner = userId !== undefined && contest.createdBy.toString() === userId;

  if (contest.status !== "PUBLISHED" && !isAdmin && !isOwner) {
    throw new Error("[CONTEST_NOT_FOUND] Contest not found");
  }

  return contest;
}

export async function updateContest(slug: string, updates: Partial<CreateContestInput>, userId: string, isAdmin: boolean) {
  if (updates.startTime && updates.endTime && new Date(updates.endTime) <= new Date(updates.startTime)) {
    throw new Error("[INVALID_CONTEST_WINDOW] End time must be after start time");
  }

  const existing = await Contest.findOne({ slug });

  if (!existing) {
    throw new Error("[CONTEST_NOT_FOUND] Contest not found");
  }

  assertOwnerOrAdmin(existing, userId, isAdmin);

  const contest = await Contest.findOneAndUpdate({ slug }, updates, { new: true, runValidators: true });
  return contest!;
}

export async function deleteContest(slug: string, userId: string, isAdmin: boolean) {
  const contest = await Contest.findOne({ slug });

  if (!contest) {
    throw new Error("[CONTEST_NOT_FOUND] Contest not found");
  }

  assertOwnerOrAdmin(contest, userId, isAdmin);

  if (contest.status !== "DRAFT") {
    throw new Error("[CONTEST_NOT_DRAFT] Only draft contests can be deleted");
  }

  await Contest.deleteOne({ _id: contest._id });
  return contest;
}

export async function registerForContest(slug: string, userId: string) {
  const contest = await Contest.findOne({ slug, status: "PUBLISHED" });

  if (!contest) {
    throw new Error("[CONTEST_NOT_FOUND] Contest not found");
  }

  if (Date.now() >= contest.endTime.getTime()) {
    throw new Error("[CONTEST_ENDED] This contest has already ended");
  }

  const existing = await ContestRegistration.findOne({ contestId: contest._id, userId });

  if (existing) {
    return existing;
  }

  return ContestRegistration.create({ contestId: contest._id, userId });
}

export async function isRegistered(contestId: string, userId: string) {
  const registration = await ContestRegistration.findOne({ contestId, userId });
  return Boolean(registration);
}

function nextLabel(count: number): string {
  return String.fromCharCode(65 + count);
}

async function loadOwnedContest(slug: string, userId: string, isAdmin: boolean) {
  const contest = await Contest.findOne({ slug });

  if (!contest) {
    throw new Error("[CONTEST_NOT_FOUND] Contest not found");
  }

  assertOwnerOrAdmin(contest, userId, isAdmin);
  return contest;
}

// Only ever touches problems this contest created for itself — never a
// GLOBAL problem, even if a matching id somehow ended up in the URL.
async function loadOwnedContestProblem(contest: IContest, problemId: string) {
  const problem = await Problem.findOne({ _id: problemId, contestId: contest._id, visibility: "CONTEST" });

  if (!problem) {
    throw new Error("[PROBLEM_NOT_FOUND] Contest problem not found");
  }

  return problem;
}

export async function createContestProblem(
  slug: string,
  input: CreateProblemInput,
  userId: string,
  isAdmin: boolean
) {
  const contest = await loadOwnedContest(slug, userId, isAdmin);

  const problemSlug = `${createSlug(input.title)}-${contest.slug}`;
  const problem = await Problem.create({
    ...input,
    slug: problemSlug,
    status: "PUBLISHED",
    visibility: "CONTEST",
    contestId: contest._id,
    createdBy: userId,
  });

  contest.problems.push({ problemId: problem._id as mongoose.Types.ObjectId, label: nextLabel(contest.problems.length) });
  await contest.save();

  return problem;
}

export async function getContestProblemById(slug: string, problemId: string, userId: string, isAdmin: boolean) {
  const contest = await loadOwnedContest(slug, userId, isAdmin);
  return loadOwnedContestProblem(contest, problemId);
}

export async function updateContestProblem(
  slug: string,
  problemId: string,
  updates: Partial<CreateProblemInput>,
  userId: string,
  isAdmin: boolean
) {
  const contest = await loadOwnedContest(slug, userId, isAdmin);
  const problem = await loadOwnedContestProblem(contest, problemId);

  Object.assign(problem, updates);
  await problem.save();

  return problem;
}

export async function deleteContestProblem(slug: string, problemId: string, userId: string, isAdmin: boolean) {
  const contest = await loadOwnedContest(slug, userId, isAdmin);
  const problem = await loadOwnedContestProblem(contest, problemId);

  contest.problems = contest.problems.filter((p) => p.problemId.toString() !== problemId);
  await contest.save();

  await TestCase.deleteMany({ problemId: problem._id });
  await Problem.deleteOne({ _id: problem._id });

  return problem;
}

export async function listContestProblemTestCases(slug: string, problemId: string, userId: string, isAdmin: boolean) {
  const contest = await loadOwnedContest(slug, userId, isAdmin);
  const problem = await loadOwnedContestProblem(contest, problemId);

  return TestCase.find({ problemId: problem._id }).sort({ createdAt: 1 });
}

export async function addContestProblemTestCase(
  slug: string,
  problemId: string,
  input: CreateTestCaseInput,
  userId: string,
  isAdmin: boolean
) {
  const contest = await loadOwnedContest(slug, userId, isAdmin);
  const problem = await loadOwnedContestProblem(contest, problemId);

  return TestCase.create({
    problemId: problem._id,
    input: input.input,
    expectedOutput: input.expectedOutput,
    isSample: input.isSample || false,
  });
}

export async function deleteContestProblemTestCase(
  slug: string,
  problemId: string,
  testCaseId: string,
  userId: string,
  isAdmin: boolean
) {
  const contest = await loadOwnedContest(slug, userId, isAdmin);
  const problem = await loadOwnedContestProblem(contest, problemId);

  const testCase = await TestCase.findOneAndDelete({ _id: testCaseId, problemId: problem._id });

  if (!testCase) {
    throw new Error("[TEST_CASE_NOT_FOUND] Test case not found");
  }

  return testCase;
}

export async function getContestProblem(slug: string, problemSlug: string, userId: string) {
  const contest = await Contest.findOne({ slug, status: "PUBLISHED" });

  if (!contest) {
    throw new Error("[CONTEST_NOT_FOUND] Contest not found");
  }

  if (Date.now() < contest.startTime.getTime()) {
    throw new Error("[CONTEST_NOT_STARTED] This contest has not started yet");
  }

  const registered = await isRegistered(contest._id.toString(), userId);

  if (!registered) {
    throw new Error("[NOT_REGISTERED] You must register for this contest first");
  }

  const problem = await Problem.findOne({ slug: problemSlug });

  if (!problem) {
    throw new Error("[PROBLEM_NOT_FOUND] Problem not found");
  }

  const contestProblem = contest.problems.find((p) => p.problemId.toString() === problem._id.toString());

  if (!contestProblem) {
    throw new Error("[PROBLEM_NOT_IN_CONTEST] This problem is not part of the contest");
  }

  return { contest, problem, label: contestProblem.label };
}
