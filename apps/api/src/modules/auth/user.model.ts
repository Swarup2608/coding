import mongoose, { Document, Model, Schema } from "mongoose";
import { UserRole } from "@coding-platform/shared";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true, },

    email: { type: String, required: true, unique: true, lowercase: true, trim: true, },

    password: { type: String, required: true, select: false, },

    role: { type: String, enum: ["USER", "ADMIN"], default: "USER", },

    rating: { type: Number, default: 1500, },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
