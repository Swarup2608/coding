import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import {
  createContest,
  getAllContests,
  getAllContestsForAdmin,
  getContestBySlug,
  updateContest,
  deleteContest,
  registerForContest,
  isRegistered,
  getContestProblem,
  getContestProblemById,
  createContestProblem,
  updateContestProblem,
  deleteContestProblem,
  listContestProblemTestCases,
  addContestProblemTestCase,
  deleteContestProblemTestCase,
} from "./contest.service.js";
import { computeLeaderboard } from "./contest-leaderboard.service.js";

export async function createContestController(req: AuthenticatedRequest, res: Response) {
  try {
    const contest = await createContest(req.body, req.user!.userId);
    return res.status(201).json({ success: true, data: contest });
  } catch (error) {
    return res.status(500).json({ success: false, message: "[CONTEST_CREATE_FAILED] Failed to create contest", error: error instanceof Error ? error.message : String(error) });
  }
}

export async function getAllContestsController(req: Request, res: Response) {
  try {
    const contests = await getAllContests();
    return res.status(200).json({ success: true, data: contests });
  } catch (error) {
    return res.status(500).json({ success: false, message: "[CONTESTS_FETCH_FAILED] Failed to fetch contests", error: error instanceof Error ? error.message : String(error) });
  }
}

export async function getAllContestsForAdminController(req: Request, res: Response) {
  try {
    const contests = await getAllContestsForAdmin();
    return res.status(200).json({ success: true, data: contests });
  } catch (error) {
    return res.status(500).json({ success: false, message: "[CONTESTS_FETCH_FAILED] Failed to fetch contests", error: error instanceof Error ? error.message : String(error) });
  }
}

export async function getContestBySlugController(req: AuthenticatedRequest & { params: { slug: string } }, res: Response) {
  try {
    const contest = await getContestBySlug(req.params.slug, req.user?.userId, req.user?.role === "ADMIN");
    const registered = req.user ? await isRegistered(contest._id.toString(), req.user.userId) : false;
    const isOwner = req.user ? contest.createdBy.toString() === req.user.userId || req.user.role === "ADMIN" : false;
    return res.status(200).json({ success: true, data: { ...contest.toObject(), registered, isOwner } });
  } catch (error) {
    return res.status(404).json({ success: false, message: error instanceof Error ? error.message : "[CONTEST_NOT_FOUND] Contest not found" });
  }
}

export async function updateContestController(req: AuthenticatedRequest & { params: { slug: string } }, res: Response) {
  try {
    const contest = await updateContest(req.params.slug, req.body, req.user!.userId, req.user!.role === "ADMIN");
    return res.status(200).json({ success: true, data: contest });
  } catch (error) {
    return res.status(error instanceof Error && error.message.startsWith("[FORBIDDEN]") ? 403 : 500).json({ success: false, message: error instanceof Error ? error.message : "[CONTEST_UPDATE_FAILED] Failed to update contest" });
  }
}

export async function deleteContestController(req: AuthenticatedRequest & { params: { slug: string } }, res: Response) {
  try {
    const contest = await deleteContest(req.params.slug, req.user!.userId, req.user!.role === "ADMIN");
    return res.status(200).json({ success: true, data: contest });
  } catch (error) {
    return res.status(error instanceof Error && error.message.startsWith("[FORBIDDEN]") ? 403 : 400).json({ success: false, message: error instanceof Error ? error.message : "[CONTEST_DELETE_FAILED] Failed to delete contest" });
  }
}

export async function createContestProblemController(req: AuthenticatedRequest & { params: { slug: string } }, res: Response) {
  try {
    const problem = await createContestProblem(req.params.slug, req.body, req.user!.userId, req.user!.role === "ADMIN");
    return res.status(201).json({ success: true, data: problem });
  } catch (error) {
    return res.status(error instanceof Error && error.message.startsWith("[FORBIDDEN]") ? 403 : 500).json({ success: false, message: error instanceof Error ? error.message : "[CONTEST_PROBLEM_CREATE_FAILED] Failed to create contest problem" });
  }
}

export async function getContestProblemByIdController(req: AuthenticatedRequest & { params: { slug: string; problemId: string } }, res: Response) {
  try {
    const problem = await getContestProblemById(req.params.slug, req.params.problemId, req.user!.userId, req.user!.role === "ADMIN");
    return res.status(200).json({ success: true, data: problem });
  } catch (error) {
    return res.status(error instanceof Error && error.message.startsWith("[FORBIDDEN]") ? 403 : 404).json({ success: false, message: error instanceof Error ? error.message : "[CONTEST_PROBLEM_FETCH_FAILED] Failed to fetch contest problem" });
  }
}

