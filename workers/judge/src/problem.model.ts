import mongoose, { Document, Model, Schema } from "mongoose";
import { Difficulty } from "@coding-platform/shared";

interface IProblem extends Document {
  title: string;
  difficulty: Difficulty;
}

const schema = new Schema<IProblem>({
  title: String,
  difficulty: { type: String, enum: ["EASY", "MEDIUM", "HARD"] },
});

const Problem: Model<IProblem> = mongoose.model<IProblem>("Problem", schema);

export default Problem;
