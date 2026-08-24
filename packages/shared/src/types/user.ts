export type UserRole = "USER" | "ADMIN";

export interface UserStats {
  solvedProblems: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
}
