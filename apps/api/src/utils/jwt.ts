import jwt from "jsonwebtoken";
import { UserRole } from "@coding-platform/shared";

export interface TokenPayload {
  userId: string;
  username: string;
  role: UserRole;
}

function getSecretKey(): string {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error("[JWT_SECRET] JWT secret key is not defined in the environment variables.");
  }

  return secretKey;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecretKey(), { expiresIn: "7d", });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, getSecretKey()) as TokenPayload;
}
