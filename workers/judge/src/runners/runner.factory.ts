import { Language, Runner } from "./types.js";
import { PythonRunner } from "./python.runner.js";
import { JavaScriptRunner } from "./javascript.runner.js";
import { CRunner } from "./c.runner.js";
import { CppRunner } from "./cpp.runner.js";
import { JavaRunner } from "./java.runner.js";

export function getRunner(language: Language): Runner {
  switch (language) {
    case "PYTHON": return new PythonRunner();
    case "JAVASCRIPT": return new JavaScriptRunner();
    case "C": return new CRunner();
    case "CPP": return new CppRunner();
    case "JAVA": return new JavaRunner();
    default: throw new Error(`Unsupported language: ${language}`);
  }
}
