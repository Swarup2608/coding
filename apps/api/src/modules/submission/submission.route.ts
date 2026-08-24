import { Router } from "express";
import {authenticate} from "../../middleware/auth.middleware.js";
import {requireAdmin} from "../../middleware/admin.middleware.js";
import {createSubmissionController, getUserSubmissionsController, getSubmissionByIdController, getAllSubmissionsForAdminController} from "./submission.controller.js";

const router = Router();

router.post("/", authenticate, createSubmissionController);
router.get("/", authenticate, getUserSubmissionsController);
router.get("/admin/all", authenticate, requireAdmin, getAllSubmissionsForAdminController);
router.get("/:id", authenticate, getSubmissionByIdController);

export default router;