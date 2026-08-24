"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import { difficultyTone, problemStatusTone } from "@/lib/badges";

interface AdminProblem {
  _id: string;
  title: string;
  slug: string;
  difficulty: string;
  status: string;
  createdAt: string;
}

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProblems() {
    setLoading(true);
    const response = await apiRequest<{ success: boolean; data: AdminProblem[] }>("/problems/admin/all");
    setProblems(response.data);
    setLoading(false);
  }

  useEffect(() => {
    loadProblems();
  }, []);

  async function handleArchive(slug: string) {
    if (!confirm(`Archive "${slug}"? It will be hidden from the public problem list.`)) {
      return;
    }

    await apiRequest(`/problems/${slug}`, { method: "DELETE" });
    loadProblems();
  }

  if (loading) {
    return <main className="p-10 text-fg-muted">Loading problems...</main>;
  }

  return (
    <main className="p-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Problems</h1>
        <Link href="/admin/problems/new" className="rounded-md bg-accent px-5 py-2 font-medium text-accent-fg transition-colors hover:bg-accent-hover">New Problem</Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-surface-hover">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Title</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Difficulty</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Status</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Created</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id} className="border-t border-border bg-surface transition-colors hover:bg-surface-hover">
                <td className="p-4 font-medium">{problem.title}</td>
                <td className="p-4"><Badge tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Badge></td>
                <td className="p-4"><Badge tone={problemStatusTone(problem.status)}>{problem.status}</Badge></td>
                <td className="p-4 text-fg-muted">{new Date(problem.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="flex gap-4 text-sm">
                    <Link href={`/admin/problems/${problem.slug}`} className="font-medium text-accent hover:text-accent-hover">Edit</Link>
                    {problem.status !== "ARCHIVED" && (
                      <button onClick={() => handleArchive(problem.slug)} className="font-medium text-rose-600 hover:text-rose-500 dark:text-rose-400">Archive</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
