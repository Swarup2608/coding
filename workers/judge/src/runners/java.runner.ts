import { createWorkspace, writeSourceFile, cleanupWorkspace } from "../sandbox/workspace.js";
import { executeDocker } from "../sandbox/docker.executor.js";
import { classifyFailure } from "./classify-result.js";
import { outputsMatch } from "./output-compare.js";
import { ExecutionResult, Runner } from "./types.js";
import { JUDGE_LIMITS } from "../config/limits.js";

export class JavaRunner implements Runner {
  async execute(code: string, input: string, expectedOutput: string): Promise<ExecutionResult> {
    const workspace = await createWorkspace();

    try {
      await writeSourceFile(workspace, "Main.java", code);

      const compileResult = await executeDocker({
        image: "eclipse-temurin:21-jdk-alpine",
        command: ["javac", "/app/Main.java"],
        input: "",
        mountPath: workspace,
        timeoutMs: JUDGE_LIMITS.compilationTimeoutMs,
        readOnlyMount: false,
      });

      const compileFailure = classifyFailure(compileResult, "COMPILE_ERROR");
      if (compileFailure) return compileFailure;

      const runResult = await executeDocker({
        image: "eclipse-temurin:21-jdk-alpine",
        command: ["java", "-Xmx256m", "-cp", "/app", "Main"],
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
