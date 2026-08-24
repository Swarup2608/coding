"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Problem, Language } from "@/types/problem";
import { languages } from "@/lib/languages";
import CodeEditor from "@/components/editor/CodeEditor";
import LanguageSelector from "@/components/editor/LanguageSelector";
import SubmissionResult from "@/components/editor/SubmissionResult";

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

  async function submitCode() {
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
        body: JSON.stringify({ problemId: problem._id, language, code }),
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

      const finishedStatuses = ["ACCEPTED", "WRONG_ANSWER", "TIME_LIMIT", "MEMORY_LIMIT", "RUNTIME_ERROR", "COMPILE_ERROR", "SYSTEM_ERROR"];

      if (finishedStatuses.includes(submission.status)) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  if (loading) {
    return <main className="p-10">Loading...</main>;
  }

  if (!problem) {
    return <main className="p-10">Problem not found</main>;
  }

  const config = languages[language];

  return (
    <main className="h-screen">
      <div className="grid h-full grid-cols-2">
        {/* Problem */}
        <section className="overflow-auto border-r p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{problem.title}</h1>
            <span className="mt-2 inline-block">{problem.difficulty}</span>
          </div>
          <div className="prose max-w-none">
            <p>{problem.description}</p>
            <h2>Examples</h2>
            {problem.examples.map((example, index) => (
              <div key={index} className="mb-4 rounded bg-gray-100 p-4">
                <p><strong>Input:</strong></p>
                <pre>{example.input}</pre>
                <p><strong>Output:</strong></p>
                <pre>{example.output}</pre>
                {example.explanation && <p>{example.explanation}</p>}
              </div>
            ))}
            <h2>Constraints</h2>
            <ul>
              {problem.constraints.map((constraint) => (
                <li key={constraint}>{constraint}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Editor */}
        <section className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-3">
            <LanguageSelector value={language} onChange={setLanguage} />
            <div className="flex gap-2">
              <button onClick={submitCode} disabled={submitting} className="rounded bg-black px-5 py-2 text-white disabled:opacity-50">
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
            />
          )}
        </section>
      </div>
    </main>
  );
}
