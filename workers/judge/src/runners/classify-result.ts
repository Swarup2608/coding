import { DockerExecutionResult } from "../sandbox/docker.executor.js";
import { ExecutionResult, ExecutionStatus } from "./types.js";

// Maps a raw Docker run outcome to a terminal ExecutionResult, or null if the
// process exited cleanly and the caller should go compare stdout.
// Infra failures (systemError) are never conflated with the submitted code's
// own behavior (timeout, crash) — that distinction is what makes TIME_LIMIT
// results trustworthy instead of a catch-all for "something went wrong".
export function classifyFailure(
  result: DockerExecutionResult,
  runtimeErrorStatus: ExecutionStatus = "RUNTIME_ERROR"
): ExecutionResult | null {
  if (result.systemError) {
    return {
      status: "SYSTEM_ERROR",
      output: "",
      runtimeMs: result.runtimeMs,
      error: result.stderr || "Judge infrastructure error",
    };
  }

  if (result.timedOut) {
    return {
      status: "TIME_LIMIT",
      output: result.stdout.trim(),
      runtimeMs: result.runtimeMs,
      error: "Execution exceeded time limit",
    };
  }

  if (result.outputExceeded) {
    return {
      status: "TIME_LIMIT",
      output: result.stdout.trim(),
      runtimeMs: result.runtimeMs,
      error: "Output exceeded the size limit",
    };
  }

  if (result.exitCode !== 0) {
    return {
      status: runtimeErrorStatus,
      output: result.stdout.trim(),
      runtimeMs: result.runtimeMs,
      error: result.stderr.trim(),
    };
  }

  return null;
}
