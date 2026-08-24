import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { getUserProfile, getAllUsers } from "./user.service.js";

export async function getMyProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const result = await getUserProfile(req.user!.userId);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(404).json({ success: false, message: error instanceof Error ? error.message : "User not found" });
  }
}

export async function getAllUsersController(req: AuthenticatedRequest, res: Response) {
  try {
    const users = await getAllUsers();
    return res.json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: "[USERS_FETCH_FAILED] Failed to fetch users", error: error instanceof Error ? error.message : String(error) });
  }
}
