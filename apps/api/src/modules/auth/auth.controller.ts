import { Request, Response } from "express";

import { login, register } from "./auth.service.js";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

const isProduction = process.env.NODE_ENV === "production";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

export async function registerController(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "[MISSING_FIELDS] Username, email and password are required." });
    }

    const { user, token } = await register({ username, email, password });

    res.cookie("token", token, { ...cookieOptions, maxAge: COOKIE_MAX_AGE });

    return res.status(201).json({ success: true, data: { user } });
  } catch (error) {
    return res.status(400).json({ success: false, message: (error as Error).message || "[UNKNOWN_ERROR] An unknown error occurred." });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "[MISSING_FIELDS] Email and password are required." });
    }

    const { user, token } = await login({ email, password });

    res.cookie("token", token, { ...cookieOptions, maxAge: COOKIE_MAX_AGE });

    return res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    return res.status(401).json({ success: false, message: (error as Error).message || "[UNKNOWN_ERROR] An unknown error occurred." });
  }
}

export function logoutController(_req: Request, res: Response) {
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({ success: true, message: "Logged out successfully." });
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  return res.json({ success: true, data: req.user });
}
