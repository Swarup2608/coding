import mongoose, { Document, Model, Schema } from "mongoose";

interface IUserStats extends Document {
  userId: mongoose.Types.ObjectId;
  solvedProblems: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
}

const schema = new Schema<IUserStats>({
  userId: { type: Schema.Types.ObjectId, required: true, unique: true },
  solvedProblems: { type: Number, default: 0 },
  easySolved: { type: Number, default: 0 },
  mediumSolved: { type: Number, default: 0 },
  hardSolved: { type: Number, default: 0 },
  totalSubmissions: { type: Number, default: 0 },
  acceptedSubmissions: { type: Number, default: 0 },
});

const UserStats: Model<IUserStats> = mongoose.model<IUserStats>("UserStats", schema);

export default UserStats;
