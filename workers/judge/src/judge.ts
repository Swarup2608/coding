import Submission from "./submission.model.js";
import TestCase from "./test-case.model.js";
import { getRunner } from "./runners/runner.factory.js";
import { Language } from "./runners/types.js";
import { TestResult } from "./runners/test-result.js";
import { updateProgress } from "./progress.service.js";

export async function judgeSubmission(submissionId: string) {
  const submission = await Submission.findById(submissionId);

  if (!submission) {
    throw new Error("Submission not found");
  }

  await Submission.findByIdAndUpdate(submissionId, { status: "RUNNING" });

  const filter: Record<string, unknown> = { problemId: submission.problemId };

  // RUN only executes sample tests; SUBMIT executes everything, hidden included.
  if (submission.mode === "RUN") {
    filter.isSample = true;
  }

  const testCases = await TestCase.find(filter).sort({ createdAt: 1 });
  const runner = getRunner(submission.language as Language);

  let passedTests = 0;
  let totalRuntime = 0;
  const testResults: TestResult[] = [];

  for (let index = 0; index < testCases.length; index++) {
    const testCase = testCases[index];
    const result = await runner.execute(submission.code, testCase.input, testCase.expectedOutput);

    totalRuntime += result.runtimeMs;

    const passed = result.status === "ACCEPTED";
    if (passed) {
      passedTests++;
    }

    testResults.push({
      testCaseNumber: index + 1,
      status: result.status === "ACCEPTED" ? "PASSED" : result.status,
      // Hidden tests never expose their input/expected/actual output to the client.
      input: testCase.isSample ? testCase.input : "",
      expectedOutput: testCase.isSample ? testCase.expectedOutput : "",
      actualOutput: testCase.isSample ? result.output : "",
      runtimeMs: result.runtimeMs,
      error: result.error,
      isSample: testCase.isSample,
    });

    if (!passed) {
      await Submission.findByIdAndUpdate(submissionId, {
        status: result.status,
        runtimeMs: totalRuntime,
        passedTests,
        totalTests: testCases.length,
        errorMessage: result.error,
        testResults,
      });

      return;
    }
  }

  await Submission.findByIdAndUpdate(submissionId, {
    status: "ACCEPTED",
    runtimeMs: totalRuntime,
    passedTests,
    totalTests: testCases.length,
    score: 100,
    testResults,
  });

  await updateProgress(submissionId);
}
