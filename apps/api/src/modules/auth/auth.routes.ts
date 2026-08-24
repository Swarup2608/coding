import { Router } from "express";

import { getMe, loginController, logoutController, registerController } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", authenticate, getMe);

export default router;
