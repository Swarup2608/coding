import { createWorkspace, writeSourceFile, cleanupWorkspace } from "../sandbox/workspace.js";
import { executeDocker } from "../sandbox/docker.executor.js";
import { classifyFailure } from "./classify-result.js";
import { outputsMatch } from "./output-compare.js";
import { ExecutionResult, Runner } from "./types.js";
import { JUDGE_LIMITS } from "../config/limits.js";

export class CppRunner implements Runner {
  async execute(code: string, input: string, expectedOutput: string): Promise<ExecutionResult> {
    const workspace = await createWorkspace();

    try {
      await writeSourceFile(workspace, "main.cpp", code);

      const compileResult = await executeDocker({
        image: "gcc:14",
        command: ["g++", "/app/main.cpp", "-O2", "-std=c++17", "-o", "/app/main"],
        input: "",
        mountPath: workspace,
        timeoutMs: JUDGE_LIMITS.compilationTimeoutMs,
        readOnlyMount: false,
      });

      const compileFailure = classifyFailure(compileResult, "COMPILE_ERROR");
      if (compileFailure) return compileFailure;

      const runResult = await executeDocker({
        image: "gcc:14",
        command: ["/app/main"],
        input,
        mountPath: workspace,
        timeoutMs: JUDGE_LIMITS.executionTimeoutMs,
        readOnlyMount: true,
      });

      const runFailure = classifyFailure(runResult);
      if (runFailure) return runFailure;

      const actual = runResult.stdout.trim();
      return { status: outputsMatch(actual, expectedOutput) ? "ACCEPTED" : "WRONG_ANSWER", output: actual, runtimeMs: runResult.runtimeMs };
    } finally {
      await cleanupWorkspace(workspace);
    }
  }
}
