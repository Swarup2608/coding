"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { ContestStatus } from "@coding-platform/shared";

export interface ContestFormValues {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: ContestStatus;
  problems: { problemId: string; title: string; label: string }[];
}

export const emptyContestForm: ContestFormValues = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  status: "DRAFT",
  problems: [],
};

interface GlobalProblem {
  _id: string;
  title: string;
  difficulty: string;
}

interface Props {
  initialValues: ContestFormValues;
  submitLabel: string;
  onSubmit: (values: ContestFormValues) => Promise<void>;
}

const inputClass = "w-full rounded-md border border-border bg-page p-3 text-fg placeholder:text-fg-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

function nextLabel(count: number): string {
  return String.fromCharCode(65 + count);
}

export default function ContestForm({ initialValues, submitLabel, onSubmit }: Props) {
  const [values, setValues] = useState<ContestFormValues>(initialValues);
  const [globalProblems, setGlobalProblems] = useState<GlobalProblem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProblems() {
      // Public, published problems only — anyone creating a contest can attach these.
      const response = await apiRequest<{ success: boolean; data: GlobalProblem[] }>("/problems");
      setGlobalProblems(response.data);
    }

    loadProblems();
  }, []);

  function toggleProblem(problem: GlobalProblem, checked: boolean) {
    if (checked) {
      setValues({
        ...values,
        problems: [...values.problems, { problemId: problem._id, title: problem.title, label: nextLabel(values.problems.length) }],
      });
    } else {
      setValues({ ...values, problems: values.problems.filter((p) => p.problemId !== problem._id) });
    }
  }

  function updateLabel(problemId: string, label: string) {
    setValues({
      ...values,
      problems: values.problems.map((p) => (p.problemId === problemId ? { ...p, label } : p)),
    });
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

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-fg-muted">Start time</label>
            <input
              type="datetime-local"
              value={values.startTime}
              onChange={(e) => setValues({ ...values, startTime: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-fg-muted">End time</label>
            <input
              type="datetime-local"
              value={values.endTime}
              onChange={(e) => setValues({ ...values, endTime: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-fg-muted">Status</label>
            <select
              value={values.status}
              onChange={(e) => setValues({ ...values, status: e.target.value as ContestStatus })}
              className={inputClass}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-semibold">Attach existing problems</h2>
        <p className="text-sm text-fg-muted">
          Pick from published problems and set their contest label (A, B, C...). Want a problem just for this
          contest instead? Add it from the contest management page after creating it.
        </p>

        <div className="max-h-72 space-y-2 overflow-auto">
          {globalProblems.map((problem) => {
            const selected = values.problems.find((p) => p.problemId === problem._id);
            return (
              <div key={problem._id} className="flex items-center gap-3 rounded-md border border-border p-3">
                <input
                  type="checkbox"
                  checked={Boolean(selected)}
                  onChange={(e) => toggleProblem(problem, e.target.checked)}
                />
                <span className="flex-1">{problem.title}</span>
                <span className="text-xs text-fg-muted">{problem.difficulty}</span>
                {selected && (
                  <input
                    type="text"
                    value={selected.label}
                    onChange={(e) => updateLabel(problem._id, e.target.value)}
                    className="w-14 rounded border border-border bg-page p-1 text-center text-sm"
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <button type="submit" disabled={submitting} className="rounded-md bg-accent px-6 py-3 font-medium text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-50">
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
