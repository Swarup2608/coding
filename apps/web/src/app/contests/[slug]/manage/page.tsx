"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import ContestForm, { ContestFormValues } from "@/components/contest/ContestForm";
import ProblemForm, { emptyProblemForm, ProblemFormValues } from "@/components/admin/ProblemForm";
import { Contest, ContestProblemItem } from "@/types/contest";

function toFormValues(contest: Contest): ContestFormValues {
  return {
    title: contest.title,
    description: contest.description,
    startTime: toDatetimeLocal(contest.startTime),
    endTime: toDatetimeLocal(contest.endTime),
    status: contest.status,
    problems: contest.problems
      .filter((p) => typeof p.problemId !== "string" && p.problemId.visibility !== "CONTEST")
      .map((p) => {
        const problem = typeof p.problemId === "string" ? { _id: p.problemId, title: "Problem" } : p.problemId;
        return { problemId: problem._id, title: problem.title, label: p.label };
      }),
  };
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ManageContestPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user, loading: userLoading } = useCurrentUser();

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewProblemForm, setShowNewProblemForm] = useState(false);

  async function loadContest() {
    setLoading(true);
    try {
      const response = await apiRequest<{ success: boolean; data: Contest }>(`/contests/${slug}`);
      setContest(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContest();
  }, [slug]);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/login");
    }
  }, [userLoading, user, router]);

  async function handleUpdate(values: ContestFormValues) {
    await apiRequest(`/contests/${slug}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
        status: values.status,
        // Preserve existing contest-only problems; only the "attach existing" list is editable here.
        problems: [
          ...(contest?.problems.filter((p) => typeof p.problemId !== "string" && p.problemId.visibility === "CONTEST").map((p) => ({
            problemId: typeof p.problemId === "string" ? p.problemId : p.problemId._id,
            label: p.label,
          })) ?? []),
          ...values.problems.map((p) => ({ problemId: p.problemId, label: p.label })),
        ],
      }),
    });

    await loadContest();
  }

  async function handleCreateContestProblem(values: ProblemFormValues) {
    await apiRequest(`/contests/${slug}/manage/problems`, {
      method: "POST",
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

    setShowNewProblemForm(false);
    await loadContest();
  }

  async function handleRemoveContestProblem(problemId: string) {
    if (!confirm("Remove this problem from the contest? It will be permanently deleted.")) {
      return;
    }

    await apiRequest(`/contests/${slug}/manage/problems/${problemId}`, { method: "DELETE" });
    await loadContest();
  }

  if (loading || userLoading || !contest) {
    return <main className="p-10 text-fg-muted">Loading...</main>;
  }

  if (!contest.isOwner) {
    return (
      <main className="p-10 text-fg-muted">
        You don't have permission to manage this contest.
        <div className="mt-4">
          <Link href={`/contests/${slug}`} className="text-accent hover:text-accent-hover">Back to contest</Link>
        </div>
      </main>
    );
  }

  const contestOnlyProblems = contest.problems.filter(
    (p): p is ContestProblemItem & { problemId: { _id: string; title: string; slug: string; difficulty: string; visibility?: string } } =>
      typeof p.problemId !== "string" && p.problemId.visibility === "CONTEST"
  );

  return (
    <main className="mx-auto w-full max-w-3xl p-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage {contest.title}</h1>
        <Link href={`/contests/${slug}`} className="text-sm text-accent hover:text-accent-hover">View contest &rarr;</Link>
      </div>

      <ContestForm initialValues={toFormValues(contest)} submitLabel="Save Changes" onSubmit={handleUpdate} />

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Contest-only problems</h2>
          <button
            onClick={() => setShowNewProblemForm(!showNewProblemForm)}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
          >
            {showNewProblemForm ? "Cancel" : "+ New Problem"}
          </button>
        </div>
        <p className="text-sm text-fg-muted">
          These problems belong only to this contest — they never show up in the public problem list.
        </p>

        {contestOnlyProblems.length === 0 && !showNewProblemForm && (
          <p className="text-fg-muted">No contest-only problems yet.</p>
        )}

        <div className="space-y-2">
          {contestOnlyProblems.map((cp) => (
            <div key={cp.problemId._id} className="flex items-center justify-between rounded-md border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className="w-6 font-semibold text-fg-muted">{cp.label}</span>
                <span>{cp.problemId.title}</span>
                <span className="text-xs text-fg-muted">{cp.problemId.difficulty}</span>
              </div>
              <div className="flex gap-4 text-sm">
                <Link href={`/contests/${slug}/manage/problems/${cp.problemId._id}`} className="font-medium text-accent hover:text-accent-hover">Edit</Link>
                <button onClick={() => handleRemoveContestProblem(cp.problemId._id)} className="font-medium text-rose-600 hover:text-rose-500 dark:text-rose-400">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {showNewProblemForm && (
          <div className="rounded-xl border border-border bg-surface p-6">
            <ProblemForm initialValues={emptyProblemForm} submitLabel="Create Contest Problem" onSubmit={handleCreateContestProblem} />
          </div>
        )}
      </section>
    </main>
  );
}
