import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../../middleware/auth.middleware.js";
import { requireAdmin } from "../../middleware/admin.middleware.js";
import {
  createContestController,
  getAllContestsController,
  getAllContestsForAdminController,
  getContestBySlugController,
  updateContestController,
  deleteContestController,
  registerController,
  getContestProblemController,
  leaderboardController,
  getContestProblemByIdController,
  createContestProblemController,
  updateContestProblemController,
  deleteContestProblemController,
  listContestProblemTestCasesController,
  addContestProblemTestCaseController,
  deleteContestProblemTestCaseController,
} from "./contest.controller.js";

const router = Router();

// Any authenticated user can create and own a contest — not admin-only.
// Ownership (creator or admin) is enforced inside the service for mutations.
router.post("/", authenticate, createContestController);
router.get("/admin/all", authenticate, requireAdmin, getAllContestsForAdminController);
router.get("/", getAllContestsController);
router.get("/:slug", optionalAuthenticate, getContestBySlugController);
router.patch("/:slug", authenticate, updateContestController);
router.delete("/:slug", authenticate, deleteContestController);
router.post("/:slug/register", authenticate, registerController);

// Solving: public-shaped path, gated by registration + contest window.
router.get("/:slug/problems/:problemSlug", authenticate, getContestProblemController);

// Managing: separate "manage" prefix so it never collides with the solve
// route above — both would otherwise be GET /:slug/problems/:something.
router.post("/:slug/manage/problems", authenticate, createContestProblemController);
router.get("/:slug/manage/problems/:problemId", authenticate, getContestProblemByIdController);
router.patch("/:slug/manage/problems/:problemId", authenticate, updateContestProblemController);
router.delete("/:slug/manage/problems/:problemId", authenticate, deleteContestProblemController);
router.get("/:slug/manage/problems/:problemId/test-cases", authenticate, listContestProblemTestCasesController);
router.post("/:slug/manage/problems/:problemId/test-cases", authenticate, addContestProblemTestCaseController);
router.delete("/:slug/manage/problems/:problemId/test-cases/:testCaseId", authenticate, deleteContestProblemTestCaseController);

router.get("/:slug/leaderboard", leaderboardController);

export default router;
