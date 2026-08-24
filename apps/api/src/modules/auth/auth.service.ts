import bcrypt from "bcrypt";

import User from "./user.model.js";
import { LoginInput, RegisterInput } from "./auth.types.js";

import { generateToken } from "../../utils/jwt.js";

export async function register(input: RegisterInput) {
  const { username, email, password } = input;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    throw new Error("[USER_EXISTS] User with this email or username already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ username, email, password: hashedPassword });

  const token = generateToken({ userId: user._id.toString(), username: user.username, role: user.role });

  return {
    user: { id: user._id.toString(), username: user.username, email: user.email, role: user.role },
    token,
  };
}

export async function login(input: LoginInput) {
  const { email, password } = input;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("[INVALID_CREDENTIALS] Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new Error("[INVALID_CREDENTIALS] Invalid email or password.");
  }

  const token = generateToken({ userId: user._id.toString(), username: user.username, role: user.role });

  return {
    user: { id: user._id.toString(), username: user.username, email: user.email, role: user.role },
    token,
  };
}
