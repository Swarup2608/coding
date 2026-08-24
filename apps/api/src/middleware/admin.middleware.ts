import {NextFunction, Response} from "express";
import {AuthenticatedRequest} from "./auth.middleware.js";

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({success: false, message: "[UNAUTHORIZED] No user information found."});
    }
    if(req.user.role !== "ADMIN") {
        return res.status(403).json({success: false, message: "[FORBIDDEN] You do not have permission to access this resource."});
    }
    next();
}