export async function updateContestProblemController(req: AuthenticatedRequest & { params: { slug: string; problemId: string } }, res: Response) {
  try {
    const problem = await updateContestProblem(req.params.slug, req.params.problemId, req.body, req.user!.userId, req.user!.role === "ADMIN");
    return res.status(200).json({ success: true, data: problem });
  } catch (error) {
    return res.status(error instanceof Error && error.message.startsWith("[FORBIDDEN]") ? 403 : 500).json({ success: false, message: error instanceof Error ? error.message : "[CONTEST_PROBLEM_UPDATE_FAILED] Failed to update contest problem" });
  }
}

export async function deleteContestProblemController(req: AuthenticatedRequest & { params: { slug: string; problemId: string } }, res: Response) {
  try {
    const problem = await deleteContestProblem(req.params.slug, req.params.problemId, req.user!.userId, req.user!.role === "ADMIN");
    return res.status(200).json({ success: true, data: problem });
  } catch (error) {
    return res.status(error instanceof Error && error.message.startsWith("[FORBIDDEN]") ? 403 : 500).json({ success: false, message: error instanceof Error ? error.message : "[CONTEST_PROBLEM_DELETE_FAILED] Failed to delete contest problem" });
  }
}

export async function listContestProblemTestCasesController(req: AuthenticatedRequest & { params: { slug: string; problemId: string } }, res: Response) {
  try {
    const testCases = await listContestProblemTestCases(req.params.slug, req.params.problemId, req.user!.userId, req.user!.role === "ADMIN");
    return res.status(200).json({ success: true, data: testCases });
  } catch (error) {
    return res.status(error instanceof Error && error.message.startsWith("[FORBIDDEN]") ? 403 : 500).json({ success: false, message: error instanceof Error ? error.message : "[TEST_CASES_FETCH_FAILED] Failed to fetch test cases" });
  }
}

export async function addContestProblemTestCaseController(req: AuthenticatedRequest & { params: { slug: string; problemId: string } }, res: Response) {
  try {
    const testCase = await addContestProblemTestCase(req.params.slug, req.params.problemId, req.body, req.user!.userId, req.user!.role === "ADMIN");
    return res.status(201).json({ success: true, data: testCase });
  } catch (error) {
    return res.status(error instanceof Error && error.message.startsWith("[FORBIDDEN]") ? 403 : 500).json({ success: false, message: error instanceof Error ? error.message : "[TEST_CASE_CREATE_FAILED] Failed to create test case" });
  }
}

export async function deleteContestProblemTestCaseController(req: AuthenticatedRequest & { params: { slug: string; problemId: string; testCaseId: string } }, res: Response) {
  try {
    const testCase = await deleteContestProblemTestCase(req.params.slug, req.params.problemId, req.params.testCaseId, req.user!.userId, req.user!.role === "ADMIN");
    return res.status(200).json({ success: true, data: testCase });
  } catch (error) {
    return res.status(error instanceof Error && error.message.startsWith("[FORBIDDEN]") ? 403 : 500).json({ success: false, message: error instanceof Error ? error.message : "[TEST_CASE_DELETE_FAILED] Failed to delete test case" });
  }
}

export async function registerController(req: AuthenticatedRequest & { params: { slug: string } }, res: Response) {
  try {
    const registration = await registerForContest(req.params.slug, req.user!.userId);
    return res.status(200).json({ success: true, data: registration });
  } catch (error) {
    return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "[CONTEST_REGISTER_FAILED] Failed to register" });
  }
}

export async function getContestProblemController(
  req: AuthenticatedRequest & { params: { slug: string; problemSlug: string } },
  res: Response
) {
  try {
    const result = await getContestProblem(req.params.slug, req.params.problemSlug, req.user!.userId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(403).json({ success: false, message: error instanceof Error ? error.message : "[CONTEST_PROBLEM_FETCH_FAILED] Failed to fetch problem" });
  }
}

export async function leaderboardController(req: Request & { params: { slug: string } }, res: Response) {
  try {
    const leaderboard = await computeLeaderboard(req.params.slug);
    return res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    return res.status(404).json({ success: false, message: error instanceof Error ? error.message : "[LEADERBOARD_FETCH_FAILED] Failed to compute leaderboard" });
  }
}
