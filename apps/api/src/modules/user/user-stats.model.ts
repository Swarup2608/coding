import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUserStats extends Document {
  userId: mongoose.Types.ObjectId;
  solvedProblems: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  createdAt: Date;
  updatedAt: Date;
}

const userStatsSchema = new Schema<IUserStats>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    solvedProblems: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserStats: Model<IUserStats> = mongoose.model<IUserStats>("UserStats", userStatsSchema);

export default UserStats;
