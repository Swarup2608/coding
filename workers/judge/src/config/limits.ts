export const JUDGE_LIMITS = {
  memoryMb: 256,
  executionTimeoutMs: 3000,
  compilationTimeoutMs: 10000,
  maxOutputBytes: 1024 * 1024,
  maxProcesses: 50,
} as const;
