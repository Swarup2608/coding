import mongoose, { Document, Model, Schema } from "mongoose";
import { ContestStatus } from "@coding-platform/shared";

export interface IContestProblem {
  problemId: mongoose.Types.ObjectId;
  label: string;
}

export interface IContest extends Document {
  title: string;
  slug: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: ContestStatus;
  problems: IContestProblem[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contestProblemSchema = new Schema<IContestProblem>(
  {
    problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const contestSchema = new Schema<IContest>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["DRAFT", "PUBLISHED"], default: "DRAFT", index: true },
    problems: { type: [contestProblemSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Contest: Model<IContest> = mongoose.model<IContest>("Contest", contestSchema);

export default Contest;
