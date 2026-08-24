import User from "../auth/user.model.js";
import UserStats from "./user-stats.model.js";

export async function getUserProfile(userId: string) {
  const user = await User.findById(userId).select("username email role createdAt");

  if (!user) {
    throw new Error("User not found");
  }

  let stats = await UserStats.findOne({ userId });

  if (!stats) {
    stats = await UserStats.create({ userId });
  }

  return { user, stats };
}

export async function getAllUsers() {
  return User.find().select("username email role rating createdAt").sort({ createdAt: -1 });
}
