export interface TestResult {
  testCaseNumber: number;
  status: "PASSED" | "WRONG_ANSWER" | "TIME_LIMIT" | "RUNTIME_ERROR" | "COMPILE_ERROR" | "SYSTEM_ERROR";
  input: string;
  expectedOutput: string;
  actualOutput: string;
  runtimeMs: number;
  error?: string;
  isSample: boolean;
}
