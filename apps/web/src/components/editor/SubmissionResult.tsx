"use client";

interface Props {
  status: string;
  passedTests: number;
  totalTests: number;
  runtimeMs?: number;
  errorMessage?: string;
}

export default function SubmissionResult({ status, passedTests, totalTests, runtimeMs, errorMessage }: Props) {
  return (
    <div className="border-t p-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-semibold">{status}</span>
          <span className="ml-4 text-gray-500">{passedTests}/{totalTests} tests</span>
        </div>
        {runtimeMs !== undefined && <span className="text-sm text-gray-500">{runtimeMs} ms</span>}
      </div>
      {errorMessage && <pre className="mt-4 overflow-auto rounded bg-red-50 p-4 text-sm text-red-700">{errorMessage}</pre>}
    </div>
  );
}
