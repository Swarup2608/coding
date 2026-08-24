import { createWorkspace, writeSourceFile, cleanupWorkspace } from "../sandbox/workspace.js";
import { executeDocker } from "../sandbox/docker.executor.js";
import { classifyFailure } from "./classify-result.js";
import { outputsMatch } from "./output-compare.js";
import { ExecutionResult, Runner } from "./types.js";
import { JUDGE_LIMITS } from "../config/limits.js";

export class PythonRunner implements Runner {
  async execute(code: string, input: string, expectedOutput: string): Promise<ExecutionResult> {
    const workspace = await createWorkspace();

    try {
      await writeSourceFile(workspace, "main.py", code);

      const result = await executeDocker({
        image: "python:3.12-alpine",
        command: ["python", "/app/main.py"],
        input,
        mountPath: workspace,
        timeoutMs: JUDGE_LIMITS.executionTimeoutMs,
        readOnlyMount: true,
      });

      const failure = classifyFailure(result);
      if (failure) return failure;

      const actual = result.stdout.trim();
      return { status: outputsMatch(actual, expectedOutput) ? "ACCEPTED" : "WRONG_ANSWER", output: actual, runtimeMs: result.runtimeMs };
    } finally {
      await cleanupWorkspace(workspace);
    }
  }
}
