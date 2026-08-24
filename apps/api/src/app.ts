import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import problemRoutes from "./modules/problem/problem.route.js";
import testCaseRoutes from "./modules/test-case/test-case.route.js";
import submissionRoutes from "./modules/submission/submission.route.js";
import userRoutes from "./modules/user/user.routes.js";
import contestRoutes from "./modules/contest/contest.route.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true, }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Coding platform API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/test-cases", testCaseRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contests", contestRoutes);

export default app;
