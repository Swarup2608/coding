import mongoose, { Document, Model, Schema } from "mongoose";

import { ProblemDifficulty, ProblemStatus, StarterCode, ProblemExample } from "./problem.types.js";

export interface IProblem extends Document {
  title: string;
  slug: string;

  description: string;

  difficulty: ProblemDifficulty;

  tags: string[];

  constraints: string[];

  examples: ProblemExample[];

  starterCode: StarterCode;

  timeLimit: number;
  memoryLimit: number;

  status: ProblemStatus;

  visibility: "GLOBAL" | "CONTEST";

  contestId?: mongoose.Types.ObjectId;

  createdBy: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const starterCodeSchema = new Schema<StarterCode>(
  {
    c: { type: String, default: "", },

    cpp: { type: String, default: "", },

    java: { type: String, default: "", },

    python: { type: String, default: "", },

    javascript: { type: String, default: "", },
  },
  {
    _id: false,
  }
);

const exampleSchema = new Schema<ProblemExample>(
  {
    input: { type: String, required: true, },

    output: { type: String, required: true, },

    explanation: { type: String, },
  },
  {
    _id: false,
  }
);

const problemSchema = new Schema<IProblem>(
  {
    title: { type: String, required: true, trim: true, },

    slug: { type: String, required: true, unique: true, index: true, },

    description: { type: String, required: true, },

    difficulty: { type: String, enum: ["EASY", "MEDIUM", "HARD"], required: true, },

    tags: { type: [String], default: [], index: true, },

    constraints: { type: [String], default: [], },

    examples: { type: [exampleSchema], default: [], },

    starterCode: { type: starterCodeSchema, default: {}, },

    timeLimit: { type: Number, default: 2000, },

    memoryLimit: { type: Number, default: 256, },

    status: { type: String, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], default: "DRAFT", index: true, },

    visibility: { type: String, enum: ["GLOBAL", "CONTEST"], default: "GLOBAL", index: true, },

    contestId: { type: Schema.Types.ObjectId, ref: "Contest", index: true, },
  },
  {
    timestamps: true,
  }
);

const Problem: Model<IProblem> = mongoose.model<IProblem>("Problem", problemSchema);

export default Problem;
