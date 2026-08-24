"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import ProblemForm, { ProblemFormValues } from "@/components/admin/ProblemForm";
import { Problem } from "@/types/problem";

interface TestCase {
  _id: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

function toFormValues(problem: Problem): ProblemFormValues {
  return {
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    status: problem.status,
    tags: problem.tags.join(", "),
    constraints: problem.constraints.join("\n"),
    timeLimit: problem.timeLimit,
    memoryLimit: problem.memoryLimit,
    examples: problem.examples.length ? problem.examples.map((e) => ({ input: e.input, output: e.output, explanation: e.explanation || "" })) : [{ input: "", output: "", explanation: "" }],
    starterCode: problem.starterCode,
  };
}

export default function EditContestProblemPage() {
  const params = useParams();
  const slug = params.slug as string;
  const problemId = params.problemId as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProblem() {
    const response = await apiRequest<{ success: boolean; data: Problem }>(`/contests/${slug}/manage/problems/${problemId}`);
    setProblem(response.data);
    setLoading(false);
  }

  useEffect(() => {
    loadProblem();
  }, [slug, problemId]);

  async function handleUpdate(values: ProblemFormValues) {
    await apiRequest(`/contests/${slug}/manage/problems/${problemId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        difficulty: values.difficulty,
        tags: values.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        constraints: values.constraints.split("\n").map((line) => line.trim()).filter(Boolean),
        examples: values.examples.filter((example) => example.input || example.output),
        starterCode: values.starterCode,
        timeLimit: values.timeLimit,
        memoryLimit: values.memoryLimit,
      }),
    });

    await loadProblem();
  }

  if (loading || !problem) {
    return <main className="p-10 text-fg-muted">Loading...</main>;
  }

  return (
    <main className="p-10">
      <h1 className="mb-8 text-3xl font-bold">Edit {problem.title}</h1>
      <ProblemForm initialValues={toFormValues(problem)} submitLabel="Save Changes" onSubmit={handleUpdate} />

      <hr className="my-10 max-w-3xl border-border" />

      <TestCaseManager slug={slug} problemId={problemId} />
    </main>
  );
}

function TestCaseManager({ slug, problemId }: { slug: string; problemId: string }) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [isSample, setIsSample] = useState(false);
  const [adding, setAdding] = useState(false);

  const baseUrl = `/contests/${slug}/manage/problems/${problemId}/test-cases`;

  async function loadTestCases() {
    const response = await apiRequest<{ success: boolean; data: TestCase[] }>(baseUrl);
    setTestCases(response.data);
    setLoading(false);
  }

  useEffect(() => {
    loadTestCases();
  }, [slug, problemId]);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setAdding(true);

    try {
      await apiRequest(baseUrl, { method: "POST", body: JSON.stringify({ input, expectedOutput, isSample }) });
      setInput("");
      setExpectedOutput("");
      setIsSample(false);
      await loadTestCases();
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this test case?")) {
      return;
    }

    await apiRequest(`${baseUrl}/${id}`, { method: "DELETE" });
    loadTestCases();
  }

  return (
    <section className="max-w-3xl space-y-6">
      <h2 className="text-xl font-bold">Test Cases</h2>

      {loading ? (
        <p className="text-fg-muted">Loading test cases...</p>
      ) : (
        <div className="space-y-3">
          {testCases.length === 0 && <p className="text-fg-muted">No test cases yet.</p>}

          {testCases.map((testCase) => (
            <div key={testCase._id} className="rounded-md border border-border bg-surface p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className={testCase.isSample ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-fg-muted"}>
                  {testCase.isSample ? "Sample (visible to users)" : "Hidden"}
                </span>
                <button onClick={() => handleDelete(testCase._id)} className="font-medium text-rose-600 hover:text-rose-500 dark:text-rose-400">Delete</button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-fg-muted">Input</div>
                  <pre className="mt-1 overflow-auto rounded bg-page p-2 font-mono">{testCase.input}</pre>
                </div>
                <div>
                  <div className="text-fg-muted">Expected Output</div>
                  <pre className="mt-1 overflow-auto rounded bg-page p-2 font-mono">{testCase.expectedOutput}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="space-y-3 rounded-xl border border-border bg-surface p-4">
        <h3 className="font-semibold">Add Test Case</h3>

        <textarea
          placeholder="Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-20 w-full rounded-md border border-border bg-page p-2 font-mono text-sm placeholder:text-fg-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          required
        />

        <textarea
          placeholder="Expected Output"
          value={expectedOutput}
          onChange={(e) => setExpectedOutput(e.target.value)}
          className="h-20 w-full rounded-md border border-border bg-page p-2 font-mono text-sm placeholder:text-fg-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          required
        />

        <label className="flex items-center gap-2 text-sm text-fg-muted">
          <input type="checkbox" checked={isSample} onChange={(e) => setIsSample(e.target.checked)} />
          Sample test case (visible to users)
        </label>

        <button type="submit" disabled={adding} className="rounded-md bg-accent px-5 py-2 font-medium text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-50">
          {adding ? "Adding..." : "Add Test Case"}
        </button>
      </form>
    </section>
  );
}
