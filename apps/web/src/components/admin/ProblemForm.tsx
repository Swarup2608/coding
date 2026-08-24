"use client";

import { useState } from "react";
import { Difficulty, ProblemStatus } from "@coding-platform/shared";

export interface ProblemFormValues {
  title: string;
  description: string;
  difficulty: Difficulty;
  status: ProblemStatus;
  tags: string;
  constraints: string;
  timeLimit: number;
  memoryLimit: number;
  examples: { input: string; output: string; explanation: string }[];
  starterCode: { c: string; cpp: string; java: string; python: string; javascript: string };
}

export const emptyProblemForm: ProblemFormValues = {
  title: "",
  description: "",
  difficulty: "EASY",
  status: "DRAFT",
  tags: "",
  constraints: "",
  timeLimit: 2000,
  memoryLimit: 256,
  examples: [{ input: "", output: "", explanation: "" }],
  starterCode: { c: "", cpp: "", java: "", python: "", javascript: "" },
};

interface Props {
  initialValues: ProblemFormValues;
  submitLabel: string;
  onSubmit: (values: ProblemFormValues) => Promise<void>;
}

const inputClass = "w-full rounded-md border border-border bg-page p-3 text-fg placeholder:text-fg-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
const monoInputClass = `${inputClass} font-mono text-sm`;

export default function ProblemForm({ initialValues, submitLabel, onSubmit }: Props) {
  const [values, setValues] = useState<ProblemFormValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateExample(index: number, field: "input" | "output" | "explanation", value: string) {
    const examples = [...values.examples];
    examples[index] = { ...examples[index], [field]: value };
    setValues({ ...values, examples });
  }

  function addExample() {
    setValues({ ...values, examples: [...values.examples, { input: "", output: "", explanation: "" }] });
  }

  function removeExample(index: number) {
    setValues({ ...values, examples: values.examples.filter((_, i) => i !== index) });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <section className="space-y-4 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-semibold">Basics</h2>

        <input
          type="text"
          placeholder="Title"
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          className={inputClass}
          required
        />

        <textarea
          placeholder="Description"
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
          className={`h-32 ${inputClass}`}
          required
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <select
            value={values.difficulty}
            onChange={(e) => setValues({ ...values, difficulty: e.target.value as ProblemFormValues["difficulty"] })}
            className={inputClass}
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <select
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value as ProblemFormValues["status"] })}
            className={inputClass}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <input
            type="number"
            placeholder="Time limit (ms)"
            value={values.timeLimit}
            onChange={(e) => setValues({ ...values, timeLimit: Number(e.target.value) })}
            className={inputClass}
          />

          <input
            type="number"
            placeholder="Memory limit (MB)"
            value={values.memoryLimit}
            onChange={(e) => setValues({ ...values, memoryLimit: Number(e.target.value) })}
            className={inputClass}
          />
        </div>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={values.tags}
          onChange={(e) => setValues({ ...values, tags: e.target.value })}
          className={inputClass}
        />

        <textarea
          placeholder="Constraints (one per line)"
          value={values.constraints}
          onChange={(e) => setValues({ ...values, constraints: e.target.value })}
          className={`h-24 ${inputClass}`}
        />
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Examples</h2>
          <button type="button" onClick={addExample} className="text-sm font-medium text-accent hover:text-accent-hover">Add example</button>
        </div>

        {values.examples.map((example, index) => (
          <div key={index} className="space-y-2 rounded-md border border-border bg-page p-4">
            <div className="flex items-center justify-between text-sm text-fg-muted">
              <span>Example {index + 1}</span>
              {values.examples.length > 1 && (
                <button type="button" onClick={() => removeExample(index)} className="font-medium text-rose-600 hover:text-rose-500 dark:text-rose-400">Remove</button>
              )}
            </div>
            <textarea
              placeholder="Input"
              value={example.input}
              onChange={(e) => updateExample(index, "input", e.target.value)}
              className={`h-16 ${monoInputClass}`}
            />
            <textarea
              placeholder="Output"
              value={example.output}
              onChange={(e) => updateExample(index, "output", e.target.value)}
              className={`h-16 ${monoInputClass}`}
            />
            <textarea
              placeholder="Explanation (optional)"
              value={example.explanation}
              onChange={(e) => updateExample(index, "explanation", e.target.value)}
              className={`h-16 ${inputClass} text-sm`}
            />
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-semibold">Starter Code</h2>

        {(["python", "javascript", "cpp", "c", "java"] as const).map((lang) => (
          <div key={lang}>
            <label className="mb-1 block text-sm text-fg-muted">{lang}</label>
            <textarea
              value={values.starterCode[lang]}
              onChange={(e) => setValues({ ...values, starterCode: { ...values.starterCode, [lang]: e.target.value } })}
              className={`h-24 ${monoInputClass}`}
            />
          </div>
        ))}
      </section>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <button type="submit" disabled={submitting} className="rounded-md bg-accent px-6 py-3 font-medium text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-50">
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
