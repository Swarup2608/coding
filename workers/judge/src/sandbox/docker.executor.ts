import { spawn } from "node:child_process";
import { JUDGE_LIMITS } from "../config/limits.js";

export interface DockerExecutionOptions {
  image: string;
  command: string[];
  input: string;
  mountPath: string;
  timeoutMs: number;
  // Compile steps need to write a binary into the workspace; execute steps don't.
  readOnlyMount?: boolean;
}

export interface DockerExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  outputExceeded: boolean;
  // A Docker/infra failure (missing image, daemon down, spawn error) — never
  // conflate this with the submitted code's own behavior (timeout, crash, etc).
  systemError: boolean;
  runtimeMs: number;
}

export function executeDocker(options: DockerExecutionOptions): Promise<DockerExecutionResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    const mountMode = options.readOnlyMount === false ? "rw" : "ro";

    const docker = spawn(
      "docker",
      [
        "run",
        "--rm",
        "--network", "none",
        "--cpus", "1",
        "--memory", `${JUDGE_LIMITS.memoryMb}m`,
        "--memory-swap", `${JUDGE_LIMITS.memoryMb}m`,
        "--pids-limit", `${JUDGE_LIMITS.maxProcesses}`,
        "--read-only",
        "--tmpfs", "/tmp:rw,noexec,nosuid,size=64m",
        "--cap-drop", "ALL",
        "--security-opt", "no-new-privileges",
        "--user", "1000:1000",
        "-i",
        "-v", `${options.mountPath}:/app:${mountMode}`,
        options.image,
        ...options.command,
      ],
      { stdio: ["pipe", "pipe", "pipe"] }
    );

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let outputExceeded = false;

    function killForOutputOverflow() {
      outputExceeded = true;
      docker.kill("SIGKILL");
    }

    docker.stdout.on("data", (data) => {
      stdout += data.toString();
      if (Buffer.byteLength(stdout) > JUDGE_LIMITS.maxOutputBytes) killForOutputOverflow();
    });

    docker.stderr.on("data", (data) => {
      stderr += data.toString();
      if (Buffer.byteLength(stderr) > JUDGE_LIMITS.maxOutputBytes) killForOutputOverflow();
    });

    docker.stdin.write(options.input);
    docker.stdin.end();

    const timer = setTimeout(() => {
      timedOut = true;
      docker.kill("SIGKILL");
    }, options.timeoutMs);

    docker.on("close", (exitCode) => {
      clearTimeout(timer);
      // Exit code 125 is Docker's own reserved signal that `docker run` itself
      // failed (missing image, daemon rejected the request, etc.) — distinct
      // from the containerized program's own exit code, which is what every
      // other exitCode value here actually represents.
      const systemError = !timedOut && exitCode === 125;
      resolve({ stdout, stderr, exitCode, timedOut, outputExceeded, systemError, runtimeMs: Date.now() - start });
    });

    docker.on("error", (error) => {
      clearTimeout(timer);
      resolve({ stdout, stderr: error.message, exitCode: null, timedOut: false, outputExceeded: false, systemError: true, runtimeMs: Date.now() - start });
    });
  });
}
