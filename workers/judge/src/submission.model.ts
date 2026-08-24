import mongoose, { Model, Schema, Document } from "mongoose";
import { SubmissionMode } from "@coding-platform/shared";

interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  contestId?: mongoose.Types.ObjectId;

  language: string;
  code: string;

  status: string;

  score: number;

  runtimeMs?: number;
  memoryKb?: number;

  errorMessage?: string;

  passedTests: number;
  totalTests: number;
  mode: SubmissionMode;
  testResults: unknown[];
}

const submissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, },

    problemId: { type: Schema.Types.ObjectId, required: true, },

    contestId: { type: Schema.Types.ObjectId },

    language: String,

    code: String,

    status: String,

    score: { type: Number, default: 0, },

    runtimeMs: Number,

    memoryKb: Number,

    errorMessage: String,

    passedTests: { type: Number, default: 0, },

    totalTests: { type: Number, default: 0, },
    mode: { type: String, enum: ["RUN", "SUBMIT"], default: "SUBMIT", required: true, },
    testResults: { type: [Schema.Types.Mixed], default: [] },
  },
  {
    timestamps: true,
  }
);

const Submission: Model<ISubmission> = mongoose.model<ISubmission>("Submission", submissionSchema);

export default Submission;
