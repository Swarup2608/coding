import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireAdmin } from "../../middleware/admin.middleware.js";
import { getMyProfile, getAllUsersController } from "./user.controller.js";

const router = Router();

router.get("/me", authenticate, getMyProfile);
router.get("/", authenticate, requireAdmin, getAllUsersController);

export default router;
