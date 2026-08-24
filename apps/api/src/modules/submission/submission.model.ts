import mongoose, { Document, Model, Schema } from "mongoose";
import { SubmissionLanguage, SubmissionStatus } from "./submission.types.js";
import { SubmissionMode } from "@coding-platform/shared";

export interface ITestResult {
  testCaseNumber: number;
  status: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  runtimeMs: number;
  error?: string;
  isSample: boolean;
}

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  contestId?: mongoose.Types.ObjectId;
  language: SubmissionLanguage;
  code: string;
  status: SubmissionStatus;
  score?: number;
  runtimeMs?: number;
  memoryKb?: number;
  errorMessage?: string;
  passedTests: number;
  totalTests: number;
  createdAt: Date;
  updatedAt: Date;
  mode: SubmissionMode;
  testResults: ITestResult[];
}

const submissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true, index: true },
    contestId: { type: Schema.Types.ObjectId, ref: "Contest", index: true },
    language: { type: String, enum: ["C", "CPP", "JAVA", "PYTHON", "JAVASCRIPT"], required: true },
    code: { type: String, required: true },
    status: { type: String, enum: ["QUEUED", "COMPILING", "RUNNING", "ACCEPTED", "WRONG_ANSWER", "TIME_LIMIT", "MEMORY_LIMIT", "RUNTIME_ERROR", "COMPILE_ERROR", "SYSTEM_ERROR"], default: "QUEUED", index: true },
    score: { type: Number, default: 0 },
    runtimeMs: { type: Number },
    memoryKb: { type: Number },
    errorMessage: { type: String },
    passedTests: { type: Number, default: 0 },
    totalTests: { type: Number, default: 0 },
    mode: { type: String, enum: ["RUN", "SUBMIT"], default: "SUBMIT", required: true },
    testResults: {
      type: [
        {
          testCaseNumber: Number,
          status: String,
          input: String,
          expectedOutput: String,
          actualOutput: String,
          runtimeMs: Number,
          error: String,
          isSample: Boolean,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Submission: Model<ISubmission> = mongoose.model<ISubmission>("Submission", submissionSchema);

export default Submission;
