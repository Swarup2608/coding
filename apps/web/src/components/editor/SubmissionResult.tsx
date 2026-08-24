"use client";

import Badge from "@/components/ui/Badge";
import { submissionStatusTone, toneTextClass } from "@/lib/badges";

interface TestResult {
  testCaseNumber: number;
  status: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  runtimeMs: number;
  error?: string;
  isSample: boolean;
}

interface Props {
  status: string;
  passedTests: number;
  totalTests: number;
  runtimeMs?: number;
  errorMessage?: string;
  testResults?: TestResult[];
}

export default function SubmissionResult({ status, passedTests, totalTests, runtimeMs, errorMessage, testResults = [] }: Props) {
  return (
    <div className="border-t border-border bg-surface">
      <div className="flex items-center justify-between p-5">
        <div>
          <div className={`text-lg font-semibold ${toneTextClass(submissionStatusTone(status))}`}>{status.replaceAll("_", " ")}</div>
          <div className="text-sm text-fg-muted">{passedTests}/{totalTests} tests passed</div>
        </div>
        {runtimeMs !== undefined && <div className="text-sm text-fg-muted">{runtimeMs} ms</div>}
      </div>

      <div className="max-h-72 overflow-auto border-t border-border">
        {testResults.map((test) => (
          <div key={test.testCaseNumber} className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Test Case {test.testCaseNumber}</span>
              <Badge tone={submissionStatusTone(test.status)}>{test.status.replaceAll("_", " ")}</Badge>
            </div>

            {test.isSample && (
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <strong className="text-fg-muted">Input:</strong>
                  <pre className="mt-1 overflow-auto rounded bg-page p-2 font-mono">{test.input}</pre>
                </div>
                <div>
                  <strong className="text-fg-muted">Expected:</strong>
                  <pre className="mt-1 overflow-auto rounded bg-page p-2 font-mono">{test.expectedOutput}</pre>
                </div>
                <div>
                  <strong className="text-fg-muted">Output:</strong>
                  <pre className="mt-1 overflow-auto rounded bg-page p-2 font-mono">{test.actualOutput}</pre>
                </div>
              </div>
            )}

            {test.error && <pre className="mt-3 overflow-auto rounded bg-rose-500/10 p-3 text-sm text-rose-600 dark:text-rose-400">{test.error}</pre>}
          </div>
        ))}
      </div>

      {errorMessage && <pre className="overflow-auto border-t border-border bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400">{errorMessage}</pre>}
    </div>
  );
}
