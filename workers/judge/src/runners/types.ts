export type { Language } from "@coding-platform/shared";

export type ExecutionStatus = "ACCEPTED" | "WRONG_ANSWER" | "RUNTIME_ERROR" | "TIME_LIMIT" | "COMPILE_ERROR" | "SYSTEM_ERROR";

export interface ExecutionResult {
  status: ExecutionStatus;
  output: string;
  runtimeMs: number;
  error?: string;
}

export interface Runner {
  execute(code: string, input: string, expectedOutput: string): Promise<ExecutionResult>;
}
