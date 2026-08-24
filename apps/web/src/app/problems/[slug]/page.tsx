"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Problem, Language } from "@/types/problem";
import { languages } from "@/lib/languages";
import CodeEditor from "@/components/editor/CodeEditor";
import LanguageSelector from "@/components/editor/LanguageSelector";
import SubmissionResult from "@/components/editor/SubmissionResult";
import Badge from "@/components/ui/Badge";
import { difficultyTone } from "@/lib/badges";
import { TERMINAL_SUBMISSION_STATUSES } from "@coding-platform/shared";

export default function ProblemPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<Language>("CPP");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    async function loadProblem() {
      try {
        const response = await apiRequest<{ success: boolean; data: Problem }>(`/problems/${slug}`);
        setProblem(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProblem();
  }, [slug]);

  useEffect(() => {
    if (!problem) {
      return;
    }

    const config = languages[language];
    setCode(problem.starterCode[config.starterKey]);
  }, [problem, language]);

  async function runCode() {
    await executeCode("RUN");
  }

  async function submitCode() {
    await executeCode("SUBMIT");
  }

  async function executeCode(mode: "RUN" | "SUBMIT") {
    if (!problem) {
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const response = await apiRequest<{
        success: boolean;
        data: { _id: string; status: string; passedTests: number; totalTests: number };
      }>("/submissions", {
        method: "POST",
        body: JSON.stringify({ problemId: problem._id, language, code, mode }),
      });

      const submissionId = response.data._id;
      await pollSubmission(submissionId);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  async function pollSubmission(submissionId: string) {
    const maxAttempts = 30;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await apiRequest<{ success: boolean; data: any }>(`/submissions/${submissionId}`);
      const submission = response.data;
      setResult(submission);

      if ((TERMINAL_SUBMISSION_STATUSES as readonly string[]).includes(submission.status)) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  if (loading) {
    return <main className="p-10 text-fg-muted">Loading...</main>;
  }

  if (!problem) {
    return <main className="p-10 text-fg-muted">Problem not found</main>;
  }

  const config = languages[language];

  return (
    <main className="min-h-0 flex-1 bg-page">
      <div className="grid h-full grid-cols-2">
        {/* Problem */}
        <section className="overflow-auto border-r border-border bg-surface p-8">
          <div className="mb-6 flex items-center gap-3">
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <Badge tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Badge>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <span key={tag} className="rounded bg-surface-hover px-2 py-1 text-xs text-fg-muted">{tag}</span>
            ))}
          </div>

          <p className="whitespace-pre-line leading-relaxed text-fg">{problem.description}</p>

          <h2 className="mb-3 mt-8 text-lg font-semibold">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, index) => (
              <div key={index} className="rounded-lg border border-border bg-page p-4 text-sm">
                <p className="mb-1 font-semibold text-fg-muted">Example {index + 1}</p>
                <p className="mt-2 font-medium">Input:</p>
                <pre className="mt-1 overflow-auto rounded bg-surface-hover p-2 font-mono">{example.input}</pre>
                <p className="mt-2 font-medium">Output:</p>
                <pre className="mt-1 overflow-auto rounded bg-surface-hover p-2 font-mono">{example.output}</pre>
                {example.explanation && <p className="mt-2 text-fg-muted">{example.explanation}</p>}
              </div>
            ))}
          </div>

          {problem.constraints.length > 0 && (
            <>
              <h2 className="mb-3 mt-8 text-lg font-semibold">Constraints</h2>
              <ul className="list-inside list-disc space-y-1 text-sm text-fg-muted">
                {problem.constraints.map((constraint) => (
                  <li key={constraint} className="font-mono">{constraint}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* Editor */}
        <section className="flex h-full flex-col bg-page">
          <div className="flex items-center justify-between border-b border-border bg-surface p-3">
            <LanguageSelector value={language} onChange={setLanguage} />
            <div className="flex gap-2">
              <button
                onClick={runCode}
                disabled={submitting}
                className="rounded-md border border-border px-5 py-2 font-medium transition-colors hover:bg-surface-hover disabled:opacity-50"
              >
                Run
              </button>
              <button
                onClick={submitCode}
                disabled={submitting}
                className="rounded-md bg-accent px-5 py-2 font-medium text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {submitting ? "Running..." : "Submit"}
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1">
            <CodeEditor language={config.monacoLanguage} value={code} onChange={(value) => setCode(value || "")} />
          </div>
          {result && (
            <SubmissionResult
              status={result.status}
              passedTests={result.passedTests}
              totalTests={result.totalTests}
              runtimeMs={result.runtimeMs}
              errorMessage={result.errorMessage}
              testResults={result.testResults}
            />
          )}
        </section>
      </div>
    </main>
  );
}
