import { UserRole } from "@coding-platform/shared";

export type { UserRole };

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}
