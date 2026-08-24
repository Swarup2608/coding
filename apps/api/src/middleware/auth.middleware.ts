import { NextFunction, Request, Response } from "express";

import { TokenPayload, verifyToken } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "[UNAUTHORIZED] No token provided." });
    }

    req.user = verifyToken(token);

    next();
  } catch {
    return res.status(401).json({ success: false, message: "[UNAUTHORIZED] Invalid or expired token." });
  }
}

// Populates req.user when a valid token is present, but never rejects the
// request — for routes that are publicly viewable but personalized when logged in.
export function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token;

    if (token) {
      req.user = verifyToken(token);
    }
  } catch {
    // Ignore an invalid/expired token — treat the request as anonymous.
  }

  next();
}
