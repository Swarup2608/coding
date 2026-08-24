import { mkdir, writeFile, rm, chmod } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";

export async function createWorkspace() {
  const id = randomUUID();
  const directory = path.join(os.tmpdir(), `judge-${id}`);
  await mkdir(directory, { recursive: true });
  // The container runs as a fixed non-root uid (1000:1000), which won't
  // generally match the host user that created this directory — open it up
  // so a compile step can still write the binary into the bind mount.
  await chmod(directory, 0o777);
  return directory;
}

export async function writeSourceFile(directory: string, filename: string, code: string) {
  const filePath = path.join(directory, filename);
  await writeFile(filePath, code, "utf8");
  return filePath;
}

export async function cleanupWorkspace(directory: string) {
  await rm(directory, { recursive: true, force: true });
}
